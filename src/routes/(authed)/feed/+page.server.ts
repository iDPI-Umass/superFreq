import type { PageServerLoad, Actions } from './$types'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { add, parseISO } from 'date-fns'

let loadData = true
let updateReaction = false

let batchIterator = 0
const feedItems = [] as App.RowData[]
let feedItemCount = 0
let totalAvailableItems = 0
let remaining = 0

let nowPlayingPostId: string
let updatedReactionActive: boolean
let updatedReactionCount: number

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const batchSize = 5
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    if ( loadData ) {
        const { feedData, totalRowCount, remainingCount } = await selectFeedData( sessionUserId, batchSize, batchIterator, feedItemCount, timestampStart, timestampEnd, options )
        feedItems.push(...feedData)
        feedItemCount = feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = remainingCount as number

        loadData = false
    }

    if ( updateReaction ) {
        const reaction = feedItems.find((item) => (item.now_playing_post_id == nowPlayingPostId)) as App.RowData

        reaction.reaction_active = updatedReactionActive
        reaction.reaction_count = updatedReactionCount

        updateReaction = false
    }

    return { sessionUserId, feedItems, totalAvailableItems, remaining } 
}

export const actions = {
    loadMore: async() => {
        batchIterator ++
        loadData = true
        return { loadData }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const { reaction, reactionCount } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        nowPlayingPostId = postId
        updatedReactionActive = reaction.active as boolean
        updatedReactionCount = reactionCount as number
        updateReaction = reaction ? true : false

        return { updateReaction }
    }
} satisfies Actions
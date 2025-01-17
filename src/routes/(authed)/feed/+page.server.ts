import type { PageServerLoad, Actions } from './$types'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { insertPostFlag } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction, deletePost } from '$lib/resources/backend-calls/posts'
import { selectListSessionUserCollections, saveItemToCollection } from '$lib/resources/backend-calls/collections'
import { add } from 'date-fns'

let sessionUserId: string
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

let saveItemPostId: string
let sessionUserCollections = [] as App.RowData[]

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent()
    sessionUserId = session?.user.id as string
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
        loadData = !loadData
    }

    if ( updateReaction ) {
        const reaction = feedItems.find((item) => (item.now_playing_post_id == nowPlayingPostId)) as App.RowData

        reaction.reaction_active = updatedReactionActive
        reaction.reaction_count = updatedReactionCount

        updateReaction = false
        loadData = true
    }

    return { sessionUserId, feedItems, totalAvailableItems, remaining, sessionUserCollections } 
}

export const actions = {
    loadMore: async() => {
        batchIterator ++
        loadData = true
        return { loadData }
    },
    submitReaction: async ({ request }) => {
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const { reaction, reactionCount } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        nowPlayingPostId = postId
        updatedReactionActive = reaction.active as boolean
        updatedReactionCount = reactionCount as number

        updateReaction = reaction ? true : false
        loadData = reaction ? false : true

        return { updateReaction }
    },
    flagPost: async ({ request }) => {
        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const userActionSuccess = flag ? true : false

        return { userActionSuccess }
    },
    deletePost: async ({ request }) => {
        const data = await request.formData()
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const success = submitDelete ? true : false

        return { success }
    },
    getCollectionList: async ({ request }) => {
        const data = await request.formData()
        saveItemPostId = data.get('post-id') as string

        if ( sessionUserCollections.length == 0 ) {
            sessionUserCollections = await selectListSessionUserCollections(sessionUserId)
        }
        return { showCollectionsModal: true }
    },
    saveToCollection: async ({ request }) => {
        const data = await request.formData()
        const collectionId = data.get('collection-id') as string

        const update = await saveItemToCollection( sessionUserId, saveItemPostId, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
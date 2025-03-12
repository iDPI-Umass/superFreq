// @ts-nocheck
import type { PageServerLoad, Actions } from '../$types'
import { selectFirehoseFeed } from '$lib/resources/backend-calls/feed'
import { insertPostFlag } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction, deletePost } from '$lib/resources/backend-calls/posts'
import { validStringCheck } from '$lib/resources/parseData'
import { selectListSessionUserCollections, saveItemToCollection } from '$lib/resources/backend-calls/collections'
import { add } from 'date-fns'

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

export const load = async ({ locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {
    const {session} = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const batchSize = 20
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})

    if ( loadData ) {
        const { feedData, totalRowCount } = await selectFirehoseFeed( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd )
        feedItems.push(...feedData)
        feedItemCount = feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = totalRowCount - feedItemCount

        loadData = !loadData
    }

    if ( updateReaction ) {
        const reactionPost = feedItems.find((item) => (item.now_playing_post_id == nowPlayingPostId)) as App.RowData

        reactionPost.reaction_count = updatedReactionCount

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
    submitReaction: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

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
    flagPost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const userActionSuccess = flag ? true : false

        return { userActionSuccess }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const success = submitDelete ? true : false

        return { success }
    },
    getCollectionList: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        saveItemPostId = data.get('post-id') as string

        if ( sessionUserCollections.length == 0 ) {
            sessionUserCollections = await selectListSessionUserCollections(sessionUserId)
        }
        return { showCollectionsModal: true }
    },
    saveToCollection: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const collectionId = data.get('collection-id') as string

        const update = await saveItemToCollection( sessionUserId, saveItemPostId, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
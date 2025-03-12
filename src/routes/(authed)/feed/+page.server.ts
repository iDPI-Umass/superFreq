import type { PageServerLoad, Actions } from './$types'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { insertPostFlag } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction, deletePost } from '$lib/resources/backend-calls/posts'
import { selectListSessionUserCollections, saveItemToCollection } from '$lib/resources/backend-calls/collections'
import { add } from 'date-fns'

let loadData = true
let updateReaction = false

let batchIterator = 0
const feedItems = [] as App.RowData[]
let feedItemCount = 0
let totalAvailableItems = 0
let remaining = 0

let postId: string
let updatedReactionActive: boolean
let updatedReactionCount: number

let saveItemPostId: string
let sessionUserCollections = [] as App.RowData[]

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string
    const batchSize = 20
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    if ( loadData ) {
        const { feedData, totalRowCount } = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options )
        feedItems.push(...feedData)
        feedItemCount = feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = totalRowCount - feedItemCount
        loadData = !loadData
    }

    if ( updateReaction ) {
        updateReaction = false
        loadData = true

        const postIndex = feedItems.findIndex((element) => element.post_id == postId)
        feedItems[postIndex]['reaction_count'] = updatedReactionCount

        if ( updatedReactionActive ) {
            feedItems[postIndex]['reaction_user_ids'].push(sessionUserId)
        }
        else if ( !updatedReactionActive ) {
            const reactionIndex = feedItems[postIndex]['reaction_user_ids'].findIndex((element) => {element == sessionUserId})
            feedItems[postIndex]['reaction_user_ids'].splice(reactionIndex, 1)
        }
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
        postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const { reaction, reactionCount } = await insertUpdateReaction( sessionUserId, postId, reactionType )

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
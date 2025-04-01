import type { PageServerLoad, Actions } from '../$types'
import { selectFirehoseFeed } from '$lib/resources/backend-calls/feed'
import { insertPostFlag } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction, deletePost } from '$lib/resources/backend-calls/posts'
import { validStringCheck } from '$lib/resources/parseData'
import { selectListSessionUserCollections, saveItemToCollection } from '$lib/resources/backend-calls/collections'
import { add } from 'date-fns'
import { feedData } from 'src/lib/resources/states.svelte'


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
    const {session} = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const batchSize = 20
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})

    if ( loadData && ( batchSize * ( batchIterator + 1 ) != feedItems.length )) {

        feedData.feedItems.length = batchIterator * batchSize

        const select = await selectFirehoseFeed( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd )

        const totalRowCount = select.totalRowCount
        const selectedFeedData = select.feedData

        feedData.feedItems.push(...selectedFeedData)
        feedItemCount = feedData.feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = totalRowCount - feedItemCount

        loadData = !loadData
    }

    if ( updateReaction ) {
        updateReaction = false

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

    return { sessionUserId, feedItems: feedData.feedItems, totalAvailableItems, remaining, sessionUserCollections } 
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

        const { reaction } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        updateReaction = reaction ? true : false

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
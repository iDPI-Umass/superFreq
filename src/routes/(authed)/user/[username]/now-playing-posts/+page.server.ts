import type { PageServerLoad, Actions } from "./$types"
import { redirect  } from "@sveltejs/kit"
import { updatePost, deletePost, insertUpdateReaction, selectUserPostsSample } from "src/lib/resources/posts"
import { insertPostFlag } from "src/lib/resources/users"
import { selectListSessionUserCollections, saveItemToCollection } from "src/lib/resources/collections"

let sessionUserCollections = [] as App.RowData[]

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const selectPosts = await selectUserPostsSample( sessionUserId, username, 100, 0 )

    const permission = selectPosts?.permission as boolean
    const posts = selectPosts?.feedData as App.RowData[]

    if ( posts.length == 0 || !permission ) {
        throw redirect(303, `/user/${username}`)
    }

    return { posts, username, sessionUserId, sessionUserCollections }
}

export const actions = {
    editPost: async ({ request, locals: { safeGetSession } }) => {

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        const success = submitEdit ? true : false
        const editState = submitEdit ? false : true

        return { success, editState }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const success = submitDelete ? true : false

        return { success }
    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const success = flag ? true : false

        return { success }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string
        
        const reactionData = {
            'user_id': sessionUserId,
            'post_id': postId,
            'collection_id': null,
            'reaction_type': reactionType,
            'item_type': 'post'
        } as App.RowData

        const { reaction } = await insertUpdateReaction( reactionData )

        const reactionSuccess = reaction ? true : false

        return { reactionSuccess }
    },
    getCollectionList: async ({ locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        if ( sessionUserCollections.length == 0 ) {
            sessionUserCollections = await selectListSessionUserCollections(sessionUserId)
        }
        return { showCollectionsModal: true }
    },
    saveToCollection: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const collectionId = data.get('collection-id') as string
        const fromPostId = data.get('saved-from-post') as string
        
        const update = await saveItemToCollection( sessionUserId, fromPostId, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
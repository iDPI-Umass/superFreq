// @ts-nocheck
import type { PageServerLoad, Actions } from "./$types"
import { redirect  } from "@sveltejs/kit"
import { selectUserNowPlayingPosts, updatePost, deletePost, insertUpdateReaction } from "$lib/resources/backend-calls/posts"
import { insertPostFlag } from "$lib/resources/backend-calls/users"
import { validStringCheck } from "$lib/resources/parseData"
import { selectListSessionUserCollections, saveItemToCollection } from "$lib/resources/backend-calls/collections"

let sessionUserCollections = [] as App.RowData[]

export const load = async ({ params, locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const selectPosts = await selectUserNowPlayingPosts( sessionUserId, username )

    const permission = selectPosts?.permission as boolean
    const posts = selectPosts?.posts as App.RowData[]

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

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

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
        const artistMbid = data.get('artist-mbid') as string
        const releaseGroupMbid = data.get('release-group-mbid') as string
        const recordingMbid = data.get('recording-mbid') as string
        const userAddedMetadataId = data.get('user-added-metadata-id') as string
        const itemType = data.get('item-type') as string
        const fromPostId = data.get('saved-from-post') as string
        const fromCollectionId = data.get('saved-from-collection') as string

        const item = {
            artist_mbid: validStringCheck(artistMbid),
            release_group_mbid: validStringCheck(releaseGroupMbid),
            recording_mbid: validStringCheck(recordingMbid),
            item_type: itemType,
            from_post_id: validStringCheck(fromPostId),
            from_collection_id: validStringCheck(fromCollectionId),
            user_added_metadata_id: validStringCheck(userAddedMetadataId)
        }

        const update = await saveItemToCollection( sessionUserId, item, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
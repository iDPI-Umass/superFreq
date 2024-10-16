import type { PageServerLoad, Actions } from "./$types"
import { redirect  } from "@sveltejs/kit"
import { selectUserNowPlayingPosts, updatePost, deletePost, insertUpdateReaction } from "$lib/resources/backend-calls/posts"
import { insertPostFlag } from "$lib/resources/backend-calls/users"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const selectPosts = await selectUserNowPlayingPosts( sessionUserId, username )

    const permission = selectPosts?.permission as boolean
    const posts = selectPosts?.posts as App.RowData[]

    if ( posts.length == 0 || !permission ) {
        throw redirect(303, `/user/${username}`)
    }

    return { posts, username, sessionUserId }
}

export const actions = {
    editPost: async ({ request, locals: { safeGetSession } }) => {

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        if ( submitEdit ) {
            return { success: true, editState: false }
        }
        else {
            return { success: false, editState: true }
        }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        if ( submitDelete ) {
            return { success: true }
        }
        else { 
            return { success: false }
        }

    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        if ( flag ) {
            return { success: true }
        }
        else {
            return { success: false }
        }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )
        
        if ( reaction ) {
            return {
                reactionSuccess: true
            }
        }
        else { return { 
            reactionSuccess: false 
        }}

    }
} satisfies Actions
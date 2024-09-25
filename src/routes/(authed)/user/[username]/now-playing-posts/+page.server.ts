import type { PageServerLoad, Actions } from "./$types"
import { redirect  } from "@sveltejs/kit"
import { selectUserPosts, deletePost } from "$lib/resources/backend-calls/posts"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const selectPosts = await selectUserPosts( sessionUserId, username )

    const permission = selectPosts?.permission as boolean
    const posts = selectPosts?.postsAndComments as App.RowData[]

    if ( posts.length == 0 || !permission ) {
        throw redirect(303, `/user/${username}`)
    }

    return { posts, username, sessionUserId }
}

export const actions = {
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        console.log(postId)

        const submitDelete = await deletePost( sessionUserId, postId )

        console.log(submitDelete)

        if ( submitDelete ) {
            return { deleted: true }
        }
        else { 
            return { deleted: false }
        }

    },
} satisfies Actions
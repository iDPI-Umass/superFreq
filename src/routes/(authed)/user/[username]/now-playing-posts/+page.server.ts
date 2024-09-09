import { redirect } from "@sveltejs/kit"
import { selectUserPosts } from "$lib/resources/backend-calls/posts"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const selectPosts = await selectUserPosts( sessionUserId, username )

    const permission = selectPosts?.permission as boolean
    const posts = selectPosts?.posts as App.RowData[]

    if ( posts.length == 0 || !permission ) {
        throw redirect(303, `/user/${username}`)
    }

    return { posts, username, sessionUserId }
}
import { redirect } from "@sveltejs/kit"
import { selectListProfileUserFollowingCollections } from "src/lib/resources/collections"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const collections = await selectListProfileUserFollowingCollections( username )

    if ( collections.length == 0 ) {
        throw redirect(303, `/user/${username}`)
    }

    return { collections, username }
}
import { redirect } from "@sveltejs/kit"
import { selectListUserFollowing } from "$lib/resources/backend-calls/users"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const { profiles, permission, profileDisplayName } = await selectListUserFollowing( sessionUserId, username )

    if ( profiles.length == 0 || !permission ) {
        throw redirect(303, `/user/${username}`)
    }

    return { users: profiles, profileDisplayName, username }
}
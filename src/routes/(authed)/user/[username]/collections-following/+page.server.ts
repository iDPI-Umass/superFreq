import { redirect } from "@sveltejs/kit"
import { selectListProfileUserFollowingCollections } from "$lib/resources/backend-calls/collections"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
    const username = params.username
    
    const collections = await selectListProfileUserFollowingCollections( username )

    if ( collections.length == 0 ) {
        throw redirect(303, `/user/${username}`)
    }

    return { collections, username }
}
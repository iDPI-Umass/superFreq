// @ts-nocheck
import { redirect } from "@sveltejs/kit"
import { selectListProfileUserViewableCollections } from "$lib/resources/backend-calls/collections"
import type { PageServerLoad } from "./$types"

export const load = async ({ params, locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username
    
    const collections = await selectListProfileUserViewableCollections( sessionUserId, username )

    if ( collections.length == 0 ) {
        throw redirect(303, `/user/${username}`)
    }

    return { collections, username }
}
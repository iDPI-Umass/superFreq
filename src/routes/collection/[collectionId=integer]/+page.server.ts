import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectViewableCollectionContents, selectCollectionUserFollowData } from '$lib/resources/backend-calls/collections'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {

    const collectionId = parseInt(params.collectionId).toString();

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const { collectionInfo, collectionContents, collectionSocialGraph, permission } =  await selectViewableCollectionContents(collectionId, sessionUserId)

    if ( !permission ) {
        throw redirect(307, '/collections')
    }

    const followData = await selectCollectionUserFollowData(sessionUserId, collectionId)

    return { sessionUserId, collectionId, collectionInfo, collectionContents, collectionSocialGraph, permission, followData }
}

export const actions = {
    followCollection: async ({ request }) => {
        const data = await request.formData()
        const collectionId = data.get('collection-id') as string
        const sessionUserId = data.get('session-user-id') as string

        const follow = await insertUpdateCollectionFollow(sessionUserId, collectionId)

        return { follow, success: true }
    }
} satisfies Actions
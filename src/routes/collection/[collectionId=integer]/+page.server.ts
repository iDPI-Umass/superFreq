import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectViewableCollectionContents } from '$lib/resources/backend-calls/collections'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {

    const collectionId = parseInt(params.collectionId).toString();

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const { collectionInfo, collectionContents, viewPermission, editPermission, followData } =  await selectViewableCollectionContents(collectionId, sessionUserId)

    if ( !viewPermission ) {
        throw redirect(307, '/collections')
    }

    return { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData }
}

export const actions = {
    followCollection: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        
        const data = await request.formData()
        const collectionId = data.get('collection-id') as string

        const follow = await insertUpdateCollectionFollow(sessionUserId, collectionId)

        return { follow, success: true }
    }
} satisfies Actions
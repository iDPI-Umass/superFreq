import type { PageServerLoad } from './$types';
import { selectEditableCollectionContents } from '$lib/resources/backend-calls/collectionSelectFunctions'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const collectionId = '73'

    const collection = await selectEditableCollectionContents(collectionId, 'release_groups', sessionUserId)

    console.log(collectionId, sessionUserId)
    console.log(collection)

    return { collection }
}
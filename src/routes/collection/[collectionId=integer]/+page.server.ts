import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types';
import { db } from 'src/database.ts'
import { selectViewableCollectionContents } from '$lib/resources/backend-calls/collectionSelectFunctions'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/userActions'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {

    //convert param into useable collectionId 
    const collectionId = parseInt(params.collectionId).toString();

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const { collectionInfo, collectionContents, collectionSocialGraph, permission } =  await selectViewableCollectionContents(collectionId, sessionUserId)

    if ( !permission ) {
        throw redirect(307, '/collections')
    }

    const selectFollowData = await db.transaction().execute(async (trx) => {
        let followInfo
        try {
            followInfo = await trx
            .selectFrom('collections_social')
            .selectAll()
            .where(({and, eb}) => and([
                eb('user_id', '=', sessionUserId),
                eb('collection_id', '=', collectionId),
                eb('follows_now', '=', true)
            ]))
            .executeTakeFirst()

            return followInfo
        }
        catch( error ) {
            return null
        }
    })

    const followData = await selectFollowData

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
import { redirect } from "@sveltejs/kit"
import { db } from 'src/database.ts'
import type { PageServerLoad } from "../$types"

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const username = params.username

    //checks if user doesn't exist or has blocked the session user
    try {
        const checkBlock = await db.transaction().execute( async (trx) => {
            const userProfile = await trx
            .selectFrom('profiles')
            .select('id')
            .where('username', '=', username)
            .executeTakeFirstOrThrow()

            const userProfileId = userProfile?.id as string

            await trx
            .selectFrom('user_moderation_actions')
            .select('id')
            .where(({eb, and}) => and([
                eb('user_id', '=', userProfileId),
                eb('target_user_id', '=', sessionUserId),
                eb('type', '=', 'block'),
                eb('active', '=', true)
            ]))
            .executeTakeFirstOrThrow()

            return { blocked: true }
        })

        if (checkBlock.blocked) {
            throw redirect(404, '/user-unavailable')
        }
    }
    catch ( error ) {
        return
    }
}
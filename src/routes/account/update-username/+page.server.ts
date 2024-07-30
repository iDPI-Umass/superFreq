import type { PageServerLoad, Actions } from './$types'
import { fail, error, redirect } from '@sveltejs/kit'

import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    if (!session) {
        throw redirect(303, '/')
    }

    const selectProfile = await db
    .selectFrom('profiles')
    .where('id', '=', sessionUserId)
    .selectAll()
    .executeTakeFirstOrThrow()

    const profile = await selectProfile
    return profile
}

export const actions = {
    default: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const formData = await request.formData()
        const currentUsername = formData.get('current-username') as string
        const newUsername = formData.get('new-username') as string

        const updateProfile = await db.transaction().execute(async (trx) => {
            try {
                const checkDuplicate = await trx
                .selectFrom('profiles')
                .select(['display_name', 'username', 'id'])
                .where('username', '=', newUsername)
                .where('id', '!=', sessionUserId)
                .executeTakeFirstOrThrow()

                return checkDuplicate
            }
            catch (error) {
                return await trx.updateTable('profiles')
                .set({
                    username: newUsername
                })
                .where('id', '=', sessionUserId)
                .returning(['display_name', 'username', 'id'])
                .executeTakeFirst() 
            }
        })
        
        const usernameUpdate = await updateProfile
        console.log(usernameUpdate)

        if ( usernameUpdate?.id != sessionUserId ) {
            const failed = true
            console.log(usernameUpdate, sessionUserId, failed)
            return {newUsername, currentUsername, failed}
        }
        else {
            console.log(usernameUpdate, sessionUserId)
            redirect(303, `/account`)
        }
    }
} satisfies Actions
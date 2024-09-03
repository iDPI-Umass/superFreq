import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { updateUsername } from '$lib/resources/backend-calls/users'

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
        const newUsername = formData.get('new-username') as string

        const update = await updateUsername(sessionUserId, newUsername)

        if ( !update?.success ) {
            return { failed: true }
        }
        else {
            redirect(303, `/account`)
        }
    }
} satisfies Actions
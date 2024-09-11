import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { updateUsername } from '$lib/resources/backend-calls/users'
import { profileStoresObject } from '$lib/stores'

import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

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

        const { update, success } = await updateUsername(sessionUserId, newUsername)
        const { username, display_name, avatar_url } =  update as App.ProfileObject

        if ( success ) {
            profileStoresObject.set({
                'username': username,
                'display_name': display_name,
                'avatar_url': avatar_url,
              })
            return { success: false }
        }
        else {
            return { success: true }
        }
    }
} satisfies Actions
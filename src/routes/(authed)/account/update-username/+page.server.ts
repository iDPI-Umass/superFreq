import type { PageServerLoad, Actions } from './$types'
import { updateUsername } from 'src/lib/resources/users'
import { validateUsernameCharacters } from "$lib/resources/parseData"
import { sessionUserProfile } from "$lib/resources/states.svelte"

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

        const validUsername = validateUsernameCharacters(newUsername)

        if ( !validUsername ) {
            return { success: false, validUsername, usernameTaken: false  }
        }

        const { update, success, usernameTaken } = await updateUsername(sessionUserId, newUsername)
        const { username  } =  update as App.ProfileObject

        if ( success ) {
            sessionUserProfile.username = username
            return { success, validUsername, usernameTaken }
        }
        else {
            return { success, validUsername, usernameTaken }
        }
    }
} satisfies Actions
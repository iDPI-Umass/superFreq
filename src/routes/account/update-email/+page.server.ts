import type { PageServerLoad, Actions } from './$types'
import { fail, error, redirect } from '@sveltejs/kit'

import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const sessionUserEmail = session.user?.email as string

    if (!session) {
        throw redirect(303, '/')
    }

    return { sessionUserId, sessionUserEmail}
}

export const actions = {
    default: async ({ request, locals: { safeGetSession, supabase }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const formData = await request.formData()
        const newEmail = formData.get('new-email') as string
        const confirmEmail = formData.get('confirm-email') as string

        const updateEmail = await supabase.auth.updateUser({email: newEmail})

        if ( updateEmail ) {
            return { success: true }
        }
        else {
            return { success: false }
        }
        
    }
} satisfies Actions
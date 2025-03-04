// @ts-nocheck
import type { PageServerLoad, Actions } from './$types'

export const load = async ({ locals: { safeGetSession }}: Parameters<PageServerLoad>[0]) => {

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const sessionUserEmail = session.user?.email as string

    return { sessionUserId, sessionUserEmail}
}

export const actions = {
    default: async ({ request, locals: { supabase }}) => {

        const formData = await request.formData()
        const confirmEmail = formData.get('confirm-email') as string

        const updateEmail = await supabase.auth.updateUser({email: confirmEmail})

        if ( updateEmail ) {
            return { success: true }
        }
        else {
            return { success: false }
        }
        
    }
} satisfies Actions
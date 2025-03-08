import type { Actions } from './$types'
import { inviteRequest } from '$lib/resources/backend-calls/users.ts'

export const actions = {
    invite: async ({ request, locals: { supabase } }) => {

        const formData = await request.formData()
        const email = formData.get('email') as string
        const referredBy = formData.get('referred-by') as string

        const invite = await inviteRequest( email, referredBy )


        if ( invite ) {
            const { approved, user_id } = invite

            const authResponse = await supabase.auth.signInWithOtp({ email: email })
            
            if ( authResponse.error ) {
                return { success: true, approved, user_id, authError: true }
            }
            else { 
                return { success: true, approved, user_id, authError: false }
            }
        }
        else {
            return { success: false, approved: false, user_id: null, authError: false }
        }
        
    }
} satisfies Actions
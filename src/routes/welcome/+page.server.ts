import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()

    if ( session ) {
        throw redirect(303, '/feed')
    }
}

export const actions = { 
    sendMagicLink: async({ request, locals: { supabase }}) => {

        const data = await request.formData()
        const email = data.get('email') as string

        const { error } = await supabase.auth.signInWithOtp({ email: email })
        if ( error ) {
            console.error(error)
            return { 
                success: false,
                showModal: true
            }
        }
        else {
            return { 
                succes: true,
                showModal: true
            }
        }
    }
} satisfies Actions
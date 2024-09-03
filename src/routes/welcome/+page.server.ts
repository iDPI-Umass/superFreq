import type { Actions } from './$types'

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
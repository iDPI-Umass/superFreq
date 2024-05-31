import type { PageServerLoad, Actions } from './$types'
import { error, redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ url, locals: session}) => {  
    // if the user is already logged in return them to the account page
    if (session) {
      throw redirect(303, '/account')
    }
  
    return { url: url.origin }
  }
  

export const actions = {
	login: async ({ request, locals: { supabase } }) => {
		const data = await request.formData()
		const email = data.get('email')
        const { error: resetPasswordError } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: '/auth/callback'
            }
        });
        if (resetPasswordError) {
            error(400, resetPasswordError.message);
        }
        else{ 
		    return { success: true };
        }
	}
} satisfies Actions;
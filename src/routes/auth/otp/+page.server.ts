import type { PageServerLoad, Actions } from "./$types"
import { redirect } from "@sveltejs/kit"
import type { EmailOtpType } from '@supabase/supabase-js'

export const load: PageServerLoad = async ({ url }) => { 
    console.log(url)
    const urlString = JSON.stringify(url)
    return {urlString}
}

export const actions = {
    confirm: async ({ request, locals: { supabase }}) => {
      const data = await request.formData()
      const url = JSON.parse(data.get('url-string') as string) as URL
      const token_hash = url.searchParams.get('token_hash')
      const type = url.searchParams.get('type') as EmailOtpType | null
      const next = url.searchParams.get('next') ?? '/auth/check'
      
      /**
       * Clean up the redirect URL by deleting the Auth flow parameters.
       *
       * `next` is preserved for now, because it's needed in the error case.
       */
      const redirectTo = new URL(url)
      redirectTo.pathname = next
      redirectTo.searchParams.delete('token_hash')
      redirectTo.searchParams.delete('type')
    
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (!error) {
          redirectTo.searchParams.delete('next')
          redirect(303, redirectTo)
        }
      }
    
      redirectTo.pathname = '/auth/error'
      redirect(303, redirectTo)
    }
} satisfies Actions
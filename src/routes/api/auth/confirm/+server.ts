import type { EmailOtpType } from '@supabase/supabase-js'
import { redirect } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ url, locals: { supabase, session } }) => {
  const token_hash = url.searchParams.get('token_hash')
  const type = url.searchParams.get('type') as EmailOtpType | null
  const redirectTo = new URL(url)

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash })
    if ( !error && session ) {
      const { user: { id }} = session
      const { status, error } = await supabase
      .from("approved_users")
      .select()
      .eq("id", id)

      if ( !error && status === 200 ) {
        redirectTo.pathname = '/api/auth/check'
      }
      else if ( !error && status === 400 ) {
        redirectTo.pathname = '/auth/access-denied'
      }
      else {
        redirectTo.pathname = '/auth/error'
      }
      return redirect(303, redirectTo)
    }
  }

  redirectTo.pathname = '/auth/error'
  return redirect(303, redirectTo)
}
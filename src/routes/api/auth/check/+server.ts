import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals: { safeGetSession, supabase }}) => {

    const session = await safeGetSession()
    console.log(session)

    const sessionUserId = session.user?.id

    const { data, status, error } = await supabase
    .from("profiles")
    .select(`*`)
    .eq("id", sessionUserId)

    const username = data[0]['username']

    if ( status === 200 && username ) {
      return redirect(303, '/feed')
    }
    else if ( status === 200 && !username ) {
      return redirect(303, '/account')
    }
    else if ( error || status != 200 ) {
      return redirect(303, '/auth/error')
    }
    return redirect(303, '/')
}
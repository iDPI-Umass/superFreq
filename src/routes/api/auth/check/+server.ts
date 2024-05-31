import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals: { session, supabase }}) => {
    const redirectTo = new URL('/')

    const { user: { id }} = session
    const { count, data, status, error } = await supabase
    .from("profiles")
    .select(`*`, { count: 'exact', head: false })
    .eq("id", id)
    .neq("username", null)

    if ( status === 200 && count != 0 ) {
        const profileStorageItem = {
            "display_name": data[0]["display_name"],
            "username": data[0]["username"],
            "avatar_url": data[0]["avatar_url"]
            }

        localStorage.setItem("profile", JSON.stringify(profileStorageItem))

        redirectTo.pathname = '/feed'
    }
    else if ( status === 200 && count == 0 ) {
      redirectTo.pathname = '/account'
    }
    else if ( error || status != 200 ) {
      redirectTo.pathname = '/auth/error'
    }
    return redirect(303, redirectTo)
}
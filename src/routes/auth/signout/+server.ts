import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { profileStoresObject } from '$lib/stores'

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession }}) => {
    const { session } = await safeGetSession()
    if ( session ) {
        await supabase.auth.signOut()
        profileStoresObject.set({
            'username': null,
            'display_name': null,
          })
        throw redirect(303, '/welcome')
    }
}
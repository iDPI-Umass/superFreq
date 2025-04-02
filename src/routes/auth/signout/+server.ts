import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { userProfile, userProfileReset } from '$lib/resources/states.svelte'

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession }}) => {
    const { session } = await safeGetSession()
    if ( session ) {
        await supabase.auth.signOut()
        userProfile = userProfileReset
        redirect(303, '/welcome')
    }
    else {
        redirect (303, '/welcome')
    }
}
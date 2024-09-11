import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { profileStoresObject } from '$lib/stores'

export const load: PageServerLoad = async ({ locals: { supabase, session }}) => {
    if ( session ) {
        await supabase.auth.signOut()
        profileStoresObject.set({
            'username': null,
            'display_name': null,
            'avatar_url': null,
          })
        throw redirect(303, '/')
    }
}
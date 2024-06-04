import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from './$types';

export const load: ServerLoad = async ({ locals: { supabase, session }}) => {
    if ( session ) {
        await supabase.auth.signOut()
        throw redirect(303, '/')
    }
}
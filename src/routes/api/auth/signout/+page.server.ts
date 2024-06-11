import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase, session }}) => {
    if ( session ) {
        await supabase.auth.signOut()
        throw redirect(303, '/')
    }
}
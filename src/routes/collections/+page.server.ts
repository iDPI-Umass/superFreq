import type { PageServerLoad } from './$types';
import { selectAllOpenPublicCollections } from '$lib/resources/backend-calls/collections/select/selectAllOpenPublicCollections';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {

    const allCollections = await selectAllOpenPublicCollections({ locals: { supabase }});
    
    return { allCollections };
}
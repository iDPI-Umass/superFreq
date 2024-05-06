import type { PageServerLoad } from './$types';
import { selectAllOpenPublicCollections } from '$lib/resources/database/collections/select/selectAllOpenPublicCollections';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {

    const allCollections = await selectAllOpenPublicCollections({ locals: { supabase }});
    
    return { allCollections };
}
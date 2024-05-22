import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { selectEditableCollection } from '$lib/resources/backend-calls/collections/select/selectEditableCollection';

export const load: PageServerLoad = async ({ params, locals: { supabase, getSession } }) => {
    //convert param into useable collectionId for supabase
    const collectionId = parseInt(params.collectionId);

    const session = await getSession();
    const { user: { id } } = session;
    const sessionUserId = id;

    const data = await selectEditableCollection({collectionId, sessionUserId, locals: { supabase }});

    const collectionContents = data;

    return { collectionContents }; 
  }

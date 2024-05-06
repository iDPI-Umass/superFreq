// import type { PageLoad } from './$types';
// import { mbSearch } from '$lib/resources/musicbrainz-calls/mbSearch.js';

// export let query;
// export let collectionType;

// export async function load ({ parent }) {

//     const { supabase, session } = await parent();
//     const { user } = session;
//     const sessionUserId = user["id"];

//     console.log(session);

//     const select = supabase
//         .from("profiles")
//         .select()
//         .eq("id", sessionUserId)
    
//     const profileResponse = await select;
//     console.log(profileResponse);

//     return { supabase, session };
//   }
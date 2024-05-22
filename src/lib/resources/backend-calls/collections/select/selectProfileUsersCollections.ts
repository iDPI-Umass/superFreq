/*
Fetches all collections that belong to a user when visiting their profile.
*/

export const selectProfileUsersCollections = async function ({ profileUserId, locals: { supabase } } ) {

    /* 
    query to get all over a user's collections in reverse chornlogical order by updated_at
    */
     const select = supabase
       .from( "view_permissions_collections" )
       .select()
       .eq("owner_id", profileUserId)
       .order("updated_at", { ascending: false });
 
   const response =  await select;
   const collectionsInfo = await response.data;
 
   if (response.status === 200) {
       return collectionsInfo;
   }
   if ( response.status === 404 ) {
     console.warn( ` Collections by user ${ profileUserId } not found` );
     return null;
   }
   throw new Error( `Unexpected response ${ response.error }`);
 }
/*
Gets data for user's profile
*/

export const selectUser = async function ({ profileUsername, locals: { supabase } } ) {

    /* 
    query to get collection info and collection social graph for collection_id as long as collection doesn't have status "deleted" 
    */
     const select = supabase
       .from( "profiles" )
       .select()
       .eq("username", profileUsername);
 
   const response =  await select;
   let profileData = await response.data;
   profileData = profileData[0];
 
   if (response.status === 200) {
       return profileData;
   }
   if ( response.status === 404 ) {
     console.warn( ` Collections by user ${ profileUsername } not found` );
     return null;
   }
   throw new Error( `Unexpected response ${ response.error }`);
 }
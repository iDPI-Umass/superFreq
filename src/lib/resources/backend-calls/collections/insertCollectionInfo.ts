/*
Insert collection info when user first creates collection. Run this function before "insertCollectionContents" since it returns a collection_id.
*/

import { supabase } from '$lib/utils/supabaseClient';

export const insertCollectionInfo = async function ( collectionInfo ) {


    
    const insert = supabase
   .from( "collections_info" )
   .insert( collectionInfo )
   .select();
 
   const post =  await insert;
 
   if ( post.status === 201 ) {

     return await post.data;
   }
   if ( post.status === 409 ) {

     return await post.statusText;
   }
   throw new Error( `Unexpected response ${ post.error }`);
 }
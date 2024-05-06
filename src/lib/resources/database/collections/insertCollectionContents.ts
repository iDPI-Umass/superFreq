/*
Generic insert that takes string "tableName" to determine table and array "itemsData" to populate row or rows in table.

Intended for creation of collections, and can be used to insert rows into collections_info and collections_contents. 
For collections_social_graph, you likely want to use an uspert function to avoid accidentally adding duplicate rows.
*/

export const insertCollectionContents = async function ({ collectionContents, locals: { supabase }}) {

    const insert = supabase
   .from( "collections_contents" )
   .insert( collectionContents );
 
   const post =  await insert;
 
   if ( post.status === 201 ) {
     return await post.statusText;
   }
   if ( post.status === 409 ) {
     return await post.statusText;
   }
   throw new Error( `Unexpected response ${ post.error }`);
 }
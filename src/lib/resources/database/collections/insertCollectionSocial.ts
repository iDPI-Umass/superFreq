/*
Insert collection social. Expects object:
{
    "collection_id": collectionId,
    "user_id": userId,
    "user_role": role
}
*/

export const insertCollectionSocial = async function ({ socialInfo, locals: {supabase} }) {
    
    const insert = supabase
   .from( "collections_social" )
   .insert( socialInfo );

   const post = await insert;
 
   if ( post.status === 201 ) {
    return await post.status;
   }
   if ( insert.status === 409 ) {
    return await post.status;
   }
   throw new Error( `Unexpected response ${ insert.error }`);
 }
/* 
Checks if a given user is a collaborator or owner, useful for checking if user has ability to view collection.
*/

export const checkCollectionRole = async function ( { collectionId, userId, locals: {supabase}} ) {

    /* Get contents from collections_contents using collection_id */
    const select = supabase
    .from( "collections_social" )
    .select()
    .match( { "collection_id": collectionId, "user_id": userId } )
    .neq( "user_role", "follower" );

    const response = await select;
    let userAccess = false;

    if (response.status === 200) {
        userAccess = true;
        return await userAccess;
    }
    if ( response.status === 404 ) {
        console.warn( `Collection contents for ${ collectionId } not found` );
        return userAccess;
    }
    throw new Error( `Unexpected response ${ response.error }`);

}
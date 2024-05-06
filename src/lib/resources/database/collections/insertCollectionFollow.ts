/*
Insert collection follow into social graph
*/

export const insertCollectionFollow = async function({ collectionId, sessionUserId, locals: { supabase }}) {
    const insert = await supabase
    .from("collections_social")
    .insert({
        "user_id": sessionUserId,
        "collection_id": collectionId,
        "follows_now": true,
        "user_role": "follower"
    })
    .select();

    const response = await insert;
    const { data, status } = await response; 
    const responseStatus = status;

    if (status === 201) {
        const insertedFollow = data;
        return { insertedFollow, responseStatus };
        }
    if ( response.status === 404 ) {
        console.warn( ` Collection social graph for ${ id } not found` );
        return responseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
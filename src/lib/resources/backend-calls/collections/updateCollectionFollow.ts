/*
Update collection follow in social graph. Expects object:

const followData = {
    "user_id": followerId,
    "collection_id": collectionId,
    "user_role": role,
    "follows_now": boolean,
    "updated_at": null,
    "changelog": json
}
*/

export const updateCollectionFollow = async function({ id, followData, locals: { supabase }}) {

    const update = await supabase
    .from("collections_social")
    .update(followData)
    .eq("id", id)
    .select();

    const response = await update;
    const { data, status } = await response;

    if (status === 200) {
        const updatedFollow = data;
        return updatedFollow;
        }
    if ( response.status === 404 ) {
        console.warn( ` Collection social graph for ${ id } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
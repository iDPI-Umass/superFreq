/*
Gets contents for a collection. Takes args collectionID and sessionUserId so that supabase will reject query if the session user is not the owner of or collaborator on the collection. 
*/

export const selectEditableCollection = async function({ collectionId, sessionUserId, locals: { supabase }}) {

    const select = supabase
    .from("aggregate_collection_contents")
    .select()
    .eq("collection_id", collectionId)
    .or(`owner_id.eq.${sessionUserId},and(social_user_id.eq.${sessionUserId},user_role.eq.collaborator)`);

    const response = await select;
    const { data, status, error } = response;
    const collectionContents = data;

    if ( status == 200 ) {
        return collectionContents;
    }
    else if ( status == 404 ) {
        return null;
    }
    throw new Error(`HTTP error ! Status: ${status}, Error:${error}`);
}
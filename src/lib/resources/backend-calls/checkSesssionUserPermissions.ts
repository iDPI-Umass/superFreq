/*
Verify that user has permission to view a given collection's contents, return collection info if true
*/

export const checkCollectionViewPermissions = async function ({ collectionId, sessionUserId, locals: { supabase }}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }} ) {

    /* 
    query to get collection info and collection social graph for collection_id as long as collection doesn't have status "deleted" 
    */
    const select = supabase
    .from( "view_permissions_collections" )
    .select()
    .eq("collection_id", collectionId);

    const response =  await select;
    const collectionInfo = await response.data;
    const responseStatus = await response.status;
    const responseError = await response.error;
    let verified = false;

    const { owner_id, status, user_id, user_role} = collectionInfo[0];

    if ( status == "public" || status == "open" ) {
        verified = true;
    }
    else if ( owner_id == sessionUserId ) {
        verified = true;
    }
    else if ( status == "private" && user_id == sessionUserId && user_role == "collaborator" ) {
        verified = true;
    }

    if (response.status === 200) {
        if ( verified == true ){
        verified = true;
        return {verified, collectionInfo, responseStatus};
        }
        else {
        return {verified, responseStatus, responseError};
        }
    } 
    else if ( response.status == 400 ) {
        return { verified, responseStatus, responseError };
    }
    throw new Error( `Unexpected response ${ response.error }`);
}

/*
Verify that user has permission to edit a given collection's contents, return collection info if true
*/

export const checkCollectionEditPermissions = async function ({ collectionId, sessionUserId, locals: { supabase }}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }} ) {

    /* 
    query to get collection info and collection social graph for collection_id as long as collection doesn't have status "deleted" 
    */
    const select = supabase
    .from( "view_permissions_collections" )
    .select()
    .eq("collection_id", collectionId)
    .or(`status.eq.open,and(user_id.eq.${sessionUserId},user_role.neq.follower)`)

    const response =  await select;
    const collectionInfo = await response.data;
    const responseStatus = await response.status;
    const responseError = await response.error;
    let verified = false;

    if (response.status === 200) {
        verified = true 
        return {verified, collectionInfo, responseStatus};
    } 
    else if ( response.status == 400 ) {
        return { verified, responseStatus, responseError };
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
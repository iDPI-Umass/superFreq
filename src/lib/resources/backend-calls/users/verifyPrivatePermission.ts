/*
Input list of collection_ids for private collections to see if user is collabortor or owner of them.
*/

export const verifyPrivatePermission = async function({ userId, privateCollectionIdArray, locals: { supabase }}) {
    const select = await supabase
        .from( "collections_social" )
        .select(`
            collection_id,
            user_id,
            user_role,
            collections_info!collections_social_collection_id_fkey(
                collection_id,
                title,
                status,
                type,
                updated_at,
                owner_id
            )
        `)
        .eq("user_id", userId)
        .in("collection_id", privateCollectionIdArray)
        .neq("user_role", "follower");
    
    const response = await select;
  
    if (response.status === 200) {
            const { data, status } = response;
            const verifiedCollections = data;
            return { verifiedCollections, status };
        }
    if ( response.status === 404 ) {
        console.warn( ` Collections not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
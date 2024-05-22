/*
Get list of collections associated with user in collections_social_graph
*/

export const selectUserCollections = async function({ userId, locals: { supabase }}) {
    const select = await supabase
        .from( "collections_social" )
        .select(`
            collection_id,
            user_id,
            user_role,
            collections_info!collections_social_collection_id_fkey(
                collection_id,
                title,
                type,
                status
            )
        `)
        .eq("user_id", userId)
        .neq("user_role", "follower");
    
    const response = await select;
  
    if (response.status === 200) {
            return response.data;
        }
    if ( response.status === 404 ) {
        console.warn( ` Collections not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
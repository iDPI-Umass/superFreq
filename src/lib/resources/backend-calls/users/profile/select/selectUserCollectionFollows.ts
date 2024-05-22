/*
Get list of public and open collections a user follows.
*/

export const selectUserCollectionFollows = async function({ profileUserId, locals: { supabase }}) {

    const select = await supabase
    .from("collections_info")
    .select(`
        collection_id,
        title, 
        status,
        updated_at,
        collections_social!collection_id(
            user_id,
            collection_id,
            follows_now,
            user_role
        ),
        collections_updates!collection_id(
            collection_id,
            updated_by,
            updated_at
        )
    `)
    .eq("collections_social.user_id", profileUserId)
    .neq("collections_social.user_role", "owner")
    .neq("collections_social.follows_now", false)
    .neq("status", "deleted")
    .neq("status", "private");
    //.order("collections_updates.updated_at", { ascending: false });


    const response = await select;
    const { data, status } = await response;
    const collectionsFollowing = data;

    if (status === 200) {
        return collectionsFollowing;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ sessionId } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
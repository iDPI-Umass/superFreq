/*
Get collections activity of users that a user follows for feed
*/

export const selectFollowedUsersCollectionsActivity = async function({ targetUserIdArray, sessionId, locals: { supabase }}) {
    
    const select = await supabase
    .from("collections_updates")
    .select(`
        collection_id,
        updated_at,
        updated_by,
        view_permissions_collections!collection_id_fkey(
            collection_id,
            title,
            user_id,
            user_role,
            status
        )
    `)
    .in("updated_by", targetUserIdArray)
    .or(`status.neq.private,and(user_id.eq.${sessionId},user_role.neq.follower)`, { referencedTable: "view_permissions_collections" })
    .order("updated_at", { ascending: false });

    const response = await select;
    const { data, status } = response;
    const followedCollectionsActivity = data;

    if (status === 200) {
        return followedCollectionsActivity;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
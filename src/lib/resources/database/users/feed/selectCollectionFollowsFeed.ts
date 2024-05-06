/*
Get list of collections followed for feed.

*/

export const selectCollectionFollowsFeed = async function({ sessionId, locals: { supabase }}) {

    const select = await supabase
    .from("view_permsissions_collections")
    .select()
    .eq("user_id", sessionId)
    .or("status.neq.private,user_role.neq.follower")
    .neq("follows_now", false)
    .neq("status", "deleted")
    .order("modified_at", { ascending: false });

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
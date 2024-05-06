/*
Get social activity of users that a user follow.
*/

export const selectSocialFollowsActivity = async function({ targetUserIdArray, locals: { supabase }}) {
    
    const select = await supabase
    .from("social_graph")
    .select(`
        user_id,
        target_user_id,
        follows_now,
        updated_at,
        profiles!social_graph_user_id_fkey(
            id,
            username,
            display_name,
            avatar_url
        )
    `)
    .in("user_id", targetUserIdArray)
    .neq("follows_now", false)
    .order("updated_at", { ascending: false });

    const response = await select;
    const { data, status } = response;
    const socialFollowsActivity = data;

    if (status === 200) {
        return socialFollowsActivity;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
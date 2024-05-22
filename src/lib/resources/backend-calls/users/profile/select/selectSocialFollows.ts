/*
Get list of users someone follows
*/

export const selectSocialFollows = async function({ profileUserId, locals: { supabase }}) {
    const select = await supabase
    .from("social_graph")
    .select(`
        user_id,
        target_user_id,
        follows_now,
        profiles!social_graph_target_user_id_fkey(
            id,
            username,
            display_name,
            avatar_url
        )
    `)
    .eq("user_id", profileUserId)
    .neq("follows_now", false);

    const response = await select;
    const { data, status } = await response;

    if (status === 200) {
        const socialGraph = data;
        return socialGraph;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ profileUserId } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
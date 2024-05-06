/*
Check if user follows a user
*/

export const selectUserFollow = async function({ profileUserId, sessionUserId, locals: { supabase }}) {
    const insert = await supabase
    .from("social_graph")
    .select()
    .match({
        "user_id": sessionUserId,
        "target_user_id": profileUserId
    })

    const response = await insert;
    const { data, status } = await response;

    if (status === 200) {
        const isFollowing = data;
        const responseStatus = status;
        return { isFollowing,  responseStatus } ;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ id } not found` );
        return {responseStatus: status};
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
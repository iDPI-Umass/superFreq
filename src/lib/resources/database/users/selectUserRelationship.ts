/*
Get social relationship between two users.
*/

export const selectUserRelationship = async function({ id, followerId, locals: { supabase }}) {
    const insert = await supabase
    .from("social_graph")
    .select()
    .match({
        "user_id": followerId,
        "target_user_id": id
    })

    const response = await insert;
    const { data, status } = await response;
    const responseStatus = status;

    if (status === 200) {
        const relationship = data;
        return { relationship, responseStatus} ;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ id } not found` );
        return responseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
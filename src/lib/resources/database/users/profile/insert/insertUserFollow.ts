/*
Insert user follow into social graph
*/

export const insertUserFollow = async function({ profileUserId, sessionUserId, locals: { supabase }}) {

    const insert = await supabase
    .from("social_graph")
    .insert({
        "user_id": sessionUserId,
        "target_user_id": profileUserId,
        "follows_now": true
    })
    .select();

    const response = await insert;
    const { data, status } = await response; 
    const responseStatus = status;

    if (status === 201) {
        const insertedFollow = data;
        return { insertedFollow, responseStatus };
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ id } not found` );
        return responseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
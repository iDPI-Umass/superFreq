/*
Update user follow in social graph. Expects object:

const followData = {
    "user_id": followerId,
    "target_user_id": id,
    "follows_now": boolean,
    "updated_at": null,
    "changelog": jsonb
}
*/

export const updateUserFollow = async function({ id, followData, locals: { supabase }}) {

    const update = await supabase
    .from("social_graph")
    .update(followData)
    .eq("id", id)
    .select();

    const response = await update;
    const { data, status } = await response;

    if (status === 200) {
        const updatedFollow = data;
        return updatedFollow;
        }
    if ( response.status === 404 ) {
        console.warn( ` Social graph for ${ id } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
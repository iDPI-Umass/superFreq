/*
Get user data and their collections to display on their profile page.
*/

export const selectUser = async function({ username, locals: { supabase }}) {
    const select = await supabase
    .from("profiles")
    .select(`
        id,
        username,
        avatar_url,
        website,
        display_name,
        collections_info!collections_info_owner_id_fkey(
            collection_id,
            title,
            status,
            type,
            updated_at,
            owner_id
        ),
        collections_social(
            user_id,
            user_role,
            collection_id
        )
    `)
    .eq("username", username);

    const response = await select;

    if (response.status === 200) {
        return response;
        }
    if ( response.status === 404 ) {
        console.warn( ` User ${ username } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
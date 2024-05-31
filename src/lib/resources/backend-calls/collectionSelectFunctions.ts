/*
Select all collections that are open or public
*/

export const selectAllOpenPublicCollections = async function ({ locals: { supabase }}: { locals: { supabase: App.Locals["supabase"] }}) {

    const select = supabase
    .from( "collections_info" )
    .select(`
        title,
        status,
        collection_id,
        owner_id,
        updated_at,
        profiles!owner_id(
            id,
            username,
            display_name
        )
    `)
    .neq( "status", "deleted")
    .neq( "status", "private")
    .order( "updated_at", {ascending: false});

    const response = await select;
    const { data } =  await response;
    const allCollections =  data;

    if (response.status === 200) {
        return allCollections;
    }
    if ( response.status === 404 ) {
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}

/*
Gets contents for a collection. Make sure to user checkCollectionViewPermission first to verify user has access to view this collection.
*/

export const selectCollectionContents = async function({ collectionId, locals: { supabase }}: { collectionId: number, locals: { supabase: App.Locals["supabase"] }}) {

    const select = supabase
    .from("collections_contents")
    .select(`*,
        artists!artist_mbid(*),
        release_groups!release_group_mbid(*),
        recordings!recording_mbid(*)
    `)
    .eq("collection_id", collectionId)
    .not("item_position", "is", null)
    .order("item_position", { ascending: true });

    const response = await select;
    const { data, status, error } = await response;
    const collectionContents = data;
    let collectionReturned = false;

    if ( status == 200 ) {
        collectionReturned = true;
        return { collectionContents, collectionReturned };
    }
    else if ( status == 404 ) {
        return collectionReturned;
    }
    throw new Error(`HTTP error ! Status: ${status}, Error:${error}`);
}

/* 
Get social graph for a collection to decide state of follow button when user is viewing it
*/

export const selectCollectionSocialsFollowsInfo = async function ( { collectionId, sessionUserId, locals: {supabase}}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }} ) {

    const select = supabase
    .from( "collections_social" )
    .select(`
        *,
        profiles!collections_social_user_id_fkey ( 
            id,
            username,
            display_name,
            avatar_url
        )
    `)
    .match({ collection_id: collectionId, user_id: sessionUserId });

    const response = await select;
    const socialData = response.data;
    const socialResponseStatus = response.status;

    if (response.status === 200) {
        return { socialData, socialResponseStatus };
    }
    if ( response.status === 404 ) {
        console.warn( `Collection contents for ${ collectionId } not found` );
        return socialResponseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}

/*
Gets contents for a collection. Takes args collectionID and sessionUserId so that supabase will reject query if the session user is not the owner of or collaborator on the collection. 
*/

export const selectEditableCollection = async function({ collectionId, sessionUserId, locals: { supabase }}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }}) {

    const select = supabase
    .from("aggregate_collection_contents")
    .select()
    .eq("collection_id", collectionId)
    .or(`owner_id.eq.${sessionUserId},and(social_user_id.eq.${sessionUserId},user_role.eq.collaborator)`);

    const response = await select;
    const { data, status, error } = response;
    const collectionContents = data;

    if ( status == 200 ) {
        return collectionContents;
    }
    else if ( status == 400 ) {
        return null;
    }
    throw new Error(`HTTP error ! Status: ${status}, Error:${error}`);
}

/*
Fetches all collections that belong to a user when visiting their profile.
*/

export const selectProfileUsersCollections = async function ({ profileUserId, locals: { supabase }}: { profileUserId: string, locals: { supabase: App.Locals["supabase"] }} ) {

    /* 
    query to get all over a user's collections in reverse chornlogical order by updated_at
    */
        const select = supabase
        .from( "view_permissions_collections" )
        .select()
        .eq("owner_id", profileUserId)
        .order("updated_at", { ascending: false });

    const response =  await select;
    const collectionsInfo = await response.data;

    if (response.status === 200) {
        return collectionsInfo;
    }
    if ( response.status === 400 ) {
        console.warn( ` Collections by user ${ profileUserId } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
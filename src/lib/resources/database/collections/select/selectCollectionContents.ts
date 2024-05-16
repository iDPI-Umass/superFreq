/*
Gets contents for a collection. Make sure to user checkCollectionViewPermission first to verify user has access to view this collection.
*/

export const selectCollectionContents = async function({ collectionId, locals: { supabase }}) {

    const select = supabase
    .from("collections_contents")
    .select(`*,
        artists!artist_mbid(*),
        release_groups!release_group_mbid(*),
        recordings!recording_mbid(*)
    `)
    .eq("collection_id", collectionId)
    //.not("item_position", "is", null)
    .order("item_position", { ascending: true });

    const response = await select;
    const { data, status, error } = await response;
    const collectionContents = data;
    let collectionReturned = false;
    console.log(data)

    if ( status == 200 ) {
        collectionReturned = true;
        return { collectionContents, collectionReturned };
    }
    else if ( status == 404 ) {
        return collectionReturned;
    }
    throw new Error(`HTTP error ! Status: ${status}, Error:${error}`);
}
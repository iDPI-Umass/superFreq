/*
Insert row in collection updates records. Do this every time a collection is created or updated.
*/

export const insertCollectionUpdateRecord = async function ({ id, collectionId, locals: { supabase }}) {
    const insert = supabase
    .from( "collections_updates" )
    .insert(
        {
            "collection_id": collectionId,
            "updated_by": id
        }
    )

    const response = await insert;
    const { status } = response;
    if ( status == 201 ) {
        return true;
    }
    else {
        return false;
    }
}
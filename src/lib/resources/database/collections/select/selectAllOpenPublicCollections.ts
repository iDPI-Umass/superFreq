/*
Select all that are open or public
*/

export const selectAllOpenPublicCollections = async function ({ locals: { supabase }}) {

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
        console.warn( `Collection contents for ${ collection_id } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
    

    return null;
  }
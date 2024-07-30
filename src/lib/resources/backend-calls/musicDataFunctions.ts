/* 
Generic upsert for music data inluding artists, releases_groups, and recordings. Expects three arguments: "tableName" for table to be upserted to and "...itemData" for array of items to be added.

Function also parses tableName to create column constraint that rejects duplicate mbid.

Expects object item = {
  tableName: (artists/release_groups/recordings),
  itemData: array,
}

*/

interface upsertInfo {
  tableName: string
  itemData: object
}

export const itemUpsert = async function ( {item, locals: { supabase }}: {item: upsertInfo, locals: { supabase: App.Locals["supabase"] }}) {
  const { tableName, itemData } = item;

    let columnConstraint = tableName.substring(0, tableName.length - 1);
    columnConstraint = columnConstraint.concat("_mbid");

    const upsert = supabase
    .from(tableName)
    .upsert( itemData, {ignoreDuplicates: true} );

    const { error, status, statusText } =  await upsert;

    if ( status === 201 ) {
        return await statusText;
    }
    if ( status === 409 ) {
        return await statusText;
    }
    throw new Error( `Unexpected response ${ error }`);
}


/*
Generic select for music data including aritsts, release_groups, and recordings. Expects two arguments: "tableName" for table to be selected from and "mbid" for item's identifier.
*/

export const itemSelect = async function ( {tableName, mbid, locals: {supabase}} : {tableName: string, mbid: string, locals: { supabase: App.Locals["supabase"] } }) {
  
  const category = tableName.substring(0, tableName.length - 1);
  const columnTitle = category.concat("_mbid");

   const select = supabase
  .from( tableName )
  .select()
  .eq(columnTitle, mbid);

  const response =  await select;

  if (response.status === 200) {
    return await response.data;
  }
  if ( response.status === 404 ) {
    console.warn( `${ columnTitle } ${ mbid } not found` );
    return null;
  }
  throw new Error( `Unexpected response ${ response.error }`);
}
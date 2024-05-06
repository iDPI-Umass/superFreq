/* 
Generic upsert for music data inluding artists, releases_groups, and recordings. Expects three arguments: "tableName" for table to be upserted to and "...itemData" for array of items to be added.

Function also parses tableName to create column constraint that rejects duplicate mbid.

Expects object item = {
  tableName: (artists/release_groups/recordings),
  itemData: array,
}

*/

export const itemUpsert = async function ( {item, locals: { supabase }}) {
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
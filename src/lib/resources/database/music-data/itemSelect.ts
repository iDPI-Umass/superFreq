/*
Generic select for music data including aritsts, release_groups, and recordings. Expects two arguments: "tableName" for table to be selected from and "mbid" for item's identifier.
*/

import { supabase } from '$lib/utils/supabaseClient';

export const itemSelect = async function ( tableName: string, mbid: string ) {
  
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
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ locals: { supabase, session } }) => {
    const { user: { id }} = session

    const { data, count, status, error } = await supabase
    .from("profiles")
    .select(`*`, { count: 'exact', head: false })
    .eq('id', id)
    .neq('username', null)

    const profileStorageItem = {
      "display_name": data[0]["display_name"],
      "username": data[0]["username"],
      "avatar_url": data[0]["avatar_url"]
      }
    
      console.log(id, profileStorageItem, count, status, error)
}
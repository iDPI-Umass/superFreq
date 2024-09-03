/* 
Verifies that session user matches param, then determines if user has created a top albums collection to determine redirect.
*/

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ( { url, params, locals: { safeGetSession, supabase } }) => {
    const username = params.username
    const session = await safeGetSession()
    const sessionUserId = session.user?.id
    console.log(url)

    const { data } = await supabase
    .from('profiles')
    .select(`username, top_albums_collection_id`)
    .match({'id': sessionUserId, 'username': username})

    if ( data && data.length != 0 ) {
        const topAlbums: string | null = data[0]["top_albums_collection_id"]
        const profileUsername: string | null = data[0]["username"]

        if ( profileUsername && topAlbums ) {
            return redirect(303, `${url}/edit`)
        }
        else if ( profileUsername && !topAlbums ) {
            return redirect(303, `${url}/new`)
        }
    }

    return redirect(303, `/${username}`)
}
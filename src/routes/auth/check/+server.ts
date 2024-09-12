import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from 'src/database.ts'
import { profileStoresObject } from '$lib/stores'

export const GET: RequestHandler = async ({ locals: { safeGetSession }}) => {

    const session = await safeGetSession()

    const sessionUserId = session.user?.id as string
    console.log(sessionUserId)

    const select = await db
    .selectFrom("profiles")
    .select(['username', 'display_name', 'avatar_url'])
    .where("id", '=', sessionUserId)
    .executeTakeFirst()

    const profile = await select
    const { username, display_name, avatar_url } =  profile as App.ProfileObject

    console.log(username)
    if ( profile && username ) {
      profileStoresObject.set({
        'username': username,
        'display_name': display_name,
        'avatar_url': avatar_url,
      })
      return redirect(303, `/user/${username}`)
    }
    else if ( profile && !username ) {
      return redirect(303, '/account/create-profile')
    }

    return redirect(303, '/auth/error')
}
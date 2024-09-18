import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from 'src/database.ts'
import { profileStoresObject } from '$lib/stores'

export const GET: RequestHandler = async ({ locals: { safeGetSession }}) => {

    const session = await safeGetSession()

    const sessionUserId = session.user?.id as string

    const select = await db
    .selectFrom("profiles")
    .select(['id', 'username', 'display_name', 'avatar_url'])
    .where("id", '=', sessionUserId)
    .executeTakeFirst()

    const profile = await select
    const userId = profile?.id ?? null
    const username = profile?.username ?? null
    const display_name = profile?.display_name ?? null
    const avatar_url = profile?.avatar_url ?? null

    if ( userId && username ) {
      profileStoresObject.set({
        'username': username,
        'display_name': display_name,
        'avatar_url': avatar_url,
      })
      return redirect(303, `/user/${username}`)
    }
    else if ( userId && !username ) {
      return redirect(303, '/account/create-profile')
    }

    return redirect(303, '/auth/error')
}
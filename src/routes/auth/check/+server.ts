import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from 'src/database.ts'
import { profileStoresObject } from '$lib/stores'

export const GET: RequestHandler = async ({ locals: { safeGetSession }}) => {

    const session = await safeGetSession()

    const sessionUserId = session.user?.id as string

    let userId: string | null = null
    let username: string | null = null
    let display_name: string | null = null
    let avatar_url: string | null = null
    let select: any

    try {
      select = await db
        .selectFrom("profiles")
        .select(['id', 'username', 'display_name', 'avatar_url'])
        .where("id", '=', sessionUserId)
        .executeTakeFirstOrThrow()

      const profile = await select
      userId = profile?.id as string
      username = profile?.username as string
      display_name = profile?.display_name as string
      avatar_url = profile?.avatar_url as string
    }
    catch (error) {
      select = null
    }

    if ( userId && username ) {
      profileStoresObject.set({
        'username': username,
        'display_name': display_name,
        'avatar_url': avatar_url,
      })
      return redirect(303, `/user/${username}`)
    }
    else if ( userId && !username ) {
      return redirect(303, '/create-profile')
    }

    const errorPath = new URL ( '/auth/error' )
    errorPath.searchParams.set('redirectFrom', 'check')
    return redirect(303, errorPath)
}
import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from 'src/database.ts'

export const GET: RequestHandler = async ({ locals: { safeGetSession }}) => {

    const session = await safeGetSession()
    console.log(session)

    const sessionUserId = session.user?.id as string

    const select = await db
    .selectFrom("profiles")
    .select('username')
    .where("id", '=', sessionUserId)
    .executeTakeFirstOrThrow()

    const profile = await select
    const username = profile?.username

    if ( profile && username ) {
      return redirect(303, `/user/${username}`)
    }
    else if ( profile && !username ) {
      return redirect(303, '/account/create-profile')
    }

    return redirect(303, '/auth/error')
}
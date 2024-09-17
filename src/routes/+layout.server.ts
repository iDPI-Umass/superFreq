import type { LayoutServerLoad } from './$types'
import { db } from 'src/database.ts'
import logo from "$lib/assets/images/logo/freq-logo-dark.svg"

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession()

  if (session) {
      const select = await db
      .selectFrom('profiles')
      .select(['username', 'display_name', 'website', 'avatar_url'])
      .where('id', '=', user?.id as string)
      .executeTakeFirst()

      const profile = await select as App.ProfileObject
      return { session, profile, cookies: cookies.getAll() }
  }

  const profile: App.ProfileObject = {
    'username': null,
    'display_name': null,
    'avatar_url': logo,
    'website': 'https://freq.social'
  }

  return { session, profile, cookies: cookies.getAll() }
}
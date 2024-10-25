import type { LayoutServerLoad } from './$types'
import { db } from 'src/database.ts'
import wave from "$lib/assets/images/logo/freq-wave.svg"

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession()

  if ( session ) {
    const sessionUserId = user?.id as string
    const selectSessionProfile = await db
      .selectFrom('profiles')
      .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
      .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
      .select([
        'username', 
        'display_name', 
        'website', 
        'avatar_url',
        'release_groups.release_group_name as avatar_release_group_name',
        'artists.artist_name as avatar_artist_name'
      ])
      .where('profiles.id', '=', user?.id as string)
      .executeTakeFirst()

    const profile = await selectSessionProfile
    
    return { session, sessionUserId, profile, cookies: cookies.getAll() }
  }

  const profile: App.ProfileObject = {
    'username': null,
    'display_name': null,
    'avatar_url': wave,
    'avatar_artist_name': null,
    'avatar_release_group_name': null,
    'website': 'https://freq.social'
  }

  return { session, sessionUserId: null, profile, cookies: cookies.getAll() }
}
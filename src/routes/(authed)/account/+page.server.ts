import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectSessionProfile, updateSessionProfile } from 'src/lib/resources/users'
import { sessionUserProfile } from '$lib/resources/states.svelte'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {

  const { user } = await safeGetSession()

  const sessionUserId = user?.id as string
  const profile = await selectSessionProfile( sessionUserId )

  return { user, sessionUserId, profile }
}

export const actions = {
  update: async ({ request, locals: { safeGetSession  } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const formData = await request.formData()
    const displayName = formData.get('display-name') as string
    const username = formData.get('username') as string
    const website = formData.get('website') as string
    const avatarUrl = formData.get('avatar-url') as string
    const avatarItem = JSON.parse(formData.get('avatar-item') as string) ?? null
    const about = formData.get('about') as string

    sessionUserProfile.user_id = sessionUserId
    sessionUserProfile.username = username
    sessionUserProfile.display_name = displayName
    sessionUserProfile.avatar_url = avatarUrl,
    sessionUserProfile.website = website

    if ( avatarItem ) {
      sessionUserProfile.avatar_url = avatarItem.img_url ?? null
      sessionUserProfile.last_fm_avatar_url = avatarItem.last_fm_img_url ?? null
      sessionUserProfile.avatar_artist_name = avatarItem.artist_name ?? null
      sessionUserProfile.avatar_release_group_name = avatarItem.release_group_name ??  null
      sessionUserProfile.avatar_release_group_mbid = avatarItem.release_group_mbid ?? null
    }

    const profileData = {
      id: session.user?.id,
      display_name: displayName,
      username: username,
      website: website,
      avatar_mbid: avatarItem.release_group_mbid,
      avatar_url: avatarItem.img_url,
      updated_at: new Date(),
      about: about,
    } as App.RowData

    const submitUpdate = await updateSessionProfile(sessionUserId, profileData, avatarItem)

    if ( submitUpdate ) {
      return { success: true}
    }
    else {
      return { success: false }
    }

  },

  signout: async () => {
    throw redirect(303, '/sign-out')
  }
} satisfies Actions

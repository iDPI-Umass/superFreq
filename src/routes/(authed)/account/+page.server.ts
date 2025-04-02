import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectSessionProfile, updateSessionProfile } from '$lib/resources/backend-calls/users'
import { userProfile } from '$lib/resources/states.svelte'

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
    const displayName = formData.get('displayName') as string
    const username = formData.get('username') as string
    const website = formData.get('website') as string
    const avatarMbid = formData.get('avatarMbid') as string
    const newAvatarMbid = formData.get('newAvatarMbid') ?? null
    const avatarUrl = formData.get('avatarUrl') as string
    const newAvatarUrl = formData.get('newAvatarUrl') ?? null
    const avatarItem = newAvatarMbid ? JSON.parse(formData.get('avatarItem') as string) : null
    const about = formData.get('about') as string

    const avatar = newAvatarUrl ? newAvatarUrl : avatarUrl
    const mbid = newAvatarMbid ? newAvatarMbid : avatarMbid

    console.log(avatarItem)

    userProfile.username = username
    userProfile.display_name = displayName
    userProfile.avatar_url = avatarUrl,
    userProfile.website = website

    if ( avatarItem ) {
      userProfile.avatar_url = avatarItem.img_url ?? null
      userProfile.last_fm_avatar_url = avatarItem.last_fm_avatar_url ?? null
      userProfile.avatar_artist_name = avatarItem.artist_name ?? null
      userProfile.avatar_release_group_name = avatarItem.release_group_name ??  null
    }

    const profileData = {
      id: session.user?.id,
      display_name: displayName,
      username: username,
      website: website,
      avatar_mbid: mbid,
      avatar_url: avatar,
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

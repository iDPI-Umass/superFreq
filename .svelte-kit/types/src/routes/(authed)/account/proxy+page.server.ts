// @ts-nocheck
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectSessionProfile, updateSessionProfile } from '$lib/resources/backend-calls/users'
import { profileStoresObject } from '$lib/stores'

export const load = async ({ locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {

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

    profileStoresObject.set({
      'username': username,
      'display_name': displayName,
      'avatar_url': avatar,
      'website': website
    })

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

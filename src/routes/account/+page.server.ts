import { fail, redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectSessionProfile, updateSessionProfile } from '$lib/resources/backend-calls/users'
import { profileStoresObject } from '$lib/stores'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {

  const { session, user } = await safeGetSession()

  if (!session) {
    throw redirect(303, '/')
  }

  const sessionUserId = user?.id as string
  const profile = await selectSessionProfile( sessionUserId )

  console.log(profile?.avatar_url)
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
    const avatarUrl = formData.get('avatarUrl') as string
    const about = formData.get('about') as string

    console.log(avatarUrl)

    profileStoresObject.set({
      'username': username,
      'display_name': displayName,
      'avatar_url': avatarUrl,
      'website': website
    })

    const profileData = {
      id: session.user?.id,
      display_name: displayName,
      username: username,
      website: website,
      avatar_mbid: avatarMbid,
      avatar_url: avatarUrl,
      updated_at: new Date(),
      about: about,
    } as App.RowData

    const submitUpdate = await updateSessionProfile(sessionUserId, profileData)

    if ( submitUpdate ) {
      return { success: true}
    }
    else {
      return { success: false }
    }

  },

  signout: async ({ locals: { supabase, session } }) => {
    if ( session ) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
} satisfies Actions

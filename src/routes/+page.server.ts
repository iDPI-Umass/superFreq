import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  // if the user is already logged in, redirect to feed
  const { profile } = await parent()
  const username = profile.username as string ?? null
  if (session.session && username) {
    throw redirect(303, `/user/${username}`)
  }
  else if (session.session && !username) {
    throw redirect(303, `/account/create-profile`)
  }

  return { url: url.origin }
}

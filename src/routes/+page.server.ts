import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession()
  console.log(session.session)
  // if the user is already logged in, redirect to feed
  const { profile } = await parent()
  const username = profile.username as string ?? null
  if (session.session && username) {
    throw redirect(303, `/user/${username}`)
  }
  else if (session.session && !username) {
    throw redirect(303, `/account/create-profile`)
  }
  else {
    throw redirect(303, '/welcome')
  }

  return { url: url.origin }
}

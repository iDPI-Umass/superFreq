import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession()
  // if the user is already logged in, redirect to feed
  if (session.session) {
    const { profile } = await parent()
    const username = profile.username as string
    throw redirect(303, `/user/${username}`)
  }
  else {
    throw redirect(303, '/welcome')
  }

  return { url: url.origin }
}

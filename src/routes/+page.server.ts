import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  // if the user is already logged in, redirect to feed
  if (session) {
    throw redirect(303, '/feed')
  }

  return { url: url.origin }
}

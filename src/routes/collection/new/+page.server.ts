import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: {safeGetSession} }) => {
  const session = await safeGetSession()
  const sessionUserId = session.user?.id

  if (!session) {
    throw redirect(303, '/')
  }
  
  return { session, sessionUserId }
}
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: {session} }) => {

  if (!session) {
    throw redirect(303, '/')
  }
  
  return { session }
}
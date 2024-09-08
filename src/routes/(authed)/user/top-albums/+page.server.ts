import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { insertUpdateTopAlbumsCollection, selectEditableTopAlbumsCollection } from '$lib/resources/backend-calls/collections';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession()
  const sessionUserId = session.user?.id as string

  const collection = await selectEditableTopAlbumsCollection( sessionUserId )
  return { collection }
}

export const actions = {
  submitCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const formData = await request.formData()
    const collectionItems = JSON.parse(formData.get('collection-items') as string)

    const insertUpdate = await insertUpdateTopAlbumsCollection( sessionUserId, collectionItems )

    const username = insertUpdate?.username as string

    if ( insertUpdate ) {
      throw redirect(303, `/user/${username}`)
    }
    else {
      return { success: false }
    }
  }
} satisfies Actions
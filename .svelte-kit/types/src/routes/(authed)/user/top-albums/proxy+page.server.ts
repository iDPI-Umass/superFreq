// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { insertUpdateTopAlbumsCollection, selectEditableTopAlbumsCollection } from '$lib/resources/backend-calls/collections';

export const load = async ({ locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {
  const session = await safeGetSession()
  const sessionUserId = session.user?.id as string

  const { collectionContents, deletedCollectionContents } = await selectEditableTopAlbumsCollection( sessionUserId )
  return { collectionContents, deletedCollectionContents }
}

export const actions = {
  submitCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    const data = await request.formData()
    const collectionItems = JSON.parse(data.get('collection-items') as string)
    const deletedCollectionItems = JSON.parse( data.get('deleted-items') as string) 

    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems)

    const insertUpdate = await insertUpdateTopAlbumsCollection( sessionUserId, activeAndDeletedCollectionItems )

    const username = insertUpdate?.username as string

    if ( insertUpdate ) {
      throw redirect(303, `/user/${username}`)
    }
    else {
      return { success: false }
    }
  }
} satisfies Actions
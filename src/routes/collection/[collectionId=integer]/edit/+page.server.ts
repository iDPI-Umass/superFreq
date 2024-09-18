import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { timestampISO } from '$lib/resources/parseData'
import { selectEditableCollectionContents, updateCollection } from '$lib/resources/backend-calls/collections'

export const load: PageServerLoad = async ({ parent, params, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  const { profile } = await parent()

  const username = profile?.username ?? null

  if ( !session.session ) {
      throw redirect(307, '/')
  }
  else if( session.session && !username ) {
      throw redirect(307, '/account/create-profile')
  }

  const collectionId = parseInt(params.collectionId).toString()

  const sessionUserId = session.user?.id as string

  const collection = await selectEditableCollectionContents(collectionId, sessionUserId)

  if ( collection ) {
      return { collection, sessionUserId, collectionId };
  }
  else {
    throw redirect(303, '/collections')
  }
}

export const actions: Actions = {
  updateCollection: async ({ request }) => {
    const data = await request.formData()

    const collectionTitle = data.get('collection-title')
    const collectionId = data.get('collection-id')
    const collectionType = data.get('collection-type')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    const items = data.get('collection-contents') as string
    const deletedItems = data.get('deleted-items') as string
    const updatedBy = data.get('updated-by')

    const collectionItems = JSON.parse(items) as App.RowData
    const deletedCollectionItems = JSON.parse(deletedItems) as App.RowData

    console.log(collectionItems)
    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems)

    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      type: collectionType,
      collection_id: collectionId,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy
    }

    const update = await updateCollection( collectionInfo, activeAndDeletedCollectionItems )

    if ( !update ) {
      alert('update not successful') 
    }
    else {
      throw redirect(303, `/collection/${collectionId}`)
    }
  }
}
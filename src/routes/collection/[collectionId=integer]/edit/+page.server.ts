import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { timestampISO } from '$lib/resources/parseData'
import { selectEditableCollectionContents, updateCollection } from '$lib/resources/backend-calls/collections'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  if (!session.session) {
    throw redirect(303, '/')
}

  const collectionId = parseInt(params.collectionId).toString()

  const sessionUserId = session.user?.id as string

  const collection = await selectEditableCollectionContents(collectionId, 'release_groups', sessionUserId)

  if ( collection.length > 0) {
      return { collection, sessionUserId, collectionId };
  }
  else {
      return {
          status: 403,
          redirect: "/collections"
      }
  }
}

export const actions: Actions = {
  updateCollection: async ({ request }) => {
    const data = await request.formData()

    const collectionTitle = data.get('collection-title')
    const collectionId = data.get('collection-id')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    const items = data.get('collection-contents') as string
    const updatedBy = data.get('updated-by')

    const collectionItems = JSON.parse(items) as App.RowData

    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      collection_id: collectionId,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy
    }

    const update = await updateCollection( collectionInfo, collectionItems )

    if ( !update ) {
      alert('update not successful') 
    }
    else {
      redirect(303, `/collection/${collectionId}`)
    }
  }
}
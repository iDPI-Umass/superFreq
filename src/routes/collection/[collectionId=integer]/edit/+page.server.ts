import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { timestampISO } from '$lib/resources/parseData'
import { selectEditableCollectionContents } from '$lib/resources/backend-calls/collectionSelectFunctions'
import { updateCollection } from 'src/lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  if (!session) {
    throw redirect(401, '/')
  }

  const collectionId = parseInt(params.collectionId).toString()

  const sessionUserId = session.user?.id as string

  const collection = await selectEditableCollectionContents(collectionId, 'release_groups', sessionUserId)

  const changelog = collection[0]["changelog"] as any
  const updatedAt = collection[0]["updated_at"].toISOString()
  changelog[updatedAt] = {
    'title': collection[0]["title"],
    'status': collection[0]["status"],
    'description_text': collection[0]["description_text"],
    'updated_by': sessionUserId
  }

  if ( collection.length > 0) {
      return { collection, sessionUserId, collectionId, changelog };
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
    const collectionType = data.get('collection-type')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    let collectionItems = data.get('collection-contents') as string
    const updatedBy = data.get('updated-by')
    const changelog = data.get('changelog')

    collectionItems = JSON.parse(collectionItems)

    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      collection_id: collectionId,
      type: collectionType,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy,
      changelog: changelog
    }

    const update = await updateCollection({collectionInfo, collectionItems})

    console.log(update)

    if ( !update ) {
      alert('update not successful') 
    }
    else {
      redirect(303, `/collection/${collectionId}`)
    }
  }
}
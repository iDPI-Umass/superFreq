import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { timestampISO } from '$lib/resources/parseData'
import { selectEditableCollectionContents, updateCollection, deleteCollection } from 'src/lib/resources/collections'
import { searchCollections } from 'src/lib/resources/search'

let collectionId: string
let updatedBy: string

const collectionSearchResults = [] as App.RowData[]

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

  // const collectionId = parseInt(params.collectionId).toString()
  collectionId = params.collectionId

  const sessionUserId = session.user?.id as string

  const collection = await selectEditableCollectionContents(collectionId, sessionUserId)
  const editPermission = collection.editPermission

  updatedBy = sessionUserId

  if ( editPermission ) {
    return { collection, sessionUserId, collectionId, collectionSearchResults }
  }
  else {
    throw redirect(303, `/collection/${collectionId}`)
  }
}

export const actions: Actions = {
  updateCollection: async ({ request, locals: { safeGetSession} }) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string
    const data = await request.formData()

    const collectionTitle = data.get('collection-title')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    const sort = data.get('view-sort') as string
    const items = data.get('collection-contents') as string
    const deletedItems = data.get('deleted-items') as string

    const collectionItems = JSON.parse(items) as App.RowData
    const deletedCollectionItems = JSON.parse(deletedItems) as App.RowData

    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems)

    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      default_view_sort: sort,
      collection_id: collectionId,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy
    }


    const update = await updateCollection( sessionUserId, collectionInfo, activeAndDeletedCollectionItems )

    if ( !update ) {
      alert('update not successful') 
    }
    else {
      throw redirect(303, `/collection/${collectionId}`)
    }
  },
  deleteCollection: async ({ locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string
    const { success } = await deleteCollection( sessionUserId, collectionId )
    if ( success ) {
      redirect(303, '/')
    }
    else { return success }
  },
  search: async ({ request }) => {
    const data = await request.formData()
    const query = data.get('query') as string
    const resultsLimit = parseInt(data.get('results-limit') as string)
    const searchCategory = data.get('search-category') as string
    const queryType = data.get('query-type') as string

    collectionSearchResults.length = 0

    const searchResults = await searchCollections( query, queryType, resultsLimit )

    collectionSearchResults.push(...searchResults.results)
  }
}
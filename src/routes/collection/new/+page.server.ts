import { redirect } from '@sveltejs/kit'
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { insertCollection } from 'src/lib/resources/backend-calls/collections'

export const load: PageServerLoad = async ({ locals: {safeGetSession} }) => {
  const session = await safeGetSession()

  if (!session.session) {
    throw redirect(303, '/')
}
  
  const sessionUserId = session.user?.id

  return { sessionUserId }
}

export const actions = {
  insertCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession()
    const sessionUserId =  session.user?.id as string

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const data = await request.formData()
    const collectionTitle = data.get('collection-title')
    const collectionType = data.get('collection-type')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    const collectionItemsString = data.get('collection-contents') as string
    const changelog: App.Changelog = {}

    const collectionItems = JSON.parse(collectionItemsString) as App.RowData

    changelog[timestampISOString] = {
      'title': collectionTitle,
      'status': collectionStatus,
      'description_text': collectionDescription,
      'updated_by': sessionUserId
    }

    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      type: collectionType,
      description_text: collectionDescription,
      created_at: timestampISO,
      updated_at: timestampISO,
      owner_id: sessionUserId,
      updated_by: sessionUserId,
      changelog: changelog
    } as App.RowData

    const collectionId = await insertCollection(sessionUserId, collectionInfo, collectionItems)
 
    console.log(collectionId)
    if ( !collectionId ) {
      alert('update not successful') 
    }
    else {
      redirect(303, `/collection/${collectionId}`)
    }
  }
} satisfies Actions
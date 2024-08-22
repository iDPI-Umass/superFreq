import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { insertCollection } from 'src/lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions'
import { timestampISO, timestampISOString } from '$lib/resources/parseData'

export const load: PageServerLoad = async ({ locals: {safeGetSession} }) => {
  const session = await safeGetSession()
  const sessionUserId = session.user?.id

  if (!session) {
    throw redirect(303, '/')
  }
  
  return { sessionUserId }
}

export const actions = {
  insertCollection: async ({ request }) => {
    const data = await request.formData()
    console.log(data)

    const sessionUserId = data.get('session-user-id') as string
    const collectionTitle = data.get('collection-title')
    const collectionType = data.get('collection-type')
    const collectionStatus = data.get('status')
    const collectionDescription = data.get('description')
    const collectionItemsString = data.get('collection-contents') as string
    const changelog: App.Changelog = {}

    // const collectionItems=[...collectionItemString]
    // console.log(collectionItems)
    const collectionItems: App.NestedObject = JSON.parse(collectionItemsString)

    changelog[timestampISOString] = {
      'title': collectionTitle,
      'status': collectionStatus,
      'description_text': collectionDescription,
      'updated_by': sessionUserId
    }

    // const collectionItems = []
    // for (const item of collectionContents) {
    //   console.log(item[0])
    //   console.log(JSON.parse(item[0]))
    //   collectionItems.push(JSON.parse(item))
    // }

    // console.log(collectionItems)

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
    }

    const collectionId = await insertCollection({collectionInfo, collectionItems, sessionUserId})

    console.log(collectionId)
    if ( !collectionId ) {
      alert('update not successful') 
    }
    else {
      redirect(303, `/collection/${collectionId}`)
    }
  }
} satisfies Actions
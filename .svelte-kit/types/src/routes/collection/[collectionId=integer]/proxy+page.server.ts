// @ts-nocheck
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectViewableCollectionContents } from '$lib/resources/backend-calls/collections'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/users'

let loadData = true
let updateFollow = false

let collectionId: string
let collectionInfo: App.RowData
let collectionContents: App.RowData[]
let viewPermission: boolean
let editPermission: boolean
let followData: App.RowData

let followsNow: boolean

export const load = async ({ params, locals: { safeGetSession } }: Parameters<PageServerLoad>[0]) => {

    collectionId = parseInt(params.collectionId).toString();

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    if ( loadData ) {
        const collection =  await selectViewableCollectionContents(collectionId, sessionUserId)

        collectionInfo = collection.collectionInfo as App.RowData
        collectionContents = collection.collectionContents as App.RowData[]
        viewPermission = collection.viewPermission as boolean
        editPermission = collection.editPermission as boolean
        followData = collection.followData as App.RowData ?? {'follows_now': false} as App.RowData

        if ( !viewPermission ) {
            throw redirect(307, '/collections')
        }
    }

    if ( updateFollow ) {
        updateFollow = false
        loadData = true

        followData['follows_now'] = followsNow
    }

    return { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData }
}

export const actions = {
    followCollection: async ({ request, locals: { safeGetSession } }) => {
        updateFollow = true
        loadData = false

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        
        const data = await request.formData()
        const collectionId = data.get('collection-id') as string

        const follow = await insertUpdateCollectionFollow(sessionUserId, collectionId)

        followsNow = follow?.follows_now as boolean

        return { success: true }
    }
} satisfies Actions
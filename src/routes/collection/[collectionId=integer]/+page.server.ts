import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { selectViewableCollectionContents } from '$lib/resources/backend-calls/collections'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction } from '$lib/resources/backend-calls/posts'

let loadData = true
let updateFollow = false

let collectionId: string
let collectionMetadata: App.RowData
let collectionContents: App.RowData[]
let viewPermission: boolean
let editPermission: boolean
let followData: App.RowData

let followsNow: boolean

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {

    collectionId = parseInt(params.collectionId).toString();

    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    if ( loadData ) {
        const collection =  await selectViewableCollectionContents(collectionId, sessionUserId)

        collectionMetadata = collection.collectionMetadata as App.RowData
        collectionContents = collection.collectionContents as App.RowData[]
        viewPermission = collection.viewPermission as boolean
        editPermission = collection.editPermission as boolean

        followData = {
            'follows_now': collection.followsNow ?? false
        } as App.RowData 

        if ( !viewPermission ) {
            throw redirect(307, '/collections')
        }
    }

    if ( updateFollow ) {
        updateFollow = false
        loadData = true

        followData['follows_now'] = followsNow
    }

    return { sessionUserId, collectionId, collectionMetadata, collectionContents, viewPermission, editPermission, followData }
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
    },
    submitReaction: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const reactionType = data.get('reaction-type') as string
        const itemId = data.get('collection-id') as string
        const itemType = 'collection'

        const { reaction } = await insertUpdateReaction( sessionUserId, itemId, reactionType, itemType )

        const success = reaction ? true : false

        return { success }
    }
} satisfies Actions
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { parseISO } from 'date-fns'

import { selectViewableCollectionContents } from '$lib/resources/backend-calls/collections'
import { insertUpdateCollectionFollow } from '$lib/resources/backend-calls/users'
import { insertUpdateReaction, insertPost, updatePost, deletePost } from '$lib/resources/backend-calls/posts'
import { insertPostFlag } from '$lib/resources/backend-calls/users'

let loadData = true
let updateFollow = false

let collectionId: string
let collectionMetadata: App.RowData
let collectionContents: App.RowData[]
let collectionComments: App.RowData[]
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
        collectionComments = collection.collectionComments as App.RowData[]
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

    return { sessionUserId, collectionId, collectionMetadata, collectionContents, collectionComments, viewPermission, editPermission, followData }
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
    submitReply: async ({ request, locals: { safeGetSession } })=> {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const replyText = data.get('reply-text') as string
        const postId = data.get('post-id') as string
        const replyToId = data.get('reply-to-id') as string
        const parentCollectionId = data.get('parent-collection-id') as string
        const parentPostId = data.get('parent-post-id') as string

        const postData = {
            user_id: sessionUserId,
            type: "reply",
            status: "new",
            text: replyText,
            created_at: timestampISO,
            updated_at: timestampISO,
            parent_post_id: !parentPostId ? postId : parentPostId,
            parent_collection_id: parentCollectionId ?? null,
            reply_to: !replyToId ? postId : replyToId
        }

        const { username, createdAt } = await insertPost( postData )

        const commentTimestampSlug = createdAt.toString()
        const commentTimestamp = Date.parse(commentTimestampSlug).toString()
        const permalink = `/collection/${parentCollectionId}#${username.concat(commentTimestamp)}`

        if (createdAt) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }
    },
    submitReaction: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const reactionType = data.get('reaction-type') as string
        const collectionId = data.get('parent-collection-id') as string ?? data.get('collection-id') as string
        const postId = data.get('post-id') as string ?? data.get('post-reply-id') as string

        const itemType = postId ? 'post' : 'collection'

        const reactionData = {
            'user_id': sessionUserId,
            'post_id': postId,
            'collection_id': collectionId,
            'reaction_type': reactionType,
            'item_type': itemType
        } as App.RowData

        console.log(reactionData)
        const { reaction } = await insertUpdateReaction( reactionData )

        const success = reaction ? true : false

        return { success }
    },
    editPost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        const success =  submitEdit ? true : false

        return { success }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string ?? data.get('post-reply-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const permalink = `/collection/${collectionId}`

        if ( submitDelete ) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }
    },
    flagPost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string ?? data.get('post-reply-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const success = flag ? true : false

        return { success }
    },
} satisfies Actions
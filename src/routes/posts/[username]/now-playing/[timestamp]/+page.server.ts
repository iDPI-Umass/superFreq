import { redirect } from '@sveltejs/kit'
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { selectPostAndReplies, insertPost, updatePost, deletePost, insertUpdateReaction } from 'src/lib/resources/posts'
import { insertPostFlag } from 'src/lib/resources/users'
import { selectListSessionUserCollections, saveItemToCollection } from 'src/lib/resources/collections.js'

let collections = [] as App.RowData[]

export const load: PageServerLoad = async ({ params, parent, locals: { safeGetSession } }) => {

    const { session } = await safeGetSession()
    const { profile } = await parent()

    const profileUsername = profile?.username ?? null

    if ( !session ) {
        throw redirect(307, '/')
    }
    else if( session && !profileUsername ) {
        throw redirect(307, '/create-profile')
    }
    
    const sessionUserId = session?.user.id as string

    const username = params.username
    const timestamp = parseInt(params.timestamp)
    const timestampString = new Date(timestamp).toISOString()

    let replies: App.RowData[] = []
    let permission: boolean = true

    let post = {} as App.RowData

    const select = await selectPostAndReplies( sessionUserId, username, timestampString )

    post = select.post as App.RowData
    replies = select.replies as App.RowData[]
    permission = select.permission as boolean

    if ( !permission ) {
        return { sessionUserId: null, post: {}, replies: [], collections, postTimestamp: null }
    }

    return { sessionUserId, post, replies, collections, postTimestamp: timestamp }
}

export const actions = {
    submitReply: async ({ request, locals: { safeGetSession } })=> {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const replyText = data.get('reply-text') as string
        const postId = data.get('post-id') as string
        const replyToId = data.get('reply-to-id') as string
        const parentPostId = data.get('parent-post-id') as string
        const postUsername = data.get('post-username') as string
        const postTimestamp = data.get('post-timestamp') as string

        const postTimestampDateString = Date.parse(postTimestamp).toString()

        const postData = {
            user_id: sessionUserId,
            type: "reply",
            status: "new",
            text: replyText,
            created_at: timestampISO,
            updated_at: timestampISO,
            parent_post_id: !parentPostId ? postId : parentPostId,
            reply_to: !replyToId ? postId : replyToId
        }

        const { username, createdAt } = await insertPost( postData )

        const commentTimestampSlug = createdAt.toString()
        const commentTimestamp = Date.parse(commentTimestampSlug).toString()
        const permalink = `/posts/${postUsername}/now-playing/${postTimestampDateString}#${username.concat(commentTimestamp)}`

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
        const postId = data.get('post-id') as string ?? data.get('post-reply-id') as string

        const reactionData = {
            'user_id': sessionUserId,
            'post_id': postId,
            'collection_id': null,
            'reaction_type': reactionType,
            'item_type': 'post'
        } as App.RowData

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
        const parentPostUsername = data.get('post-username') as string
        const parentPostId = data.get('parent-post-id') as string
        const parentPostTimestamp = data.get('parent-post-timestamp') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const permalink = parentPostId ? `/posts/${parentPostUsername}/now-playing/${parentPostTimestamp}` : '/'

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
    getCollectionList: async ({ locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        collections = await selectListSessionUserCollections(sessionUserId)

        return { showCollectionsModal: true }
       },
    saveToCollection: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string
        
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const collectionId = data.get('collection-id') as string
        
        const update = await saveItemToCollection( sessionUserId, postId, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
import { redirect } from '@sveltejs/kit'
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { selectPostAndReplies, insertPost, updatePost, deletePost, insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { insertPostFlag } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ params, parent, locals: { safeGetSession } }) => {
    const session = await safeGetSession()

    const { profile } = await parent()

    let username = profile?.username ?? null

    if ( !session.session ) {
        throw redirect(307, '/')
    }
    else if( session.session && !username ) {
        throw redirect(307, '/create-profile')
    }
    
    const sessionUserId = session.user?.id as string

    username = params.username
    const timestamp = parseInt(params.timestamp)
    const timestampString = new Date(timestamp).toISOString()
    const postType = "now_playing"

    const select = await selectPostAndReplies( sessionUserId, username, timestampString, postType )

    const permission = select?.permission as boolean

    if ( !permission ) {
        return { sessionUserId: null, post: null, postReactionActive: null, replies: null }
    }

    const post = select?.post as App.RowData
    const postReactionActive = select?.postReactionActive?.active as boolean
    const replies = select?.replies as App.RowData[]

    return { sessionUserId, post, postReactionActive, replies }
}

export const actions = {
    submitReply: async ({ request, locals: { safeGetSession }})=> {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const replyText = data.get('reply-text') as string
        const postId = data.get('post-id') as string
        const postUsername = data.get('post-username') as string
        const postCreatedAt = data.get('post-created-at') as string

        const postData = {
            user_id: sessionUserId,
            type: "reply",
            status: "new",
            text: replyText,
            created_at: timestampISO,
            updated_at: timestampISO,
            parent_post_id: postId,
        }

        const { username, createdAt} = await insertPost( postData )

        const postTimestamp = Date.parse(postCreatedAt).toString()
        const commentTimestampSlug = createdAt.toString()
        const commentTimestamp = Date.parse(commentTimestampSlug).toString()
        const permalink = `/posts/${postUsername}/now-playing/${postTimestamp}#${username.concat(commentTimestamp)}`

        if (createdAt) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const { reaction, reactionCount } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        const reactionActive = reaction?.active

        const success = reaction ? true : false
        return { success, reactionActive, reactionCount }

    },
    editPost: async ({ request, locals: { safeGetSession } }) => {

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        if ( submitEdit ) {
            return { success: true, editState: false }
        }
        else {
            return { success: false, editState: true }
        }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-reply-id') as string ?? data.get('post-id') as string
        const postUsername = data.get('post-username') as string
        const postCreatedAt = data.get('post-created-at') as string


        const submitDelete = await deletePost( sessionUserId, postId )

        const permalink = `/posts/${postUsername}/now-playing/${postCreatedAt}`

        if ( submitDelete ) {
            throw redirect(303, permalink)
        }
        else { 
            return { success: false }
        }

    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-reply-id') as string ?? data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const success = flag ? true : false
        return { success }
    }
} satisfies Actions
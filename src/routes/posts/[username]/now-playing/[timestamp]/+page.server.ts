import { redirect } from '@sveltejs/kit'
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { selectPostAndReplies, insertPost, updatePost, deletePost, insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { insertPostFlag } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession } }) => {
    const session = await safeGetSession()

    if (!session.session) {
        throw redirect(303, '/')
    }
    
    const sessionUserId = session.user?.id as string

    const username = params.username
    const timestampString = params.timestamp
    const postType = "now_playing"

    console.log(parseISO(timestampString))

    const { post, postReactionActive, replies, permission } = await selectPostAndReplies( sessionUserId, username, timestampString, postType )

    if ( !permission ) {
        return { sessionUserId: null, post: null, postReactionActive: null, replies: null }
    }

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

        const postData = {
            user_id: sessionUserId,
            type: "reply",
            status: "new",
            text: replyText,
            created_at: timestampISO,
            updated_at: timestampISO,
        }

        const insertReply = await insertPost( postData )

        if (insertReply) {
            return { success: true }
        }
        else { 
            return { success: false }
        }
    },
    editPost: async ({ request, locals: { safeGetSession } }) => {

        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = data.get('post-data') as App.RowData

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
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        if ( submitDelete ) {
            throw redirect(303, '/feed')
        }
        else { 
            return { falied: true }
        }

    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        return flag
    },
    insertReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

        return reaction
    }
} satisfies Actions
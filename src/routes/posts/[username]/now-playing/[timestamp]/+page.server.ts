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
        throw redirect(307, '/account/create-profile')
    }
    
    const sessionUserId = session.user?.id as string

    username = params.username
    const timestampString = params.timestamp
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

        const permalink = `/posts/${postUsername}/now-playing/${postCreatedAt}#${username.concat(createdAt.toISOString())}`

        if (createdAt) {
            throw redirect(303, permalink)
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
        console.log('deleting')
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string
        const postUsername = data.get('post-username') as string
        const postCreatedAt = data.get('post-created-at') as string


        const submitDelete = await deletePost( sessionUserId, postId )

        const permalink = `/posts/${postUsername}/now-playing/${postCreatedAt}`

        if ( submitDelete ) {
            throw redirect(303, permalink)
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
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string
        const postUsername = data.get('post-username') as string
        const postCreatedAt = data.get('post-created-at') as string

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

        const permalink = `/posts/${postUsername}/now-playing/${postCreatedAt}`
        
        if ( reaction ) {
            throw redirect(303, permalink)
        }
        else { return { success: false }}

    }
} satisfies Actions
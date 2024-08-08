import type { PageServerLoad, Actions, Posts } from './$types'
import { selectPost, updatePost, selectPostReplies, getReactionData } from '$lib/resources/backend-calls/posts'
import { insertPostFlag } from '$lib/resources/backend-calls/userActions'
import { timestampISO } from '$lib/resources/parseData'

export const load: PageServerLoad = async ({ params, locals: { session } }) => {
    const username = params.username
    const timestampString = params.timestamp
    const postType = "now_playing"

    const post = await selectPost({ username, timestampString, postType })
    console.log(post)

    const postId = post.id
    const replies = await selectPostReplies( postId )

    // const reactions = await getReactionData( postId, userId )
    const reactions = [{
        'total_reactions': 4
    }]

    return { session, post, replies, reactions }
}

export const actions = {
    editPost: async ({ request }) => {
        const data = await request.formData()
        const editedText = data.get('edited-text') as string
        const postData = data.get('post-data')

        const update = await updatePost( postData, editedText )

        if ( update ) {
            const success = true
            const editState = false
            return { success, editState }
        }
        else {
            const success = false
            const editState = true
            return { success, editState }
        }
    },
    flagPost: async ({ request }) => {
        const data = await request.formData()
        const sessionUserId = data.get('session-user-id') as string
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag(sessionUserId, postId)

        return flag
    }
} satisfies Actions
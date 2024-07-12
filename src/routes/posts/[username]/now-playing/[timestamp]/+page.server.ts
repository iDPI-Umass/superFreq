import type { PageServerLoad, Actions, Posts } from './$types'
import { selectPost, updatePost, selectPostReplies, getReactionData } from '$lib/resources/backend-calls/posts'
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
    editPost: async ({ request, locals: { session }}) => {
        const userId = session?.user.id
        const data = await request.formData()
        const editedText = data.get('editedText') as string
        const postData = data.get('postData')

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
    }

} satisfies Actions
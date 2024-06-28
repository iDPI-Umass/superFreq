import type { PageServerLoad } from './$types'
import { selectPost, selectPostReplies, countReactions } from '$lib/resources/backend-calls/posts'

export const load: PageServerLoad = async ({ params, locals: { session } }) => {
    const username = params.username
    const timestampString = params.timestamp
    const postType = "now_playing"

    const post = await selectPost({ username, timestampString, postType })
    console.log(post)

    const postId = post.id
    const replies = await selectPostReplies( postId )

    const reactions = await countReactions( postId )

    return { session, post, replies, reactions }
}
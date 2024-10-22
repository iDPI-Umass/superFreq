import type { PageServerLoad, Actions } from './$types'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { add, parseISO } from 'date-fns'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const batchSize = 5
    const batchIterator = 0
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    const { feedData, totalRowCount, remainingCount } = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options )

    const remaining = remainingCount as number

    return { sessionUserId, feedData, totalRowCount, remaining, timestampStart, timestampEnd, batchSize, batchIterator, options }
}

export const actions = {
    loadMore: async({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const feedItems = JSON.parse(data.get('feed-items') as string)
        const batchSize = parseInt(data.get('batch-size') as string)
        let batchIterator = parseInt(data.get('batch-iterator') as string)
        batchIterator ++
        const timestampStart = parseISO(data.get('timestamp-start') as string)
        const timestampEnd = parseISO(data.get('timestamp-end') as string)
        const options = JSON.parse(data.get('options') as string) as App.Lookup

        const { feedData, remainingCount } = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)

        feedItems.push(...feedData)
        const remaining = remainingCount as number

        return { feedItems, remaining, batchIterator }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

        return reaction
    }
} satisfies Actions
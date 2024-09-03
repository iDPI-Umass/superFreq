import type { PageServerLoad, Actions } from './$types'
import { selectFeedData, selectMoreFeedData } from '$lib/resources/backend-calls/feed'
import { add, parseISO } from 'date-fns'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    const batchSize = 50
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    const firstBatch = await selectFeedData( sessionUserId, batchSize, timestampStart, timestampEnd, options )

    return { sessionUserId, firstBatch, timestampStart, timestampEnd, batchSize, options }
}

export const actions = {
    fetchMoreData: async({ request }) => {
        const data = await request.formData()
        const sessionUserId = data.get('session-user-id') as string
        const batchSize = parseInt(data.get('batch-size') as string)
        let batchIterator = parseInt(data.get('batch-iterator') as string)
        const timestampStart = parseISO(data.get('timestamp-start') as string)
        const timestampEnd = parseISO(data.get('timestamp-end') as string)
        const options = JSON.parse(data.get('options') as string) as App.Lookup

        batchIterator = batchIterator + 1

        const nextBatch = await selectMoreFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)

        return { nextBatch, batchSize, batchIterator }
    }
} satisfies Actions
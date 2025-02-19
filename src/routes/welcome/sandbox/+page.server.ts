import type { PageServerLoad } from './$types'
import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
import { add } from 'date-fns'

export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string
    const batchSize = 5
    let batchIterator = 0
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    const feedData = await feedRewrite( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)

    // console.log(feedData.length)
    // console.log(feedData)

    return { feedData }
}
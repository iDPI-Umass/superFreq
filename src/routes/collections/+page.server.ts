import type { PageServerLoad, Actions } from './$types'
import { selectAllOpenPublicCollections } from '$lib/resources/backend-calls/collections'
import { add } from 'date-fns'
import { selectFirehoseFeed } from '$lib/resources/backend-calls/feed'
import { feedData } from 'src/lib/resources/states.svelte'



let loadFeedData = true

let feedItems = [] as App.RowData[]
let feedItemCount = 0
let totalAvailableItems = 0
let feedRemaining = 0



export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    // handling the collections feed
    const {session} = await safeGetSession()
    const sessionUserId = session?.user.id as string
    const feedBatchSize = 20
    const feedTimestampEnd = new Date()
    const feedTimestampStart = add(feedTimestampEnd, {days: -300})

    const batchSize = 25
    const batchIterator = 0

    // ripped from the feed
    if ( loadFeedData && ( batchSize * ( batchIterator + 1 ) != feedItems.length )) {

        feedData.feedItems.length = batchIterator * batchSize

        const select = await selectFirehoseFeed( sessionUserId, batchSize, batchIterator, feedTimestampStart, feedTimestampEnd )

        const totalRowCount = select.totalRowCount
        const selectedFeedData = select.feedData

        feedData.feedItems.push(...selectedFeedData)
        feedItemCount = feedData.feedItems.length

        totalAvailableItems = totalRowCount as number
        feedRemaining = totalRowCount - feedItemCount

        loadFeedData = !loadFeedData
    }

    const { batch, remainingCount } = await selectAllOpenPublicCollections( batchSize, batchIterator )

    const totalCollections = batch.collectionsCount[0].count

    const collections = batch.collections
    const remaining = remainingCount
    feedItems = feedData.feedItems;
    feedItems = feedItems.filter((item) => {
        let x = item.item_type
        if (x === "collection_edit") { return true }
        if (x === "collection_follow") { return true }
    })

    collections.length = 6

    for ( const collection of collections ) {
        if ( collection.description.length > 100 ) {
            let splitPosition = collection.description.indexOf(' ', 100)
            let splitString = collection.description.substring(0, splitPosition)
            splitString = splitString.concat('...')
            collection.description = splitString
        }
    }

   return { sessionUserId, collections, feedRemaining, feedItems, remaining, totalCollections, batchSize, batchIterator }
}

export const actions = {
    loadMore: async ({ request }) => {
        const data = await request.formData()
        const collections = JSON.parse(data.get('collections') as string)
        const batchSize = parseInt(data.get('batch-size') as string)
        let batchIterator = parseInt(data.get('batch-iterator') as string)
        batchIterator ++

        const { batch, remainingCount } = await selectAllOpenPublicCollections( batchSize, batchIterator )

        collections.push(...batch.collections)
        const remaining = remainingCount as number
        
        return { collections, remaining, batchIterator }
    }
} satisfies Actions
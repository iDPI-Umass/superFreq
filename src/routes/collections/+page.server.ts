import type { PageServerLoad } from './$types'
import { selectSpotlightCollections, selectRecentOpenPublicCollections, selectFollowedUsersOpenPublicCollections } from 'src/lib/resources/collections'
import { add } from 'date-fns'
import { selectFeedData } from 'src/lib/resources/feed'
import { PUBLIC_SPOTLIGHT_COLLECTION_ID } from '$env/static/public'

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
    const { session}  = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const feedTimestampEnd = new Date()
    const feedTimestampStart = add(feedTimestampEnd, {days: -300})

    const spotlightCollectionId = PUBLIC_SPOTLIGHT_COLLECTION_ID
    const selectSpotlight = await selectSpotlightCollections(spotlightCollectionId, 6) 
    const spotlightCollections = selectSpotlight.collections
    spotlightCollections.length = 6
    for ( const collection of spotlightCollections ) {
        if ( collection.description.length > 100 ) {
            let splitPosition = collection.description.indexOf(' ', 100)
            let splitString = collection.description.substring(0, splitPosition)
            splitString = splitString.concat('...')
            collection.description = splitString
        }
    }

    const selectRecentCollections = await selectRecentOpenPublicCollections(10, 0)
    const recentCollections = selectRecentCollections.collections

    const selectCollectionsFeed = await selectFeedData(sessionUserId, 10, 0, feedTimestampStart, feedTimestampEnd, {'items': [ 'collection_follow', 'collection_edit']} )
    const collectionsFeed = selectCollectionsFeed

    const selectUsersCollections = await selectFollowedUsersOpenPublicCollections(sessionUserId, 10, 0)

    const followingUsersCollections = selectUsersCollections.collections

   return { sessionUserId, spotlightCollectionId, spotlightCollections, recentCollections, collectionsFeed, followingUsersCollections }
}
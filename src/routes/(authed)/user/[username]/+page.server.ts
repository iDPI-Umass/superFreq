import type { PageServerLoad, Actions } from './$types'
import { selectProfilePageData, insertUpdateBlock, insertUserFlag, insertUpdateUserFollow } from '$lib/resources/backend-calls/users'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { selectUserPostsSample } from '$lib/resources/backend-calls/posts'
import { add } from 'date-fns'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession }}) => {

    const session = await safeGetSession()
    const sessionUserId = session?.user?.id as string

    const profileUsername = params.username

    const batchSize = 10
    const batchIterator = 0
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    const profileData = await selectProfilePageData( sessionUserId, profileUsername )
    const feedItems = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)
    const selectPosts = await selectUserPostsSample( sessionUserId, profileUsername, batchSize )

    const posts = selectPosts?.posts as App.RowData[]

    return { sessionUserId, profileData, feedItems, profileUsername, posts }
}

export const actions = { 
    blockUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const block = await insertUpdateBlock( sessionUserId, profileUserId )

        const blockStatus = block?.active

        if ( block ) {
            return { block, blockStatus, success: true}
        }
        return { block, blockStatus, success: false }
    },
    reportUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const flag = await insertUserFlag( sessionUserId, profileUserId )

        const flagStatus = flag?.active

        if ( flag ) {
            return { flag, flagStatus, success: true }
        }

        return { flag, flagStatus, success: false }
    },
    followUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        console.log(sessionUserId)
        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const follow = await insertUpdateUserFollow( sessionUserId, profileUserId )

        const followStatus = follow?.follows_now
        return { follow, followStatus }
    }
} satisfies Actions
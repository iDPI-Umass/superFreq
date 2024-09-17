import type { PageServerLoad, Actions, Posts } from './$types'
import { redirect } from '@sveltejs/kit'
import { selectProfilePageData, insertUpdateBlock, insertUserFlag, insertUpdateUserFollow, insertPostFlag } from '$lib/resources/backend-calls/users'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { selectUserPostsSample, insertPost, insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { getListenUrlData } from '$lib/resources/parseData'
import { add, parseISO } from 'date-fns'

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

    if (!profileData.profileUserData) {
        throw redirect(303, '/')
    }

    const feedItems = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)
    const selectPosts = await selectUserPostsSample( sessionUserId, profileUsername, batchSize )

    const posts = selectPosts

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

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const follow = await insertUpdateUserFollow( sessionUserId, profileUserId )

        const followStatus = follow?.follows_now
        return { follow, followStatus }
    },
    parseListenUrl: async ({ request }) => {
        const data = await request.formData()
        const listenUrlString = data.get('listen-url') as string

        const embedInfo = await getListenUrlData(listenUrlString)

        return { embedInfo, success: true }
    },
	postAlbum: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
		const listenUrl = data.get('listen-url') as string
        const mbid = data.get('mbid') as string
        const mbidType = data.get('item-type') as string
        const artistName = data.get('artist-name') as string
        const albumName = data.get('album-name') as string
        const postText = data.get('post-text') as string

        const embedInfo = await getListenUrlData(listenUrl)

        const postData: Posts = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            item_type: mbidType,
            mbid: mbid,
            artist_name: artistName,
            release_group_name: albumName,
            text: postText,
            created_at: timestampISO,
            updated_at: timestampISO,
            embed_id: embedInfo.id,
            embed_source: embedInfo.source,
            embed_account: embedInfo.account
        }

        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else {
            redirect(303, `/posts/${username}/now-playing/${timestampSlug}`)
        }
	},
    postTrack: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

		const data = await request.formData()
        const listenUrl = data.get('listen-url') as string
        const mbid = data.get('mbid') as string
        const itemType = data.get('item-type') as string
        const artistName = data.get('artist-name') as string
        const albumName = data.get('album-name') as string
        const recordingName = data.get('track-name') as string
        const postText = data.get('post-text') as string

        const embedInfo = await getListenUrlData(listenUrl)

        const postData: Posts = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            item_type: itemType,
            mbid: mbid,
            artist_name: artistName,
            release_group_name: albumName,
            recording_name: recordingName,
            text: postText,
            created_at: timestampISO,
            updated_at: timestampISO,
            embed_id: embedInfo.id,
            embed_source: embedInfo.source,
            embed_account: embedInfo.account
        }

        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else{
            redirect(303, `/posts/${username}/now-playing/${timestampSlug}`)
        }
	},
    postMix: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

		const data = await request.formData()
        const listenUrl = data.get('listen-url') as string
        const mbid = data.get('mbid') as string
        const itemType = data.get('item-type') as string
        const artistName = data.get('artist-name') as string
        const episode = data.get('episode') as string
        const show = data.get('show') as string
        const postText = data.get('post-text') as string

        const embedInfo = await getListenUrlData(listenUrl)

        const postData: Posts = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            item_type: itemType,
            mbid: mbid,
            artist_name: artistName,
            episode_title: episode,
            show_title: show,
            text: postText,
            created_at: timestampISO,
            updated_at: timestampISO,
            embed_id: embedInfo.id,
            embed_source: embedInfo.source,
            embed_account: embedInfo.account
        }

        console.log(postData)
        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else{
            redirect(303, `/posts/${username}/now-playing/${timestampSlug}`)
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

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

        return reaction
    }
} satisfies Actions
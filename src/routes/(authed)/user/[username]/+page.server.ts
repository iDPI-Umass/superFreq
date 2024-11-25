import type { PageServerLoad, Actions, Posts } from './$types'
import { redirect } from '@sveltejs/kit'
import { selectProfilePageData, insertUpdateBlock, insertUserFlag, insertUpdateUserFollow, insertPostFlag } from '$lib/resources/backend-calls/users'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { selectUserPostsSample, insertPost, insertUpdateReaction } from '$lib/resources/backend-calls/posts'
import { getListenUrlData } from '$lib/resources/parseData'
import { add, parseISO } from 'date-fns'

let loadData = true
let userAction = false
let updateReaction = false

let profileData: any = null
let feedItems: any = null

let nowPlayingPostId: string
let updatedReactionActive: boolean
let updatedReactionCount: number


export const load: PageServerLoad = async ({ params, locals: { safeGetSession }}) => {

    const session = await safeGetSession()
    const sessionUserId = session?.user?.id as string

    const profileUsername = params.username
    
    const batchSize = 10
    const batchIterator = 0
    const feedItemCount = 0
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

    if ( loadData ) {
        profileData = await selectProfilePageData( sessionUserId, profileUsername )

        if (!profileData.profileUserData) {
            throw redirect(303, '/')
        }
        else if ( sessionUserId == profileData.profileUserData.id) {
            const { feedData } = await selectFeedData( sessionUserId, batchSize, batchIterator, feedItemCount, timestampStart, timestampEnd, options)

            feedItems = feedData
        }
        else if ( sessionUserId != profileData.profileUserData.id ) {
            const selectPosts = await selectUserPostsSample( sessionUserId, profileUsername, batchSize )
    
            const { posts } = selectPosts as App.NestedObject
            feedItems = posts
        }
    }
    
    if ( userAction ) {
        profileData = await selectProfilePageData( sessionUserId, profileUsername )

        userAction = false
        loadData = true
    }

    if ( updateReaction ) {
        const reaction = feedItems.find((item) => (item.now_playing_post_id == nowPlayingPostId)) as App.RowData

        reaction.reaction_active = updatedReactionActive
        reaction.reaction_count = updatedReactionCount

        updateReaction = false
        loadData = true
    }

    return { sessionUserId, profileData, feedItems, profileUsername }
}

export const actions = { 
    blockUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const block = await insertUpdateBlock( sessionUserId, profileUserId )

        const userActionSuccess = block ? true : false

        userAction = userActionSuccess ? true : false
        loadData = userActionSuccess? false : true

        return { userActionSuccess }
    },
    reportUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const flag = await insertUserFlag( sessionUserId, profileUserId )

        const userActionSuccess = flag ? true : false

        userAction = userActionSuccess ? true : false
        loadData = userActionSuccess ? false : true

        return { userActionSuccess }
    },
    followUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const follow = await insertUpdateUserFollow( sessionUserId, profileUserId )

        const userActionSuccess = follow ? true : false

        userAction = userActionSuccess ? true : false
        loadData = userActionSuccess ? false : true

        return { userActionSuccess }
    },
    parseListenUrl: async ({ request }) => {
        const data = await request.formData()
        const listenUrlString = data.get('listen-url') as string

        const embedInfo = await getListenUrlData(listenUrlString)

        return { embedInfo, success: true }
    },
	post:async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const itemType = data.get('item-type') as string
		const listenUrl = data.get('listen-url') as string
        const artistMbid = data.get('artist-mbid') as string
        const artistName = data.get('artist-name') as string
        const releaseGroupMbid = data.get('release-group-mbid') as string
        const releaseGroupName = data.get('release-group-name') as string
        const recordingMbid = data.get('recordiing-mbid') as string
        const recordingName = data.get('recording-name') as string
        const remixerArtistMbid = data.get('remixer-artist-mbid') as string
        const releaseDate = data.get('release-date') as string
        const label = data.get('label') as string
        const imgUrl = data.get('img-url') as string
        const lastFmImgUrl = data.get('last-fm-img-url') as string
        const episodeName = data.get('episode') as string
        const showName = data.get('show') as string
        const postText = data.get('post-text') as string

        const embedInfo = listenUrl ? await getListenUrlData(listenUrl) : null

        const postData = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl ?? null,
            item_type: itemType,
            artist_mbid: artistMbid ?? null,
            release_group_mbid: releaseGroupMbid ?? null,
            recording_mbid: recordingMbid ?? null,
            artist_name: artistName ?? null,
            release_group_name: releaseGroupName ?? null,
            recording_name: recordingName ?? null,
            remixer_artist_mbid: remixerArtistMbid ?? null,
            release_date: releaseDate ?? null,
            label: label ?? null,
            img_url: imgUrl ?? null,
            last_fm_img_url: lastFmImgUrl ?? null,
            episode_title: episodeName ?? null,
            show_title: showName ?? null,
            text: postText ?? null,
            created_at: timestampISO,
            updated_at: timestampISO,
            embed_id: embedInfo?.id ?? null,
            embed_source: embedInfo?.source ?? null,
            embed_account: embedInfo?.account ?? null
        } as App.RowData

        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()
        const timestamp = Date.parse(timestampSlug).toString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else {
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
        }
    },
    flagPost: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const userActionSuccess = flag ? true : false

        return { userActionSuccess }
    },
    submitReaction: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string
        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const reaction = await insertUpdateReaction( sessionUserId, postId, reactionType )

        const userActionSuccess = reaction ? true : false

        updateReaction = userActionSuccess ? true : false
        loadData = userActionSuccess ? false : true

        return { userActionSuccess }
    }
} satisfies Actions
import type { PageServerLoad, Actions, Posts } from './$types'
import { redirect } from '@sveltejs/kit'
import { selectProfilePageData, insertUpdateBlock, insertUserFlag, insertUpdateUserFollow, insertPostFlag } from '$lib/resources/backend-calls/users'
import { selectFeedData } from '$lib/resources/backend-calls/feed'
import { selectUserPostsSample, insertPost, insertUpdateReaction, updatePost, deletePost } from '$lib/resources/backend-calls/posts'
import { selectListSessionUserCollections, saveItemToCollection } from 'src/lib/resources/backend-calls/collections'
import { getListenUrlData, validStringCheck } from '$lib/resources/parseData'
import { add, parseISO } from 'date-fns'
import { metadata } from '$lib/assets/text/updates.md'
import { feedData } from 'src/lib/resources/states.svelte'

let profileUsername = null as string | null
let profileUserId = null as string | null

let loadData = true
let userAction = false

let batchIterator = 0
let feedItemCount = 0
let totalAvailableItems = 0
let remaining = 0

let sessionUserCollections = [] as App.RowData[]

export const load: PageServerLoad = async ({ params, locals: { safeGetSession }}) => {

    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const urlUsername = params.username
    
    const batchSize = 10
    const timestampEnd = new Date()
    const timestampStart = add(timestampEnd, {days: -300})
    const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}
    const updatesPageUpdatedAt = metadata.updated as string

    if ( urlUsername != profileUsername ) {
        loadData = true
    }

    let profileData = await selectProfilePageData( sessionUserId, urlUsername )

    if (!profileData.profileUserData) {
        throw redirect(303, '/')
    }

    profileUsername = profileData.profileUserData.username as string

    if ( profileUserId != profileData.profileUserData.id ) {
        feedData.feedItems = []
    }

    feedData.profileUsername =  profileUsername

    profileUserId = profileData.profileUserData.id as string
    feedData.profileUserId = profileUserId

    // if profile is session user's, load feed data
    if ( sessionUserId == profileUserId ) {
        feedData.feedItems.length = batchIterator * batchSize

        const select = await selectFeedData( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)

        const totalRowCount = select.totalRowCount
        const selectedFeedData = select.feedData
        feedData.feedItems.push(...selectedFeedData)
        feedItemCount = feedData.feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = totalRowCount - feedItemCount
    }
    // if profile is another user's, load their posts
    else if ( sessionUserId != profileUserId ) {
        feedData.feedItems.length = batchIterator * batchSize

        const select = await selectUserPostsSample( sessionUserId, profileUsername, batchSize, batchIterator)
        const totalRowCount = select.totalRowCount
        const selectedFeedData = select.feedData

        feedData.feedItems.push(...selectedFeedData)
        feedItemCount = feedData.feedItems.length

        totalAvailableItems = totalRowCount as number
        remaining = totalRowCount - feedItemCount
    }
    
    if ( userAction ) {
        userAction = false
        loadData = true

        profileData = await selectProfilePageData( sessionUserId, profileUsername )
    }

    return { sessionUserId, profileData, feedItems: feedData.feedItems, totalAvailableItems, remaining, profileUsername, sessionUserCollections, updatesPageUpdatedAt }
}

export const actions = { 
    loadMore: async() => {
        batchIterator ++
        loadData = true
        return { loadData }
    },
    blockUser: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const block = await insertUpdateBlock( sessionUserId, profileUserId )

        const userActionSuccess = block ? true : false

        userAction = userActionSuccess ? true : false
        loadData = userActionSuccess? false : true

        return { userActionSuccess }
    },
    reportUser: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const flag = await insertUserFlag( sessionUserId, profileUserId )

        const userActionSuccess = flag ? true : false

        userAction = userActionSuccess ? true : false
        loadData = userActionSuccess ? false : true

        return { userActionSuccess }
    },
    followUser: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

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
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const itemType = data.get('item-type') as string
		const listenUrl = data.get('listen-url') as string
        const artistMbid = data.get('artist-mbid') as string
        const artistName = data.get('artist-name') as string
        const releaseGroupMbid = data.get('release-group-mbid') as string
        const releaseGroupName = data.get('release-group-name') as string
        const recordingMbid = data.get('recording-mbid') as string
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
            listen_url: validStringCheck(listenUrl),
            item_type: validStringCheck(itemType),
            artist_mbid: validStringCheck(artistMbid),
            release_group_mbid: validStringCheck(releaseGroupMbid),
            recording_mbid: validStringCheck(recordingMbid),
            artist_name: validStringCheck(artistName),
            release_group_name: validStringCheck(releaseGroupName),
            recording_name: validStringCheck(recordingName),
            remixer_artist_mbid: validStringCheck(remixerArtistMbid),
            release_date: validStringCheck(releaseDate),
            label: validStringCheck(label),
            img_url: validStringCheck(imgUrl),
            last_fm_img_url: validStringCheck(lastFmImgUrl),
            episode_title: validStringCheck(episodeName),
            show_title: validStringCheck(showName),
            text: validStringCheck(postText),
            created_at: timestampISO,
            updated_at: timestampISO,
            embed_id: embedInfo?.id ?? null,
            embed_source: embedInfo?.source ?? null,
            embed_account: embedInfo?.account ?? null
        } as App.RowData

        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()
        const timestamp = Date.parse(timestampSlug).toString()

        loadData = true
        if ( !timestampSlug ) {
            return { success: false }
        }
        else {
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
        }
    },
    flagPost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const flag = await insertPostFlag( sessionUserId, postId )

        const userActionSuccess = flag ? true : false

        return { userActionSuccess }
    },
    editPost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        let editedText = data.get('edited-text') as string
        const postData = JSON.parse(data.get('post-data') as string) as App.RowData

        const submitEdit = await updatePost( sessionUserId, postData, editedText )

        const success =  submitEdit ? true : false
        const editState = submitEdit ? false : true

        editedText = success ? submitEdit.text as string : editedText
        editPost = success ? true : false
        loadData = success ? false : true

        return { success, editState }
    },
    deletePost: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string

        const submitDelete = await deletePost( sessionUserId, postId )

        const success = submitDelete ? true : false

        return { success }
    },
    submitReaction: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string
        const reactionType = data.get('reaction-type') as string

        const { reaction } = await insertUpdateReaction( sessionUserId, postId, reactionType )

        const userActionSuccess = reaction ? true : false

        return { userActionSuccess }
    },
    getCollectionList: async ({ locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        sessionUserCollections = await selectListSessionUserCollections(sessionUserId)
        
        return { showCollectionsModal: true }
    },
    saveToCollection: async ({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const postId = data.get('post-id') as string
        const collectionId = data.get('collection-id') as string

        const update = await saveItemToCollection( sessionUserId, postId, collectionId )

        return { updateSuccess: update }
    }
} satisfies Actions
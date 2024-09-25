import { redirect } from '@sveltejs/kit';
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions, Posts } from './$types'
import { insertPost } from '$lib/resources/backend-calls/posts'
import { getListenUrlData } from '$lib/resources/parseData'

export const load: PageServerLoad = async ({ parent, locals: { safeGetSession}}) => {
    const session = await safeGetSession()

    const { profile } = await parent()

    const username = profile?.username ?? null

    if ( !session.session ) {
        throw redirect(307, '/')
    }
    else if( session.session && !username ) {
        throw redirect(307, '/account/create-profile')
    }
}

export const actions = {
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
        const timestamp = Date.parse(timestampSlug).toString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else {
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
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
        const timestamp = Date.parse(timestampSlug).toString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else{
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
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

        const { username, createdAt } = await insertPost( postData )
        const timestampSlug = createdAt?.toISOString()
        const timestamp = Date.parse(timestampSlug).toString()

        if ( !timestampSlug ) {
            return { success: false }
        }
        else{
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
        }
	},
} satisfies Actions
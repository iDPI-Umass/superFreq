import { redirect } from '@sveltejs/kit';
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions, Posts } from './$types'
import { insertPost } from '$lib/resources/backend-calls/posts'

export const actions = {
	postAlbum: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

        const data = await request.formData()
        const username = data.get('username')
		const listenUrl = data.get('listen-url')
        const mbid = data.get('mbid')
        const mbidType = data.get('item-type')
        const artistName = data.get('artist-name')
        const albumName = data.get('album-name')
        const postText = data.get('post-text')

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
        }

        const newPost = await insertPost( postData )
        const createdAt = newPost?.created_at ?? null
        const timestampSlug = createdAt?.valueOf().toString()

        if ( !timestampSlug ) {
            return { sucess: false }
        }
        else {
            redirect(303, `/user/${username}/now-playing/${timestampSlug}`)
        }
	},
    postTrack: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

		const data = await request.formData()
        const username = data.get('username')
        const listenUrl = data.get('listen-url')
        const mbid = data.get('mbid')
        const itemType = data.get('item-type')
        const artistName = data.get('artist-name')
        const albumName = data.get('album-name')
        const recordingName = data.get('track-name')
        const postText = data.get('post-text')

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
        }

        const newPost = await insertPost( postData )
        const createdAt = newPost?.created_at ?? null
        const timestampSlug = createdAt?.valueOf().toString()

        if ( !timestampSlug ) {
            return { sucess: false }
        }
        else{
            redirect(303, `/user/${username}/now-playing/${timestampSlug}`)
        }
	},
    postMix: async ({ request, locals: { safeGetSession } }) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id

        const timestampISOString: string = new Date().toISOString()
        const timestampISO: Date = parseISO(timestampISOString)

		const data = await request.formData()
        const username = data.get('username')
        const listenUrl = data.get('listen-url')
        const mbid = data.get('mbid')
        const itemType = data.get('item-type')
        const artistName = data.get('artist-name')
        const episode = data.get('episode')
        const show = data.get('show')
        const postText = data.get('post-text')

        const postData: Posts = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            item_type: itemType,
            mbid: mbid,
            artist_name: artistName,
            episode_title: episode,
            show_name: show,
            text: postText,
            created_at: timestampISO,
            updated_at: timestampISO,
        }

        const newPost = await insertPost( postData )
        const createdAt = newPost?.created_at ?? null
        const timestampSlug = createdAt?.valueOf().toString()

        if ( !timestampSlug ) {
            return { sucess: false }
        }
        else{
            redirect(303, `/user/${username}/now-playing/${timestampSlug}`)
        }
	},
} satisfies Actions
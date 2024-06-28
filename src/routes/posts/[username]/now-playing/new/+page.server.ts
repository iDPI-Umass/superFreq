import { redirect } from '@sveltejs/kit';
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions, Posts } from './$types'
import { sql } from 'kysely'
import { timestampISO } from '$lib/resources/parseData'
import { insertPost } from '$lib/resources/backend-calls/posts'

// export const load: PageServerLoad = async ({ locals: { session } }) => {
// 	const user = await db.getUserFromSession(cookies.get('sessionid'));
// 	return { user };
// };

export const actions = {
	postAlbum: async ({ request, params, locals: { session } }) => {
        const userId = session?.user.id
        const data = await request.formData()
		const listenUrl = data.get('listenUrl')
        const mbid = data.get('mbid')
        const mbidType = data.get('mbidType')
        const artistName = data.get('artistName')
        const albumName = data.get('albumName')
        const postText = data.get('postText')

        const postData: Posts = {
            user_id: userId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            mbid_type: mbidType,
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
        else{
            redirect(303, `/user/${params.username}/now-playing/${timestampSlug}`)
        }
	},
    postTrack: async ({ request, params, locals: { session } }) => {
        const userId = session?.user.id
		const data = await request.formData()
        const listenUrl = data.get('listenUrl')
        const mbid = data.get('mbid')
        const mbidType = data.get('mbidType')
        const artistName = data.get('artistName')
        const albumName = data.get('albumName')
        const recordingName = data.get('trackName')
        const postText = data.get('postText')

        const postData: Posts = {
            user_id: userId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            mbid_type: mbidType,
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
            redirect(303, `/user/${params.username}/now-playing/${timestampSlug}`)
        }
	},
    postMix: async ({ request,, params, locals: { session } }) => {
        const userId = session?.user.id
		const data = await request.formData()
        const listenUrl = data.get('listenUrl')
        const mbid = data.get('mbid')
        const mbidType = data.get('mbidType')
        const artistName = data.get('artistName')
        const episode = data.get('episode')
        const show = data.get('show')
        const postText = data.get('postText')

        const postData: Posts = {
            user_id: userId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl,
            mbid_type: mbidType,
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
            redirect(303, `/user/${params.username}/now-playing/${timestampSlug}`)
        }
	},
} satisfies Actions;
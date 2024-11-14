import { redirect } from '@sveltejs/kit';
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
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
        const episodeName = data.get('episode') as string
        const showName = data.get('show') as string
        const postText = data.get('post-text') as string

        const mbid = {
            'release_group': releaseGroupMbid,
            'recording': recordingMbid,
            'episode': artistMbid
        } as App.StringLookupObject

        const embedInfo = listenUrl ? await getListenUrlData(listenUrl) : null

        const postData = {
            user_id: sessionUserId,
            type: "now_playing",
            status: "new",
            listen_url: listenUrl ?? null,
            item_type: itemType,
            mbid: mbid[itemType] ?? null,
            artist_name: artistName ?? null,
            release_group_name: releaseGroupName ?? null,
            recording_name: recordingName ?? null,
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
} satisfies Actions
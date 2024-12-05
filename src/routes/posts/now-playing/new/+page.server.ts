import { redirect } from '@sveltejs/kit';
import { parseISO } from "date-fns"
import type { PageServerLoad, Actions } from './$types'
import { insertPost } from '$lib/resources/backend-calls/posts'
import { getListenUrlData, validStringCheck } from '$lib/resources/parseData'

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

        if ( !timestampSlug ) {
            return { success: false }
        }
        else {
            redirect(303, `/posts/${username}/now-playing/${timestamp}`)
        }
    },
} satisfies Actions
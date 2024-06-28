import type { PageServerLoad } from './$types';
import { selectPost } from '$lib/resources/backend-calls/posts'

const username = 'sug_umass'
const timestamp = '2024-06-18T20:28:03.836Z'
const JSDate = new Date('2024-06-18 15:22:30.095694+00')
const postGresDate = '2024-06-18 15:22:30.095694+00'
const postType = "now_playing"

export const load: PageServerLoad = async () => {

    const now = Date.now()
    const nowISOString = new Date(now).toISOString()
    const timestampString = nowISOString

    const nowPlayingPost = await selectPost({ username, timestampString, postType })
}
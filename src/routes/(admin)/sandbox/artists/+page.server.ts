import type { Actions } from './$types'
import { db } from 'src/database.ts'

// import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
// import { add } from 'date-fns'


export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    async function getData() {
        const url = "http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=aliases"
        try {
            const response = await fetch(url);
            console.log('trying')
            console.log(response)
            if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
            }

            const json = await response.json();
            return {json}
        } catch (error) {
            console.error(error.message);
            return {json: null}
        }
    }

    const tch = await getData()

    console.log(tch)
    return { tch }
}

export const actions = {
    applyOptions: async({ request }) => {
        const data = await request.formData()
        const selected = data.getAll('selected-options')

    },
    saveDefaults: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id

        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    }
} satisfies Actions
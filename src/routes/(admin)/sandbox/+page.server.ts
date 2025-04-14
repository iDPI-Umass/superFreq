import type { Actions } from './$types'
import { db } from 'src/database.ts'

// import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
// import { add } from 'date-fns'


export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const select = await db
    .selectFrom('feed_items')
    .selectAll()
    .where('target_user_id', '=', sessionUserId)
    .execute()

    return { sessionUserId }
}

export const actions = {
    applyOptions: async({ request }) => {
        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    },
    saveDefaults: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id

        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    }
} satisfies Actions
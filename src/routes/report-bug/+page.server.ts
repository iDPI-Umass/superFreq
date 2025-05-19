import type { PageServerLoad, Actions } from './$types'
import { reportBug } from '$lib/resources/backend-calls/moderation.ts'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()

    const userSession = session ? true : false
    
    return { userSession }
}

export const actions = {
    submit: async ({ request, locals: { safeGetSession }}) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id

        const data = await request.formData()
        const type = data.get('bug-type') as string
        const path = data.get('bug-path') as string
        const description = data.get('bug-description') as string

        const bugData = {
            'type': type,
            'path': path,
            'description': description
        } as App.RowData

        const submit = await reportBug( sessionUserId, bugData )

        const success = submit.reportId ? true : false

        return { success }
    }
} satisfies Actions
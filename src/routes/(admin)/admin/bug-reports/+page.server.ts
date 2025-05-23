import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { getBugReports, updateBugReport } from '$lib/resources/backend-calls/moderation'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const { reports, permission } = await getBugReports(sessionUserId)

    if ( permission ) {
        return { reports }
    }
    else {
        redirect(303, '/')
    }
}

export const actions = {
    update: async ({ request, locals: { safeGetSession }}) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id as string

        const data = await request.formData()
        const itemId = data.get('item-id') as string
        const notes = data.get('notes') as string
        const resolved = data.get('resolved') as string

        const reportResolved = ( resolved == 'on' ) ? true : false

        const bugReportUpdate = {
            'id': itemId,
            'notes': notes,
            'resolved': reportResolved
        }

        const { success } = await updateBugReport( sessionUserId, bugReportUpdate )

        return { success }
    }
} satisfies Actions
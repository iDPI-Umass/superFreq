import type { PageServerLoad } from './$types'
import { redirect } from '@sveltejs/kit'
import { selectAllUsers } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()

    if (!session.session) {
        throw redirect(303, '/')
    }

    const sessionUserId = session.user?.id as string
    
    const selectUsers = selectAllUsers( sessionUserId )
    const users = await selectUsers

    return { users }

}

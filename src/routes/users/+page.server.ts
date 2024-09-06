import type { PageServerLoad } from './$types'
import { selectAllUsers } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string
    
    const selectUsers = selectAllUsers( sessionUserId )
    const users = await selectUsers

    return { users }

}

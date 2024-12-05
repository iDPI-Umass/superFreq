import type { PageServerLoad } from './$types'
import { selectAllUsers } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async () => {
    const selectUsers = selectAllUsers( )
    const users = await selectUsers

    return { users }
}

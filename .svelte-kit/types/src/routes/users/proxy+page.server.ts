// @ts-nocheck
import type { PageServerLoad } from './$types'
import { selectAllUsers } from '$lib/resources/backend-calls/users'

export const load = async () => {
    const selectUsers = selectAllUsers( )
    const users = await selectUsers

    return { users }
}
;null as any as PageServerLoad;
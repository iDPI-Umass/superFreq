import type { Actions } from './$types'
import { inviteRequest } from '$lib/resources/backend-calls/users.ts'

export const actions = {
    invite: async ({ request }) => {

        const formData = await request.formData()
        const email = formData.get('email') as string
        const referredBy = formData.get('referred-by') as string

        const invite = await inviteRequest( email, referredBy )

        if ( invite ) {
            const { approved, user_id } = invite
            return { success: true, approved, user_id }
        }
        else {
            return { success: false, approved: false, user_id: null }
        }
        
    }
} satisfies Actions
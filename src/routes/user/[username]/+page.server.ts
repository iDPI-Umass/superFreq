import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { selectProfilePageData, insertUpdateBlock, insertUserFlag, insertUpdateUserFollow } from '$lib/resources/backend-calls/users'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession }}) => {

    const session = await safeGetSession()

    if (!session.session) {
        throw redirect(303, '/')
    }

    const sessionUserId = session?.user?.id as string

    const profileUsername = params.username

    const profileData = await selectProfilePageData( sessionUserId, profileUsername )

    return { sessionUserId, profileData }
}

export const actions = { 
    blockUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const block = await insertUpdateBlock( profileUserId, sessionUserId )
        
        return block
    },
    reportUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const flag = await insertUserFlag( profileUserId, sessionUserId )

        return flag
    },
    followUser: async({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session?.user?.id as string

        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string

        const follow = await insertUpdateUserFollow( profileUserId, sessionUserId )

        return follow
    }
} satisfies Actions
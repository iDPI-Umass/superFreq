import type { PageServerLoad, Actions } from "../$types"
import { profileStoresObject } from "$lib/stores"
import { newSessionProfile } from "$lib/resources/backend-calls/users"

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const session = await safeGetSession()
    const email =  session.user?.email as string

    return { email }
}

export const actions = {
    create: async ({ request, locals: { safeGetSession }}) => {
        const session = await safeGetSession()
        const sessionUserId = session.user?.id as string

        const formData = await request.formData()
        const username = formData.get('username') as string
        const displayName = formData.get('display-name') as string
        const about = formData.get('about') as string
        const website = formData.get('website') as string
        const avatarUrl = formData.get('avatar-url') as string
        const avatarMbid = formData.get('avatar-mbid') as string

        const profileData = {
            'username': username,
            'display_name': displayName,
            'website': website,
            'avatar_url': avatarUrl,
            'avatar_mbid': avatarMbid,
            'about': about,
        }

        
        const update = await newSessionProfile( sessionUserId, profileData )

        profileStoresObject.set({
            'username': username,
            'display_name': displayName,
            'avatar_url': avatarUrl,
            'website': website
          })


        const success = update.success as boolean

        return { success }
    }
} satisfies Actions
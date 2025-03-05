// @ts-nocheck
import type { PageServerLoad, Actions } from "../(authed)/account/$types"
import { newSessionProfile } from "$lib/resources/backend-calls/users"
import wave from "$lib/assets/images/logo/freq-wave.svg"

let sessionUserId: string
let email: string

export const load = async ({ locals: { safeGetSession }}: Parameters<PageServerLoad>[0]) => {
    const { session } = await safeGetSession()
    sessionUserId = session?.user.id as string
    email =  session?.user.email as string

    return { email }
}

export const actions = {
    create: async ({ request }) => {
        const formData = await request.formData()
        const username = formData.get('username') as string
        const displayName = formData.get('display-name') as string
        const about = formData.get('about') as string
        const website = formData.get('website') as string
        const avatarItem = JSON.parse(formData.get('avatarItem') as string)
        const avatarUrl = formData.get('avatarUrl')
        const avatarMbid = formData.get('avatarMbid')

        const profileData = {
            'username': username,
            'display_name': displayName ?? username,
            'website': website,
            'avatar_url': avatarUrl ?? null,
            'avatar_mbid': avatarMbid ?? null,
            'about': about,
        }

        const update = await newSessionProfile( sessionUserId, profileData, email, avatarItem )

        const success = update.success as boolean

        return { success }
    }
} satisfies Actions
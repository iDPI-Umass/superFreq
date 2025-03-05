// @ts-nocheck
import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { checkLoginPermission } from '$lib/resources/backend-calls/users'

export const load = async ({ locals: { safeGetSession }}: Parameters<PageServerLoad>[0]) => {
    const { session } = await safeGetSession()

    if ( session ) {
        throw redirect(303, '/')
    }
}

export const actions = { 
    sendMagicLink: async({ request, locals: { supabase }}) => {

        const data = await request.formData()
        const email = data.get('email') as string

        const permission = await checkLoginPermission( email )

        let authResponse

        if ( permission ) {
            authResponse = await supabase.auth.signInWithOtp({ email: email })
        }
        else {
            return {
                permission: false,
                success: false,
                showModal: true
            }
        }

        if ( authResponse.error ) {
            return { 
                permission: true,
                success: false,
                showModal: true
            }
        }
        else {
            return { 
                permission: true,
                success: true,
                showModal: true
            }
        }
    }
} satisfies Actions
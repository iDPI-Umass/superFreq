import type { PageServerLoad, Actions } from './$types'
import { redirect } from '@sveltejs/kit'
import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({ locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()

    if ( session ) {
        throw redirect(303, '/feed')
    }
}

export const actions = { 
    sendMagicLink: async({ request, locals: { supabase }}) => {

        const data = await request.formData()
        const email = data.get('email') as string

        const permission = await db
        .selectFrom('approved_users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()

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
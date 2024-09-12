import { redirect } from "@sveltejs/kit"

export async function load ({ parent, locals: { safeGetSession }}) {
    const { session } = await safeGetSession()

    const { profile } = await parent()

    const username = profile?.username ?? null

    if ( !session ) {
        throw redirect(307, '/')
    }
    else if( session && !username ) {
        throw redirect(307, '/account/create-profile')
    }
}
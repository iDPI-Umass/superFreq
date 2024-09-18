import { redirect } from "@sveltejs/kit"

export async function load ({ parent }) {

    const { profile, session } = await parent()

    const username = profile?.username ?? null

    if ( !session ) {
        throw redirect(307, '/')
    }
    else if( session && !username ) {
        throw redirect(307, '/account/create-profile')
    }
}
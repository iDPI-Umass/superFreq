import { redirect } from "@sveltejs/kit"

export async function load ({ locals: { safeGetSession }}) {
    const { session } = await safeGetSession()

    console.log(session)
    if ( !session ) {
        throw redirect(307, '/')
    }
}
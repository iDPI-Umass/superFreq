// @ts-nocheck
import { moderatorPermissions } from "$lib/resources/backend-calls/moderation"
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "../$types"

export const load = async ({ locals: { safeGetSession }}: Parameters<PageServerLoad>[0]) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    const { permission } = await moderatorPermissions( sessionUserId, 'site_admin' )
    
    if ( !permission ) {
        throw redirect( 303, '/')
    }
}
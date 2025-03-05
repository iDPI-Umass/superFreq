// @ts-nocheck
import type { PageServerLoad } from "./$types"

export const load = async ({ url }: Parameters<PageServerLoad>[0]) => { 
    const redirectFromParam = url.searchParams.get('redirectFrom')
    return { redirectFromParam }
}
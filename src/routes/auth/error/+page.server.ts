import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ url }) => { 
    const redirectFromParam = url.searchParams.get('redirectFrom')
    return { redirectFromParam }
}
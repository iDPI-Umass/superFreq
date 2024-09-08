import { selectListProfileUserViewableCollections } from "$lib/resources/backend-calls/collections"
import type { PageServerLoad } from "./$types"

export const load: PageServerLoad = async ({ params }) => {
    const username = params.username
    
    const collections = await selectListProfileUserViewableCollections( username )

    return { collections }
}
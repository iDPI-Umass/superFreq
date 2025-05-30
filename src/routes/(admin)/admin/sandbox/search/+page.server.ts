import type { PageServerLoad, Actions } from "./$types"
import { searchUsersAndCollections } from "$lib/resources/backend-calls/search"

const results = [] as App.RowData[]

export const load: PageServerLoad = async () => {
    return { results }
}

export const actions = {
    searchCollections: async ({ request }) => {
        const data = await request.formData()
        const collectionQuery = data.get('collection-query') as string

        results.length = 0

        const searchResults = await searchUsersAndCollections(collectionQuery)

        results.push(...searchResults.results)

        const success = results.length > 0 ? true : false
        
        return { success }

    }
} satisfies Actions
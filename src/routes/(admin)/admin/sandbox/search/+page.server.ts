import type { PageServerLoad, Actions } from "./$types"
import { searchUsersAndCollections, searchUsers, searchPgUsersCollections } from "src/lib/resources/search"

const results = [] as App.RowData[]

export const load: PageServerLoad = async () => {
    return { results }
}

export const actions = {
    searchCollections: async ({ request }) => {
        const data = await request.formData()
        const collectionQuery = data.get('collection-query') as string

        results.length = 0

        const searchResults = await searchUsersAndCollections(collectionQuery, 25)

        results.push(...searchResults.results)
        
        return { success: true }

    }
} satisfies Actions
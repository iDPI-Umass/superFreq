import type { Actions } from './$types'
import { searchCollections } from '$lib/resources/backend-calls/search.ts'
import { searchResults } from '$lib/resources/states.svelte.ts'


// import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
// import { add } from 'date-fns'

let query: string
let limit: string
let searchCategory: string
let queryType: string
let runSearch = false

export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    let results = [] as App.RowData[]

    if ( runSearch ) {
        const search = await searchCollections(query, queryType, limit)
        results = search.results
        searchResults.results = results
    }

    return { results, searchCategory }
}

export const actions = {
    search: async({ request }) => {
        const data = await request.formData()
        query = data.get('query') as string
        limit = data.get('results-limit') as string
        searchCategory = data.get('search-category')
        queryType = data.get('query-type')
        runSearch = true
        return { success: true }
    },
} satisfies Actions
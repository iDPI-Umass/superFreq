import type { PageServerLoad, Actions } from './$types';
import { searchUsersAndCollections } from 'src/lib/resources/search';

let siteSearchResults = [] as App.RowData[];
let query: string | null;

export const load: PageServerLoad = async ({ url }) => {
	const searchParams = url.searchParams;
	query = searchParams.get('query');

	if (query) {
		const search = await searchUsersAndCollections(query, 10);
		siteSearchResults = search.results;
	}

	return { siteSearchResults, query };
};

export const actions = {
	siteSearch: async ({ request, url }) => {
		const data = await request.formData();
		query = data.get('query') as string;

		return { success: true };
	}
} satisfies Actions;

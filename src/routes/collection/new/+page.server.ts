import { redirect } from '@sveltejs/kit';
import { parseISO } from 'date-fns';
import type { PageServerLoad, Actions } from './$types';
import { insertCollection } from 'src/lib/resources/collections';
import { searchCollections } from 'src/lib/resources/search';

const collectionSearchResults = [] as App.RowData[];

export const load: PageServerLoad = async ({ parent, locals: { safeGetSession } }) => {
	const session = await safeGetSession();

	const { profile } = await parent();

	const username = profile?.username ?? null;

	if (!session.session) {
		throw redirect(307, '/');
	} else if (session.session && !username) {
		throw redirect(307, '/account/create-profile');
	}

	const sessionUserId = session.user?.id;

	return { sessionUserId, collectionSearchResults };
};

export const actions = {
	insertCollection: async ({ request, locals: { safeGetSession } }) => {
		const session = await safeGetSession();
		const sessionUserId = session.user?.id as string;

		const timestampISOString: string = new Date().toISOString();
		const timestampISO: Date = parseISO(timestampISOString);

		const data = await request.formData();
		const collectionTitle = data.get('collection-title');
		const collectionType = data.get('collection-type');
		const sort = data.get('view-sort');
		const collectionStatus = data.get('status');
		const collectionDescription = data.get('description');
		const collectionItemsString = data.get('collection-contents') as string;
		const changelog: App.Changelog = {};

		const collectionItems = JSON.parse(collectionItemsString) as App.RowData[];

		changelog[timestampISOString] = {
			title: collectionTitle,
			status: collectionStatus,
			description_text: collectionDescription,
			updated_by: sessionUserId
		};

		const collectionInfo = {
			title: collectionTitle,
			status: collectionStatus,
			type: collectionType ?? null,
			default_view_sort: sort,
			description_text: collectionDescription,
			created_at: timestampISO,
			updated_at: timestampISO,
			owner_id: sessionUserId,
			updated_by: sessionUserId,
			changelog: changelog
		} as App.RowData;

		const collectionId = await insertCollection(sessionUserId, collectionInfo, collectionItems);

		if (!collectionId) {
			alert('update not successful');
		} else {
			redirect(303, `/collection/${collectionId}`);
		}
	},
	search: async ({ request }) => {
		const data = await request.formData();
		const query = data.get('query') as string;
		const resultsLimit = parseInt(data.get('results-limit') as string);
		const queryType = data.get('query-type') as string;

		collectionSearchResults.length = 0;

		const searchResults = await searchCollections(query, queryType, resultsLimit);

		collectionSearchResults.push(...searchResults.results);
	}
} satisfies Actions;

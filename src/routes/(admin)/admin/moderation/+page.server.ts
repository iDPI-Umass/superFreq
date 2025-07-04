import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { getModerationQueueItems, updateModerationItem } from 'src/lib/resources/moderation';
import { timestampISO, timestampISOString } from '$lib/resources/parseData';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	const sessionUserId = session?.user.id as string;

	const { queueItems, permission } = await getModerationQueueItems(sessionUserId);

	if (permission) {
		return { queueItems };
	} else {
		redirect(401, '/');
	}
};

export const actions = {
	update: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const itemId = data.get('item-id') as string;
		const notes = data.get('notes') as string;
		const type = data.get('item-type') as string;
		const resolved = data.get('resolved') as string;

		const needsReview = resolved == 'on' ? false : true;

		const moderationItem = {
			id: itemId,
			notes: notes,
			needs_review: needsReview,
			moderator_reviewed_at: timestampISO,
			target_item_type: type
		};

		const { success } = await updateModerationItem(sessionUserId, moderationItem);

		return { success };
	}
} satisfies Actions;

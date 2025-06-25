import { moderatorPermissions } from 'src/lib/resources/moderation';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	const sessionUserId = session?.user.id as string;

	const { permission } = await moderatorPermissions(sessionUserId, 'site_admin');

	if (!permission) {
		throw redirect(303, '/');
	}
};

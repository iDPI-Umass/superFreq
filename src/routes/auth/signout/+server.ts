import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { sessionUserProfile } from '$lib/resources/states.svelte';

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { session } = await safeGetSession();
	if (session) {
		await supabase.auth.signOut();
		sessionUserProfile.username = null;
		sessionUserProfile.display_name = null;
		sessionUserProfile.user_id = null;
		redirect(303, '/welcome');
	} else {
		redirect(303, '/welcome');
	}
};

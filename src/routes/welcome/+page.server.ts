import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { checkLoginPermission } from 'src/lib/resources/users';

export const load: PageServerLoad = async ({ locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();

	if (session) {
		throw redirect(303, '/');
	}
};

export const actions = {
	sendMagicLink: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;

		const permission = await checkLoginPermission(email);

		let authResponse;

		if (permission) {
			authResponse = await supabase.auth.signInWithOtp({ email: email });
		} else {
			return {
				permission: false,
				success: false,
				showModal: true
			};
		}

		if (authResponse.error) {
			return {
				permission: true,
				success: false,
				showModal: true
			};
		} else {
			return {
				permission: true,
				success: true,
				showModal: true
			};
		}
	}
} satisfies Actions;

import type { LayoutServerLoad } from './$types';
import { db } from 'src/database.ts';
import { searchUsersAndCollections } from 'src/lib/resources/search';
import wave from '$lib/assets/images/logo/freq-wave.svg';

let siteSearchResults = [] as App.RowData[];

export const load: LayoutServerLoad = async ({ depends, locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();

	if (session) {
		const sessionUserId = session?.user.id as string;
		const selectSessionProfile = await db
			.selectFrom('profiles')
			.leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
			.leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
			.select([
				'profiles.username as username',
				'profiles.display_name as display_name',
				'profiles.website as website',
				'profiles.avatar_url as avatar_url',
				'release_groups.last_fm_img_url as avatar_last_fm_img_url',
				'release_groups.release_group_name as avatar_release_group_name',
				'artists.artist_name as avatar_artist_name'
			])
			.where('profiles.id', '=', sessionUserId)
			.executeTakeFirst();

		const profile = await selectSessionProfile;

		depends('app:avatarImg');
		return { session, sessionUserId, profile, cookies: cookies.getAll() };
	}

	const profile: App.ProfileObject = {
		username: null,
		display_name: null,
		avatar_url: wave,
		avatar_artist_name: null,
		avatar_release_group_name: null,
		website: 'https://freq.social'
	};

	return { session, sessionUserId: null, profile, cookies: cookies.getAll(), siteSearchResults };
};

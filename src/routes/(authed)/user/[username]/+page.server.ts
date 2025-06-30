import type { PageServerLoad, Actions } from '../$types';
import { redirect } from '@sveltejs/kit';
import {
	selectProfilePageData,
	insertUpdateBlock,
	insertUserFlag,
	insertUpdateUserFollow,
	insertPostFlag
} from 'src/lib/resources/users';
import { selectNotificationsFeed, selectFollowingFeed } from 'src/lib/resources/feed';
import {
	selectUserPostsSample,
	insertPost,
	insertUpdateReaction,
	updatePost,
	deletePost
} from 'src/lib/resources/posts';
import {
	selectListSessionUserCollections,
	saveItemToCollection
} from 'src/lib/resources/collections';
import { getListenUrlData, validStringCheck } from '$lib/resources/parseData';
import { add, parseISO } from 'date-fns';
import { metadata } from '$lib/assets/text/updates.md';
import { feedData } from 'src/lib/resources/states.svelte';

let loadData = true;
let userAction = false;

let batchIterator = 0;
let feedItemCount = 0;
let totalAvailableFollowingItems = 0;
let totalAvailableNotificationsItems = 0;
let remainingFollowingItems = 0;
let remainingNotificationsItems = 0;

let sessionUserCollections = [] as App.RowData[];

let feedMode = 'following';
let parsedUrlInfo = null as App.RowData | null;

export const load: PageServerLoad = async ({ params, url, locals: { safeGetSession } }) => {
	const { session } = await safeGetSession();
	const sessionUserId = session?.user.id as string;

	const urlUsername = params.username;

	const batchSize = 10;
	const timestampEnd = new Date();
	const timestampStart = add(timestampEnd, { days: -300 });
	const updatesPageUpdatedAt = metadata.updated as string;

	let profileData = await selectProfilePageData(sessionUserId, urlUsername);

	if (!profileData.profileUserData) {
		throw redirect(303, '/');
	}

	const profileUserId = profileData.profileUserData.id as string;
	const profileUsername = profileData.profileUserData.username as string;

	if (url.pathname != feedData.feedSlug) {
		loadData = true;
		feedData.feedItems = [];
		batchIterator = 0;
		feedData.feedSlug = url.pathname;
	}

	const feedItemTypes = feedData.selectedOptions.find(
		(element) => element.category == 'feed_item_types'
	);

	// if profile is session user's, load feed data
	if (loadData && sessionUserId == profileUserId) {
		if (batchIterator == 0) {
			feedData.feedItems = [];
			feedData.notificationsItems = [];
		}

		if (batchIterator == 0 || feedMode == 'following') {
			feedData.feedItems.length = batchIterator * batchSize;

			const select = await selectFollowingFeed(
				sessionUserId,
				batchSize,
				batchIterator,
				timestampStart,
				timestampEnd,
				feedItemTypes
			);

			const selectedFeedData = select.feedData;

			feedData.feedItems.push(...selectedFeedData);
			feedItemCount = feedData.feedItems.length;

			totalAvailableFollowingItems = select.totalRowCount as number;
			remainingFollowingItems = select.totalRowCount - feedItemCount;
		}

		if (batchIterator == 0 || feedMode == 'notifications') {
			feedData.notificationsItems.length = batchIterator * batchSize;

			const select = await selectNotificationsFeed(
				sessionUserId,
				batchSize,
				batchIterator,
				timestampStart,
				timestampEnd,
				feedItemTypes
			);
			const selectedFeedData = select.feedData;

			feedData.notificationsItems.push(...selectedFeedData);
			feedItemCount = feedData.notificationsItems.length;

			totalAvailableNotificationsItems = select.totalRowCount as number;
			remainingNotificationsItems = select.totalRowCount - feedItemCount;
		}

		loadData = !loadData;
	}
	// if profile is another user's, load their posts
	else if (loadData && sessionUserId != profileUserId) {
		feedData.feedItems.length = batchIterator * batchSize;

		const select = await selectUserPostsSample(
			sessionUserId,
			profileUsername,
			batchSize,
			batchIterator
		);
		const totalRowCount = select.totalRowCount;
		const selectedFeedData = select.feedData;

		feedData.feedItems.push(...selectedFeedData);
		feedItemCount = feedData.feedItems.length;

		totalAvailableFollowingItems = totalRowCount as number;
		remainingFollowingItems = totalRowCount - feedItemCount;

		loadData = !loadData;
	}

	if (userAction) {
		userAction = false;
		loadData = true;

		profileData = await selectProfilePageData(sessionUserId, profileUsername);
	}

	const totalAvailableItems =
		feedMode == 'following' ? totalAvailableFollowingItems : totalAvailableNotificationsItems;
	const remaining = feedMode == 'following' ? remainingFollowingItems : remainingNotificationsItems;

	return {
		sessionUserId,
		profileData,
		feedItems: feedData.feedItems,
		notificationsItems: feedData.notificationsItems,
		selectedOptions: feedData.selectedOptions,
		totalAvailableItems,
		remaining,
		profileUsername,
		sessionUserCollections,
		updatesPageUpdatedAt,
		parsedUrlInfo
	};
};

export const actions = {
	loadMore: async ({ request }) => {
		const data = await request.formData();
		feedMode = data.get('feed-mode') as string;
		batchIterator++;
		loadData = true;
		return { loadData };
	},
	blockUser: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const profileUserId = data.get('profile-user-id') as string;

		const block = await insertUpdateBlock(sessionUserId, profileUserId);

		const userActionSuccess = block ? true : false;

		userAction = userActionSuccess ? true : false;
		loadData = userActionSuccess ? false : true;

		return { userActionSuccess };
	},
	reportUser: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const profileUserId = data.get('profile-user-id') as string;

		const flag = await insertUserFlag(sessionUserId, profileUserId);

		const userActionSuccess = flag ? true : false;

		userAction = userActionSuccess ? true : false;
		loadData = userActionSuccess ? false : true;

		return { userActionSuccess };
	},
	followUser: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const profileUserId = data.get('profile-user-id') as string;

		const follow = await insertUpdateUserFollow(sessionUserId, profileUserId);

		const userActionSuccess = follow ? true : false;

		userAction = userActionSuccess ? true : false;
		loadData = userActionSuccess ? false : true;

		return { userActionSuccess };
	},
	parseListenUrl: async ({ request }) => {
		const data = await request.formData();
		const artistName = data.get('artist-name') as string;
		const releaseGroupName = data.get('release-group-name') as string;
		const recordingName = data.get('recording-name') as string;
		const episodeName = data.get('episode') as string;
		const listenUrlString = data.get('listen-url') as string;

		console.log('parsing?');

		if (!(artistName || releaseGroupName || recordingName || episodeName)) {
			parsedUrlInfo = await getListenUrlData(listenUrlString);
		}

		console.log(parsedUrlInfo);

		return { success: true };
	},
	post: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const timestampISOString: string = new Date().toISOString();
		const timestampISO: Date = parseISO(timestampISOString);

		const data = await request.formData();
		const itemType = data.get('item-type') as string;
		const listenUrl = data.get('listen-url') as string;
		const parsedUrlData = validStringCheck(data.get('parsed-url-data') as string);
		const listenUrlData = parsedUrlData ? JSON.parse(parsedUrlData) : null;
		const artistMbid = data.get('artist-mbid') as string;
		const artistName = data.get('artist-name') as string;
		const releaseGroupMbid = data.get('release-group-mbid') as string;
		const releaseGroupName = data.get('release-group-name') as string;
		const recordingMbid = data.get('recording-mbid') as string;
		const recordingName = data.get('recording-name') as string;
		const remixerArtistMbid = data.get('remixer-artist-mbid') as string;
		const releaseDate = data.get('release-date') as string;
		const label = data.get('label') as string;
		const imgUrl = data.get('img-url') as string;
		const lastFmImgUrl = data.get('last-fm-img-url') as string;
		const episodeName = data.get('episode') as string;
		const showName = data.get('show') as string;
		const postText = data.get('post-text') as string;

		async function urlData(listenUrl: string, listenUrlData: App.RowData) {
			if (!listenUrl) {
				return null;
			} else if (listenUrl && listenUrlData) {
				return listenUrlData;
			} else if (listenUrl && !listenUrlData) {
				const data = await getListenUrlData(listenUrl);
				return data;
			}
		}

		const embedInfo = await urlData(listenUrl, listenUrlData);

		const postData = {
			user_id: sessionUserId,
			type: 'now_playing',
			status: 'new',
			listen_url: validStringCheck(listenUrl),
			item_type: validStringCheck(itemType),
			artist_mbid: validStringCheck(artistMbid),
			release_group_mbid: validStringCheck(releaseGroupMbid),
			recording_mbid: validStringCheck(recordingMbid),
			artist_name: validStringCheck(artistName),
			release_group_name: validStringCheck(releaseGroupName),
			recording_name: validStringCheck(recordingName),
			remixer_artist_mbid: validStringCheck(remixerArtistMbid),
			release_date: validStringCheck(releaseDate),
			label: validStringCheck(label),
			img_url: validStringCheck(imgUrl),
			last_fm_img_url: validStringCheck(lastFmImgUrl),
			episode_title: validStringCheck(episodeName),
			show_title: validStringCheck(showName),
			text: validStringCheck(postText),
			created_at: timestampISO,
			updated_at: timestampISO,
			embed_id: embedInfo?.id ?? null,
			embed_source: embedInfo?.source ?? null,
			embed_account: embedInfo?.account ?? null
		} as App.RowData;

		const { username, createdAt } = await insertPost(postData);
		const timestampSlug = createdAt?.toISOString();
		const timestamp = Date.parse(timestampSlug).toString();

		loadData = true;
		if (!timestampSlug) {
			return { success: false };
		} else {
			redirect(303, `/posts/${username}/now-playing/${timestamp}`);
		}
	},
	flagPost: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const postId = data.get('post-id') as string;

		const flag = await insertPostFlag(sessionUserId, postId);

		const userActionSuccess = flag ? true : false;

		return { userActionSuccess };
	},
	editPost: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const editedText = data.get('edited-text') as string;
		const postData = JSON.parse(data.get('post-data') as string) as App.RowData;

		const submitEdit = await updatePost(sessionUserId, postData, editedText);

		const success = submitEdit ? true : false;

		loadData = success ? false : true;

		const feedItemIndex =
			feedData?.feedItems.findIndex((element) => element.post_id == postData.post_id) ?? null;
		if (feedItemIndex >= 0) {
			feedData.feedItems[feedItemIndex].text = editedText;
			feedData.feedItems[feedItemIndex].status = 'edited';
		}

		return { success };
	},
	deletePost: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const postId = data.get('post-id') as string;

		const submitDelete = await deletePost(sessionUserId, postId);

		const success = submitDelete ? true : false;

		return { success };
	},
	submitReaction: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const reactionType = data.get('reaction-type') as string;
		const postId = (data.get('post-id') as string) ?? (data.get('post-reply-id') as string);

		const reactionData = {
			user_id: sessionUserId,
			post_id: postId,
			collection_id: null,
			reaction_type: reactionType,
			item_type: 'post'
		} as App.RowData;

		const { reaction } = await insertUpdateReaction(reactionData);

		const userActionSuccess = reaction ? true : false;

		return { userActionSuccess };
	},
	getCollectionList: async ({ locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		sessionUserCollections = await selectListSessionUserCollections(sessionUserId);

		return { showCollectionsModal: true };
	},
	saveToCollection: async ({ request, locals: { safeGetSession } }) => {
		const { session } = await safeGetSession();
		const sessionUserId = session?.user.id as string;

		const data = await request.formData();
		const postId = data.get('post-id') as string;
		const collectionId = data.get('collection-id') as string;

		const update = await saveItemToCollection(sessionUserId, postId, collectionId);

		return { updateSuccess: update };
	},
	applyOptions: async ({ request }) => {
		const data = await request.formData();
		const selected = data.getAll('selected-options');

		const selectedOptionsIndex = feedData.selectedOptions.findIndex(
			(item) => item.category == 'feed_item_types'
		);

		feedData.selectedOptions[selectedOptionsIndex].items = selected;

		batchIterator = 0;
		loadData = true;
	}
} satisfies Actions;

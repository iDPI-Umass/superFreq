<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import Feed from '$lib/components/Feed.svelte';
	import { feedData } from '$lib/resources/states.svelte';

	let { data, form } = $props();
	let {
		sessionUserId,
		feedItems,
		firehoseFeedItems,
		selectedOptions,
		remaining,
		sessionUserCollections
	} = $derived(data);

	let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false);
	let showSaveSucessModal = $derived(form?.updateSuccess ?? false);

	$effect(() => {
		feedData.selectedOptions = selectedOptions;
		feedData.feedItems = feedItems;
		feedData.firehoseFeedItems = firehoseFeedItems;
	});
</script>

<SEO title="Feed"></SEO>

<Feed
	{sessionUserId}
	mode="feed"
	feedItems={feedData.feedItems}
	firehoseFeedItems={feedData.firehoseFeedItems}
	userActionSuccess={form?.userActionSuccess}
	{remaining}
	collections={sessionUserCollections}
	{showCollectionsListModal}
	{showSaveSucessModal}
	showFilters={true}
	feedTabs={['following', 'discover']}
></Feed>

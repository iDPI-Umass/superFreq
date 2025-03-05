<script lang="ts">
    import Feed from '$lib/components/Feed.svelte'

    let { data, form } = $props()
    let { sessionUserId, feedItems, remaining, sessionUserCollections } = $derived(data)

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)
</script>

<!-- <svelte:options runes={true} /> -->

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<Feed
    sessionUserId={sessionUserId}
    feedItems={feedItems}
    mode="feed"
    userActionSuccess={form?.userActionSuccess}
    remaining={remaining}
    collections={sessionUserCollections}
    showCollectionsListModal={showCollectionsListModal}
    showSaveSucessModal={showSaveSucessModal}
></Feed>
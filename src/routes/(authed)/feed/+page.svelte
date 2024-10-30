<script lang="ts">
    import Feed from '$lib/components/Feed.svelte'

    let { data, form } = $props()
    let { sessionUserId, feedItems, remaining } = $derived(data)
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<Feed
    sessionUserId={sessionUserId}
    feedItems={feedItems}
    mode="feed"
    remaining={remaining}
></Feed>
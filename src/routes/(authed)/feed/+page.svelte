<script lang="ts">
    import Feed from '$lib/components/Feed.svelte'

    let { data, form } = $props()
    let { sessionUserId, feedData, remaining, timestampStart, timestampEnd, batchSize, options } = $derived(data)

    $effect(() => {
        console.log('remaining: ', remaining)
    })
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<Feed
    sessionUserId={sessionUserId}
    feedItems={form?.feedItems ?? feedData}
    batchSize={batchSize}
    batchIterator={form?.batchIterator}
    timestampStart={timestampStart}
    timestampEnd={timestampEnd}
    options={options}
    mode="feed"
    remaining={form?.remaining ?? remaining}
></Feed>
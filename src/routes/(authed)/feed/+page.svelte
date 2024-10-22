<svelte:options runes={true} />
<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import Feed from '$lib/components/Feed.svelte'

    // export let data: PageData
    // export let form: ActionData
    let { data, form } = $props()
    let { sessionUserId, feedData, remaining, timestampStart, timestampEnd, batchSize, batchIterator, options } = $derived(data)

</script>

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<Feed
    sessionUserId={sessionUserId}
    feedItems={form?.feedItems ?? feedData}
    batchSize={batchSize}
    batchIterator={form?.batchIterator ?? 0}
    timestampStart={timestampStart}
    timestampEnd={timestampEnd}
    options={options}
    mode="feed"
    remaining={form?.remaining ?? remaining}
></Feed>
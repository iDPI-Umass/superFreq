<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import Feed from '$lib/components/Feed.svelte'

    export let data: PageData
    export let form: ActionData
    $: form
    let { sessionUserId, feedData, remaining, timestampStart, timestampEnd, batchSize, options } = data
    $: ({ sessionUserId, feedData, remaining, totalRowCount, timestampStart, timestampEnd, batchSize, options } = data)

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
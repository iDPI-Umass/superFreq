<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import { enhance } from '$app/forms'
    export let form: ActionData
    export let data: PageData

    let { collections, remaining, totalCollections, batchSize, batchIterator } = data
    $: ({ collections, remaining, totalCollections, batchSize, batchIterator } = data )
</script>

<div class="wrapper">
    <h1>collections</h1>
    <ul>
        {#each (form?.collections ?? collections) as collection}
            <li>
                <a href='/collection/{collection.collection_id}'>
                    {collection.title} by {collection.username} ({new Date(collection.created_at).toLocaleDateString()})
                </a>
            </li>
        {/each}
    </ul>

    <form 
        method="POST" 
        action="?/loadMore"
        use:enhance
    >
        <input
            type="hidden"
            name="batch-iterator"
            value={form?.batchIterator ?? batchIterator}
        />
        <input
            type="hidden"
            name="batch-size"
            value={batchSize}
        />
        <input
            type="hidden"
            name="collections"
            value={JSON.stringify(form?.collections ?? collections)}
        />
        {#if (form?.remaining ?? remaining) > 0}
            <button class="standard" formaction="?/loadMore">
                load more
            </button>
        {/if}
    </form>
</div>

<svelte:head>
	<title>
		Explore Collections
	</title>
</svelte:head>


<style>
    .wrapper {
        margin: 3vh 3vw;
    }
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
</style>
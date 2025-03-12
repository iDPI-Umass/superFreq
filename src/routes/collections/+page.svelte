<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from '$lib/components/PanelHeader.svelte';
    import type { PageData, ActionData } from './$types'
    import { enhance } from '$app/forms'
    interface Props {
        form: ActionData;
        data: PageData;
    }

    let { form, data }: Props = $props();

    let { collections, remaining, totalCollections, batchSize, batchIterator } = $derived(data)
</script>

<SEO title="Explore collections"></SEO>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
        collection spotlight
        {/snippet}
    </PanelHeader>
    <div class="spotlight">
        <h2>
            <a href="/collection/193">Freq beta test listening club, March 2025</a>
        </h2>
    </div>
    
    
</div>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
        all collections
        {/snippet}
    </PanelHeader>
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
            <div class="button-spacer">
                <button class="standard" formaction="?/loadMore">
                    load more
                </button>
            </div>
        {/if}
    </form>
</div>

<style>
    .spotlight {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    h2 {
        margin: var(--freq-spacing-medium) auto;
    }
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
</style>

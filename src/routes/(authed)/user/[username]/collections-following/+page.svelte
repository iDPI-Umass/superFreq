<script lang="ts">
    import PanelHeader from '$lib/components/PanelHeader.svelte';

    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { collections, username } = $derived(data)
</script>

<!-- <svelte:options runes={true} /> -->
<svelte:head>
	<title>
		Collections {username} follows
	</title>
</svelte:head>

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
        Collections {username} follows
        {/snippet}
    </PanelHeader>
    <ul>
        {#each collections as collection}
            <li>
                <a href='/collection/{collection.collection_id}'>
                    {collection.title} by {collection.username} (updated {new Date(collection.updated_at).toLocaleDateString()})
                </a>
            </li>
        {/each}
    </ul>
</div>
<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';

    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { collections, username } = $derived(data)
</script>

<SEO title="Collections {username} follows"></SEO>

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
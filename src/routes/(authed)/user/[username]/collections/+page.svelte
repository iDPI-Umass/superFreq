<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { collections, username } = $state(data)

    let displayName = $derived(collections[0]["display_name"])
</script>

<SEO title="{username}'s collections"></SEO>

<div class="panel">
    <PanelHeader
    >
        {#snippet headerText()}
        {`${displayName}'s collections`}
        {/snippet}
    </PanelHeader>
    <ul>
        {#each collections as collection}
        <li>
            <a href="/collection/{collection.id}">
                {collection.title}
            </a>
        </li>
        {/each}
    </ul>
</div>
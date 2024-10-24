<script lang="ts">
    import type { Snippet } from 'svelte'
    import PanelHeader from "$lib/components/PanelHeader.svelte"

    let { title, content }: { title: Snippet, content: Snippet } = $props()
</script>

<svelte:options runes={true} />

<div class="panel">
    <PanelHeader>
        {#snippet headerText()}
            {@render title()}
        {/snippet}
    </PanelHeader>
    <div class="about-text">
        {@render content()}
    </div>
</div>

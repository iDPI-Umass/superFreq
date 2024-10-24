<script lang="ts">
    import type { Snippet } from 'svelte'
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import decoration from "$lib/assets/images/panel-header-decoration.svg"


    // export let title
    // export let content
    let { title, children }=  $props()
</script>

<svelte:options runes={true} />

<div class="panel">
    <div class="panel-header">
        <img src={decoration} alt="decoration" />
        <h1>
            {@render title()}
        </h1>
    </div>
    <div class="about-text">
        {@render children()}
    </div>
</div>

<style>
    .panel-header {
        display: flex;
        flex-direction: row;
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        margin: var(--freq-spacing-3x-small) 0;
        align-items: center;
    }
    h1 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        font-weight: var(--freq-font-weight-light);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer-half);
    }
</style>
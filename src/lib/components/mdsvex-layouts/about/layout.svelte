<script lang="ts">
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    export let title
</script>

<div class="panel">
    <PanelHeader>
        {title}
    </PanelHeader>
    <div class="about-text">
        <slot></slot>
    </div>
</div>

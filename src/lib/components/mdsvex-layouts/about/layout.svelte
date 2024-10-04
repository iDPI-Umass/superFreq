<script lang="ts">
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    export let title
</script>

<div class="panel">
    <PanelHeader>
        <span slot="text">
            {title}
        </span>
    </PanelHeader>
    <div class="about-text">
        <slot></slot>
    </div>
</div>

<script lang="ts">
    import PanelHeader from "$lib/components/PanelHeader.svelte"
</script>

<div class="panel">
    <PanelHeader>
        Community Guidelines
    </PanelHeader>
    <div class="about-text">
        <slot></slot>
    </div>
</div>

<script lang="ts">
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    export let title

    let { title }: { title: string } = $props()
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

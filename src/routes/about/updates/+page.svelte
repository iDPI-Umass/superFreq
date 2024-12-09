<script lang="ts">
	import PanelHeader from "$lib/components/PanelHeader.svelte"
	import Updates from '$lib/assets/text/updates.md'
    import Bugs from '$lib/assets/text/known-bugs.md'
    import Roadmap from '$lib/assets/text/roadmap.md'
</script>

<svelte:head>
	<title>
		Updates
	</title>
</svelte:head>

<svelte:options runes={true} />

<div class="panel-no-border">
    <div class="half-width-panel">
        <PanelHeader>
            {#snippet headerText()}
                Known bugs
            {/snippet}
        </PanelHeader>
        <div class="about-text">
            <Bugs></Bugs>
        </div>
    </div>
    <div class="half-width-panel">
        <PanelHeader>
            {#snippet headerText()}
                Roadmap
            {/snippet}
        </PanelHeader>
        <div class="about-text">
            <Roadmap></Roadmap>
        </div>
    </div>
</div>

<div class="panel" id="updates">
	<PanelHeader>
		{#snippet headerText()}
			Updates
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Updates></Updates>
	</div>
</div>
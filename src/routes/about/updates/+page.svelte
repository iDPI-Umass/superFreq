<script lang="ts">
	import PanelHeader from "$lib/components/PanelHeader.svelte"
	import Updates from '$lib/assets/text/updates.md'
    import Bugs from '$lib/assets/text/known-bugs.md'
</script>

<svelte:head>
	<title>
		Updates
	</title>
</svelte:head>

<svelte:options runes={true} />

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Known bugs
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Bugs></Bugs>
	</div>
</div>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Updates
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Updates></Updates>
	</div>
</div>
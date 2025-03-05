<script lang="ts">
	import PanelHeader from "$lib/components/PanelHeader.svelte"
    import { metadata } from '$lib/assets/text/about.md'
	import About from '$lib/assets/text/about.md'
</script>

<svelte:head>
	<title>
		About
	</title>
</svelte:head>

<!-- <svelte:options runes={true} /> -->

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			{metadata.title}
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<About></About>
	</div>
</div>
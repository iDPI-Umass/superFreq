<script lang="ts">
	import PanelHeader from "$lib/components/PanelHeader.svelte"
	import Guidelines from '$lib/assets/text/community-guidelines.md'
    import Consent from '$lib/assets/text/data-consent.md'
</script>

<svelte:head>
	<title>
		Guidelines
	</title>
</svelte:head>

<svelte:options runes={true} />

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Community guidelines
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Guidelines></Guidelines>
	</div>
</div>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			Data consent
		{/snippet}
	</PanelHeader>
	<div class="about-text">
		<Consent></Consent>
	</div>
</div>
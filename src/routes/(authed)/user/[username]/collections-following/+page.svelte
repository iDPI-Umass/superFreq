<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import CollectionsList from '$lib/components/collections/CollectionsList.svelte';

	let { data } = $props();

	let { collections, username } = $derived(data);

	let displayName = $derived(collections[0]['display_name']);
</script>

<SEO title="Collections {username} follows"></SEO>

<div class="column-two-thirds">
	<CollectionsList panelHeaderText={`collections ${displayName} follows`} {collections}
	></CollectionsList>
</div>

<style>
	.column-two-thirds {
		margin: var(--freq-spacing-large) auto;
	}
</style>

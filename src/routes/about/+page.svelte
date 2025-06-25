<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import { metadata } from '$lib/assets/text/about.md';
	import About from '$lib/assets/text/about.md';
</script>

<SEO title="About"></SEO>

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

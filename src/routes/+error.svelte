<script lang="ts">
	import { page } from '$app/state';
	import PanelHeader from '$lib/components/layout/PanelHeader.svelte';
</script>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			{@html page.status}
		{/snippet}
	</PanelHeader>
	Error!
</div>

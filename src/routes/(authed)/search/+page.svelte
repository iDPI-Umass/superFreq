<script lang="ts">
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';
	import { searchResults } from '$lib/resources/states.svelte';
	const { data } = $props();

	const { siteSearchResults, query } = $derived(data);

	$effect(() => {
		searchResults.results = siteSearchResults;
	});
</script>

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			search results for "{query}"
		{/snippet}
	</PanelHeader>
	{#if siteSearchResults.length > 0}
		<ol class="search-results">
			{#each siteSearchResults as result}
				{#if result.result_type == 'collection'}
					<li>
						<a href="/collection/{result.collection_id}">
							{result.title}
							<div class="result-row">
								by
								<span class="display-name">{result.display_name}</span>
								<span class="data-muted">({result.username})</span>
							</div>
							<span class="search-result-tag">collection</span>
						</a>
					</li>
				{:else if result.result_type == 'user'}
					<li>
						<a href="/user/{result.username}">
							<div class="result-row">
								<span class="display-name">{result.display_name}</span>
								<span class="data-muted">{result.username}</span>
							</div>
							<span class="search-result-tag">user</span>
						</a>
					</li>
				{/if}
			{/each}
		</ol>
	{:else}
		<div class="info-box-compact">
			<p>No search results for "{query}"</p>
		</div>
	{/if}
</div>

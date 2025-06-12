<script lang="ts">
	import { displayDate } from '$lib/resources/parseData'
	import CollectionImage from './CollectionImage.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'


	interface ComponentProps {
		sessionUserId?: string
		headerText: string
		mode?: string
		remaining?: number
		collections: App.RowData[]
	}

	let {
		sessionUserId,
		headerText,
		mode = 'wide',
		remaining,
		collections = [],
	}: ComponentProps = $props();

	const cssMode = {
		'narrow': 'collection-identity-full',
		'wide': 'collection-identity-half'
	} as App.StringLookupObject

	const modeWidth = $derived(cssMode[mode])
</script>

{#snippet listItem(collection: App.RowData)}
	<li>
		<div class={modeWidth}>
			<CollectionImage src={collection.avatar_url} />
			<a class="collection-title-link" href="/collection/{collection.collection_id}">
				{collection.title}
			</a>
		</div>
		<div class="collection-info-attribution">
			<p class="collection-info-text">
				Collection by 
				<a href="/user/{collection.username}">
					{collection.display_name}
				</a>
			</p>
			<p class="collection-date-text">Last updated on {displayDate(collection.updated_at)}</p>
		</div>
	</li>
{/snippet}

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			text
		{/snippet}
	</PanelHeader>
	<ul>
		{#each collections as collection}
			{@render listItem(collection)}
		{/each}
	</ul>
	<div class="load-button-container">
		<button class="standard"> load more </button>
	</div>
</div>

<style>
	ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
	li {
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		gap: var(--freq-inline-gap-double);
		border-bottom: var(--freq-border-panel);
		padding: var(--freq-spacing-small) 0;
	}
	.collection-identity-full {
		display: flex;
		flex-direction: row;
		gap: var(--freq-inline-gap-double);
		align-items: center;
		width: inherit;
	}
	.collection-identity-half {
		display: flex;
		flex-direction: row;
		gap: var(--freq-inline-gap-double);
		align-items: center;
		width: 50%;
	}
	.collection-title-link {
		font-family: var(--freq-alt-font-family);
		font-size: var(--freq-font-size-medium);
	}
</style>

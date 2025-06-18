<script lang="ts">
	import { displayDate } from '$lib/resources/parseData'
	import CollectionImage from './CollectionImage.svelte'
	import CollectionImageTrio from './CollectionImageTrio.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte'
	import CoverArt from '../CoverArt.svelte';


	interface ComponentProps {
		sessionUserId?: string
		panelHeaderText: string
		mode?: string
		imgMode?: string
		remaining?: number
		collection?: App.RowData
		collections?: App.RowData[]
	}

	let {
		sessionUserId,
		panelHeaderText,
		mode = 'wide',
		imgMode = 'single',
		remaining,
		collection,
		collections = [],
	}: ComponentProps = $props();

	const cssMode = {
		'narrow': 'collection-identity-full',
		'wide': 'collection-identity-half'
	} as App.StringLookupObject

	const modeWidth = $derived(cssMode[mode])
	// const displayTitle = $derived(panelHeaderText)
</script>

{#snippet listItem(collection: App.RowData)}
	<li>
		<a class={modeWidth} href="/collection/{collection.collection_id}">
			<div class="item-images">
				<div class="item-images-layout">
					<CollectionImageTrio 
						collection={collection}
						orientation='row'
					></CollectionImageTrio>
				</div>
			</div>
			<div class="item-links">
				{collection.title}
				{#if mode == 'narrow'}
					<span class="collection-info-text">
						by {collection.display_name}
					</span>
				{/if}
				
			</div>
		</a>
		{#if mode == 'wide'}
			<div class="collection-info-attribution">
				<span class="collection-info-text">
					Collection by 
					<a href="/user/{collection.username}">
						{collection.display_name}
					</a>
				</span>
				<span class="collection-date-text">Last updated on {displayDate(collection.updated_at)}</span>
			</div>
		{/if}
	</li>
{/snippet}

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			{@html panelHeaderText}
		{/snippet}
	</PanelHeader>
	<ul>
		{#each collections as collection}
			{@render listItem(collection)}
		{/each}
	</ul>
	<!-- <div class="load-button-container">
		<button class="standard"> load more </button>
	</div> -->
</div>

<style>
	ul {
		padding: 0;
		margin: 0;
		list-style: none;
	}
	li {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		gap: var(--freq-inline-gap-double);
		border-bottom: var(--freq-border-panel);
		padding: var(--freq-spacing-medium) var(--freq-spacing-2x-small);

	}
	li:last-child {
		border-bottom: none;
	}
	.collection-identity-full {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		width: fit-content;
		margin: auto 0;
		font-size: var(--freq-font-size-medium);
		color: var(--freq-color-text);
	}
	.collection-identity-half {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		width: 50%;
		margin: auto 0;
		font-size: var(--freq-font-size-medium);
		color: var(--freq-color-text);
	}
	.collection-identity-full:active,
	.collection-identity-half:active {
		color: var(--freq-color-link);
	}
	.item-images {
		width: fit-content;
		height: fit-content;
		margin: auto 0;
	}
	.item-images-layout {
		display: inline-block;
		width: calc(var(--freq-image-thumbnail-x-small) + 20px);
		height: inherit;
		margin: var(--freq-height-spacer) var(--freq-width-spacer-half);
	}
	.item-links {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.collection-info-text {
		margin: 0;
	}
	@media screen and (max-width: 600px) {
		li {
			flex-direction: column;
		}
	}
</style>

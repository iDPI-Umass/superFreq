<script lang="ts">
	import { displayDate } from '$lib/resources/parseData'
	import CollectionImage from './CollectionImage.svelte'
	import CollectionImageSpotlight from './CollectionImageSpotlight.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte'
	import CoverArt from '../CoverArt.svelte';


	interface ComponentProps {
		sessionUserId?: string
		headerText: string
		mode?: string
		imgMode?: string
		remaining?: number
		collection?: App.RowData
		collections?: App.RowData[]
	}

	let {
		sessionUserId,
		headerText,
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

	const imgUrls = ['https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg','https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg','https://ia601609.us.archive.org/19/items/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad/mbid-f9739d2c-9b44-4ac1-a0e7-327a23d741ad-2051756196.jpg']
</script>

{#snippet listItem(collection: App.RowData)}
	<li>
		<div class={modeWidth}>
			<div class="collection-image-container">
				{#if imgMode == 'single' && collection}
					<CoverArt
						item={collection}
						altText='image'
					></CoverArt>
				{:else if imgMode = 'trio'}
					<div class="collection-images">
						<CollectionImageSpotlight 
							imgUrls={imgUrls}
							orientation='row'
						></CollectionImageSpotlight>
					</div>
				{/if}
			</div>
			<div class="collection-links">
				<a class="collection-title-link" href="/collection/{collection.collection_id}">
					{collection.title}
				</a>
				{#if mode == 'narrow'}
					<span class="collection-info-text">
						by 
						<a href="/user/{collection.username}">
							{collection.display_name}
						</a>
					</span>
				{/if}
			</div>
		</div>
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
		flex-direction: row;
		align-items: start;
		justify-content: start;
		gap: var(--freq-inline-gap-double);
		border-bottom: var(--freq-border-panel);
		padding: var(--freq-spacing-medium) var(--freq-spacing-2x-small);

	}
	.collection-identity-full {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		width: fit-content;
		margin: auto 0;
	}
	.collection-identity-half {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		width: 50%;
		margin: auto 0;
	}
	.collection-image-container {
		width: fit-content;
		height: fit-content;
		margin: auto 0;
	}
	.collection-images {
		display: inline-block;
		width: calc(var(--freq-image-thumbnail-x-small) + 20px);
		height: inherit;
		margin: var(--freq-height-spacer) var(--freq-width-spacer-half);
	}
	.collection-links {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.collection-title-link {
		font-size: var(--freq-font-size-medium);
		color: var(--freq-color-text);
	}
	.collection-title-link:is(:hover, :focus) {
		color: var(--freq-color-link);
	}
	.collection-title-link:active {
		color: var(--freq-color-text-dark);
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

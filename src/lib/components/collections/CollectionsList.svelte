<script lang="ts">
	import { displayDate } from '$lib/resources/parseData'
	import CollectionImageTrio from './CollectionImageTrio.svelte'
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte'


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
		'succint': 'collection-identity-attribution',
		'detailed': 'collection-identity-no-attribution'
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
				{#if mode == 'succint'}
					<span class="collection-info-text">
						by {collection.display_name}
					</span>
				{/if}
				
			</div>
		</a>
		{#if mode == 'detailed'}
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
		align-items: center;
		justify-content: start;
		border-bottom: var(--freq-border-panel);
		padding: var(--freq-spacing-medium) var(--freq-spacing-2x-small);
	}
	li:last-child {
		border-bottom: none;
	}
	.collection-identity-attribution {
		display: flex;
		flex-direction: row;
		align-items: start;
		justify-content: start;
		gap: var(--freq-inline-gap-double);
		width: fit-content;
		margin: auto var(--freq-spacing-x-small);
		font-size: var(--freq-font-size-medium);
		color: var(--freq-color-text);
	}
	.collection-identity-no-attribution {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: calc(var(--freq-inline-gap-double) *2);
		width: 50%;
		margin: 0;
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
	}
	.item-images-layout {
		display: inline-block;
		width: calc(var(--freq-image-thumbnail-x-small) + 20px);
		height: inherit;
		margin: var(--freq-height-spacer) 0;
	}
	.item-links {
		display: flex;
		flex-direction: column;
		width: inherit;
		align-items: start;
		justify-content: start;
	}
	/* .collection-info-attribution {
		margin: 0 auto;
		padding: 0 auto;
	} */
	.collection-info-attribution * {
		line-height: var(--freq-line-height-denser);
		margin: 0 auto;
	}
	.collection-info-text {
		margin: 0;
	}
	@media screen and (max-width: 770px) {
		.panel, ul, .item-links {
			width: fit-content;
		}
		li {
			flex-direction: column;
			align-items: start;
			max-width: 100%;
			padding: var(--freq-spacing-small);
		}
		.collection-identity-attribution {
			margin: auto var(--freq-spacing-2x-small);
			align-items: center;
		}
		.collection-identity-no-attribution {
			align-items: end;
			width: 75%;
			margin: var(--freq-height-spacer-quarter) 0;
		}
		.item-images {
			margin-top: var(--freq-spacing-2x-small);
			margin-bottom: auto;
		}
		.collection-info-attribution {
			width: fit-content;
		}
		.collection-info-attribution * {
			font-size: var(--freq-font-size-small);
			line-height: var(--freq-line-height-denser);
			margin: 0;
		}
		.collection-info-text {
			font-size: var(--freq-font-size-small);
			margin-top: var(--freq-spacing-2x-small);
		}
	}
</style>

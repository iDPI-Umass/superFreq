<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import CollectionsSpotlight from 'src/lib/components/collections/CollectionsSpotlight.svelte';
	import CollectionsList from 'src/lib/components/collections/CollectionsList.svelte';
	import CollectionImageSpotlight from '$lib/components/collections/CollectionImageSpotlight.svelte';
	import Feed from 'src/lib/components/Feed.svelte';

	let { form, data } = $props();

	let {
		sessionUserId,
		feedItems,
		collections,
		feedRemaining,
		remaining,
		totalCollections,
		batchSize,
		batchIterator
	} = $derived(data);
	
</script>

<SEO title="Explore collections"></SEO>

<div class="jumbotron-container">
	<div class="jumbotron-item-wrapper">
		<div class="jumbotron-text">
			<h3>Collect, curate, and share. Collections are the perfect way to group Albums.</h3>
		</div>
		<div class="jumbotron-button">
			<button class="double-border-top">
				<div class="inner-border">Create a Collection</div>
			</button>
		</div>
	</div>
</div>


{#snippet spotlightItem(collection: App.RowData)}
	<div class="spotlight-item">
		<div class="spotlight-images">
			<CollectionImageSpotlight 
				imgUrl={collection.avatar_url}
				orientation='column'
			></CollectionImageSpotlight>
		</div>
		<div class="spotlight-collection-info">
			<div class="spotlight-collection-info-text">
				<span class="collection-title">
					{collection.title}
				</span>
				<br />
				<span class="collection-owner">
					by {collection.display_name}
				</span>
			</div>
			<hr class="spotlight-item-divider" />
			<span>
				{collection.description}
			</span>
		</div>
	</div>
{/snippet}


<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			spotlight
		{/snippet}
		{#snippet button()}
			<button class="standard">
				see all
			</button>
		{/snippet}
	</PanelHeader>
	<div class="spotlight-row">
		{#each collections as collection}
			{@render spotlightItem(collection)}
		{/each}
	</div>
</div>


<div class="two-column">
	<div class="column-two-thirds">
		<CollectionsList 
			headerText="recently updated collections"
			collections={form?.collections ?? collections}
			mode="wide"
		></CollectionsList>
		<p>random change</p>
	</div>

	<div class="column-one-third">
		<Feed
			sessionUserId={sessionUserId}
			feedItems={feedItems}
			mode="feed"
		></Feed>
		<!-- <CollectionsList
			headerText="friends' collections"
			collections={form?.collections ?? collections}
			showAnalytics={false}
			mode="narrow"
		></CollectionsList> -->
	</div>
</div>


<style>
	.panel {
		max-width: 90vw;
	}
	.spotlight-row {
        display: flex;
        flex-direction: row;
    }
	.spotlight-item {
		display: flex;
		flex-direction: column;
        width: calc( 100% / 6 );
        margin-top: 0;
        padding-top: 0;
        align-items: start;
        justify-content: start;
		border-right: var(--freq-border-panel);
    }
	.spotlight-item:last-child {
		border-right: none;
	}
	.spotlight-images {
		height: calc(var(--freq-image-thumbnail-medium) + 30px);
		width: 100%;
		padding-top: 10px;
		background-color: var(--freq-color-background-badge);
	}
	.spotlight-collection-info {
		margin: var(--freq-spacing-small);
	}
	span.collection-title {
		font-size: var(--freq-font-size-small);
		text-transform: uppercase;
	}
	span.collection-owner {
		color: var(--freq-color-mellow);
		font-size: var(--freq-font-size-small);
	}
	hr.spotlight-item-divider {
		width: 35%;
		background: linear-gradient(90deg, var(--freq-color-primary) 35%, #000000 100%) padding-box;
	}
	.collections-spotlight-container {
		margin: var(--freq-spacing-large);
		border: var(--freq-border-panel);
	}
	.collections-spotlight-content {
		height: 20rem;
	}
	.jumbotron-container {
		background-color: black;
		min-height: 15rem;
		max-height: fit-content;
		align-content: center;
	}

	.jumbotron-item-wrapper {
		max-width: 50%;
		max-height: auto;
		margin-left: auto;
		margin-right: auto;
	}

	.jumbotron-text {
		text-align: center;
		text-shadow:
			-2px 0 50px var(--freq-color-primary),
			0 2px 50px var(--freq-color-primary),
			2px 0 50px var(--freq-color-primary),
			0 -2px 50px var(--freq-color-primary);
	}

	.jumbotron-button {
		max-width: fit-content;

		margin-left: auto;
		margin-right: auto;
	}
</style>

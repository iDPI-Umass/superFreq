<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte'
	import CollectionsList from '$lib/components/collections/CollectionsList.svelte';
	import CollectionImageSpotlight from 'src/lib/components/collections/CollectionImagoTrio.svelte';
	import Feed from '$lib/components/Feed.svelte'

	let { data } = $props();

	let {
		sessionUserId,
		spotlightCollections,
		recentCollections,
		collectionsFeed,
		followingUsersCollections,
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
		<div class="spotlight-item-images">
			<CollectionImageSpotlight 
				collection={collection}
				orientation='column'
			></CollectionImageSpotlight>
		</div>
		<div class="spotlight-collection-info">
			<div class="spotlight-collection-info-text">
				<span class="spotlight-collection-title">
					{collection.title}
				</span>
				<br />
				<span class="spotlight-collection-owner">
					by {collection.display_name}
				</span>
			</div>
			<hr class="spotlight-item-divider" />
			<span class="spotlight-collection-description">
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
		{#each spotlightCollections as collection}
			{@render spotlightItem(collection)}
		{/each}
	</div>
</div>


<div class="two-column">
	<div class="column-two-thirds">
		<CollectionsList 
			panelHeaderText="recently updated collections"
			collections={recentCollections}
			mode="wide"
			imgMode="trio"
		></CollectionsList>
	</div>

	<div class="column-one-third">
		{#if sessionUserId}
			<Feed
				sessionUserId={sessionUserId}
				feedItems={collectionsFeed.feedData}
				mode="feed"
				type="collections"
			></Feed>
			<CollectionsList
				panelHeaderText="friends' collections"
				collections={followingUsersCollections}
				mode="narrow"
				imgMode="trio"
			></CollectionsList>
		{/if}
	</div>
</div>


<style>
	.panel {
		max-width: 90vw;
	}
	.spotlight-collection-info {
		margin: var(--freq-spacing-small);
	}
	span.spotlight-collection-title {
		font-size: var(--freq-font-size-small);
		text-transform: uppercase;
		font-weight: var(--freq-font-weight-medium);
	}
	span.spotlight-collection-owner {
		color: var(--freq-color-mellow);
		font-size: var(--freq-font-size-small);
	}
	span.spotlight-collection-description {
		color: var(--freq-color-reading-text);
		font-size: var(--freq-font-size-medium);
	}
	hr.spotlight-item-divider {
		width: 35%;
		background: linear-gradient(90deg, var(--freq-color-primary) 35%, #000000 100%) padding-box;
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

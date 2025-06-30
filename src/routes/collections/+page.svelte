<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/layout/PanelHeader.svelte';
	import CollectionsList from 'src/lib/components/collections/CollectionsList.svelte';
	import CollectionImageTrio from 'src/lib/components/collections/CollectionImageTrio.svelte';
	import Feed from '$lib/components/Feed.svelte';
	import InlineMarkdownText from '$lib/components/layout/InlineMarkdownText.svelte';
	import { goto } from '$app/navigation';

	let { data } = $props();

	let {
		sessionUserId,
		spotlightCollectionId,
		spotlightCollections,
		recentCollections,
		collectionsFeed,
		followingUsersCollections
	} = $derived(data);
</script>

<SEO title="Explore collections"></SEO>

<div class="jumbotron">
	<p>Collect, curate, and share. Collections are the perfect way to group Albums.</p>
	<button class="double-border-top">
		<div class="inner-border">Create a Collection</div>
	</button>
</div>

{#snippet spotlightItem(collection: App.RowData)}
	<li class="spotlight-item">
		<div class="spotlight-item-images">
			<div class="grid-list-image-stack">
				<CollectionImageTrio {collection} orientation="column"></CollectionImageTrio>
			</div>
		</div>
		<div class="spotlight-collection-info">
			<a href="/collection/{collection.collection_id}">
				<span class="spotlight-collection-title">
					{collection.title}
				</span>
				<br />
				<span class="spotlight-collection-owner">
					by {collection.display_name}
				</span>
				<hr class="spotlight-item-divider" />
				<span class="spotlight-collection-description">
					<InlineMarkdownText text={collection.description}></InlineMarkdownText>
				</span>
			</a>
		</div>
	</li>
{/snippet}

<div class="panel">
	<PanelHeader>
		{#snippet headerText()}
			spotlight
		{/snippet}
		{#snippet button()}
			<button class="standard" onclick={() => goto(`/collection/${spotlightCollectionId}`)}>
				see all
			</button>
		{/snippet}
	</PanelHeader>
	<ul class="spotlight">
		{#each spotlightCollections as collection}
			{@render spotlightItem(collection)}
		{/each}
	</ul>
</div>

<div class="center">
	<div class="two-column">
		<div class="column-two-thirds">
			<CollectionsList
				panelHeaderText="recently updated collections"
				collections={recentCollections}
				mode="detailed"
				imgMode="trio"
			></CollectionsList>
		</div>

		<div class="column-one-third">
			{#if sessionUserId}
				<Feed {sessionUserId} feedItems={collectionsFeed.feedData} mode="feed" type="collections"
				></Feed>
				<CollectionsList
					panelHeaderText="friends' collections"
					collections={followingUsersCollections}
					mode="succint"
					imgMode="trio"
				></CollectionsList>
			{/if}
		</div>
	</div>
</div>

<style>
	.panel {
		max-width: var(--freq-max-width-primary);
		margin: auto;
		padding: 0;
	}
	/* .two-column {
		max-width: var(--freq-max-width-primary);
		margin: var(--freq-spacing-large) auto;
	} */
	.center {
		margin: 0 auto;
	}
	ul.spotlight {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		width: 100%;
		padding: 0;
		margin: 0;
		padding: 0;
	}
	li.spotlight-item {
		display: flex;
		flex-direction: column;
		width: 100%;
		border-right: var(--freq-border-panel);
	}
	li.spotlight-item:last-child {
		border-right: none;
	}
	.spotlight-item-images {
		margin: var(--freq-spacing-x-small) auto;
	}
	.spotlight-collection-info {
		max-width: inherit;
		hyphens: auto;
		margin: var(--freq-spacing-small);
	}
	span.spotlight-collection-title {
		font-size: var(--freq-font-size-small);
		text-transform: uppercase;
		font-weight: var(--freq-font-weight-medium);
		color: var(--freq-color-text);
		hyphens: auto;
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
	.jumbotron {
		display: flex;
		flex-direction: column;
		max-width: calc(var(--freq-max-width-primary) * 0.5);
		align-items: center;
		gap: var(--freq-spacer-gap-half);
		background-color: black;
		margin: var(--freq-height-spacer-double) auto;
	}
	.jumbotron p {
		font-family: var(--freq-font-mono);
		font-size: var(--freq-font-size-large);
		text-align: center;
		text-shadow:
			-2px 0 50px var(--freq-color-primary),
			0 2px 50px var(--freq-color-primary),
			2px 0 50px var(--freq-color-primary),
			0 -2px 50px var(--freq-color-primary);
	}
	@media screen and (max-width: 770px) {
		.jumbotron {
			gap: var(--freq-spacer-gap-quarter);
			margin: var(--freq-height-spacer) auto var(--freq-height-spacer-double) auto;
		}
		.jumbotron p {
			font-size: var(--freq-font-size-medium);
		}
		ul.spotlight {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-template-rows: minmax(min-content, max-content);
		}
		li.spotlight-item {
			margin-top: 0;
			padding-top: 0;
		}
		li.spotlight-item:nth-last-child(-n + 3) {
			border-top: var(--freq-border-panel);
		}
		.spotlight-collection-info {
			padding-top: 0;
		}
		.spotlight-collection-info .spotlight-collection-title {
			/* word-wrap: break-word; */
			/* word-break: break-all; */
			overflow-wrap: break-word;
			hyphens: auto;
		}
		.spotlight-collection-info .spotlight-collection-owner {
			font-size: var(--freq-font-size-x-small);
		}
		.spotlight-collection-info .spotlight-collection-description {
			margin: var(--freq-spacing-2x-small);
			font-size: var(--freq-font-size-small);
		}
	}
</style>

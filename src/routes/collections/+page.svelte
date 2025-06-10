<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import CollectionsSpotlight from 'src/lib/components/collections/CollectionsSpotlight.svelte';
	import CollectionsList from 'src/lib/components/collections/CollectionsList.svelte';
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


<div class="collections-spotlight-container">
	<PanelHeader>
		{#snippet headerText()}
			spotlight
		{/snippet}
	</PanelHeader>
	<div class="collections-spotlight-content">
		<CollectionsSpotlight collections={form?.collections ?? collections} />
	</div>
</div>

<div class="two-column">
	<div class="column-two-thirds">
		<CollectionsList 
			headerText="recently updated collections"
			collections={form?.collections ?? collections}
			mode="wide"
		></CollectionsList>
	</div>

	<div class="column-one-third">
		<Feed
			sessionUserId={sessionUserId}
			feedItems={feedItems}
			mode="feed"
		></Feed>
		<CollectionsList
			headerText="friends' collections"
			collections={form?.collections ?? collections}
			showAnalytics={false}
			mode="narrow"
		></CollectionsList>
	</div>
</div>


<style>
	.landing-page-body {
	}

	.collections-spotlight-container {
		margin: var(--freq-spacing-large);
		border: var(--freq-border-panel);
	}

	.collections-activity {
		margin: var(--freq-spacing-large);
		max-width: 100%;
		gap: var(--freq-width-spacer);
		display: flex;
		flex-direction: row;
	}

	.popular-collections {
		width: 60%;
		height: auto;
	}

	.collections-feed-friends {
		width: 40%;
		display: flex;
		gap: var(--freq-width-spacer);
		flex-direction: column;
	}

	.collections-spotlight-content {
		height: 20rem;
	}

	.activity-content-window {
		min-height: 15rem;
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

	@media screen and (max-width: 700px) {
		.collections-activity {
			flex-direction: column;
		}

		.popular-collections {
			width: 100%;
		}

		.collections-feed-friends {
			width: 100%;
		}
	}
</style>

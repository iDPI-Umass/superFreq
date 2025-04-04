<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import PanelHeader from '$lib/components/PanelHeader.svelte';
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import CollectionsJumbotron from 'src/lib/components/CollectionsJumbotron.svelte';
	interface Props {
		form: ActionData;
		data: PageData;
	}

	let { form, data }: Props = $props();

	let { collections, remaining, totalCollections, batchSize, batchIterator } = $derived(data);
</script>

<SEO title="Explore collections"></SEO>

<CollectionsJumbotron />

<div class="content landing-page-body">
	<div class="collections-spotlight-container">
		<PanelHeader>
			{#snippet headerText()}
				Collections Spotlight
			{/snippet}
		</PanelHeader>
		<div class="collections-spotlight-content">

		</div>
	</div>

	<div class="collections-activity">
		<div class="activity-panel popular-collections">
			<PanelHeader>
				{#snippet headerText()}
					Popular Collections
				{/snippet}
			</PanelHeader>
			<div class="activity-content-window">

			</div>
		</div>

		<div class="collections-feed-friends">
			<div class="activity-panel" id="collections-feed">
				<PanelHeader>
					{#snippet headerText()}
						Feed
					{/snippet}
				</PanelHeader>
				<div class="activity-content-window">

				</div>
			</div>
			<div class="activity-panel" id="collections-friends">
				<PanelHeader>
					{#snippet headerText()}
						Friends Collections
					{/snippet}
				</PanelHeader>
				<div class="activity-content-window">
					
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.landing-page-body {
		height: auto;
	}

	.collections-spotlight-container {
		margin: var(--freq-spacing-large);
		border: var(--freq-border-panel);
	}

	.collections-activity {
		margin: var(--freq-spacing-large);
		height: 45rem;
		max-width: 100%;
		gap: var(--freq-width-spacer);
		display: flex;
		flex-direction: row;
	}

	.popular-collections {
		width: 60%;
	}

	.collections-feed-friends {
		width: 40%;
		display: flex;
		gap: var(--freq-width-spacer);
		flex-direction: column;
	}

	.collections-spotlight-content {
		height: 15rem;
	}

	.activity-content-window {
		height: 15rem;
	}

	.activity-panel {
		border: var(--freq-border-panel);
		margin: 0;
	}
	
	

	@media screen and (max-width: 600px) {
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

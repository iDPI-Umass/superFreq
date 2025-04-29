<script lang="ts">
	import wave from '$lib/assets/images/logo/freq-wave.svg';
	import CollectionImage from './CollectionImage.svelte';
	import Heart from 'virtual:icons/heroicons-solid/heart';
	import Music from 'virtual:icons/mynaui/music';
	import Eye from 'virtual:icons/teenyicons/eye-outline';

	interface ComponentProps {
		sessionUserId?: string;
		mode?: string;
		remaining?: number;
		collections: App.RowData[];
		showAnalytics?: boolean;
	}

	const handleError = (event: Event & { target: HTMLImageElement }) => {
		event.target.src = wave;
		event.target.onerror = null; // Prevent infinite loop
	};

	let {
		sessionUserId,
		mode,
		remaining,
		collections = [],
		showAnalytics = true
	}: ComponentProps = $props();

	let visible = $state(10);

	let start = $state(0);

	let visibleCollections: App.RowData[] = $derived(collections.slice(start, start + visible));
</script>

{#snippet firehoseItem(collection: App.RowData)}
	<div class="firehose-item-container">
		<div class="firehose-item-info">
			<CollectionImage src={collection.avatar_url} />
			<div class="firehose-item-name">
				<div class="firehose-title-holder">
					<h3>{collection.title}</h3>
				</div>
				<span>By {collection.display_name}</span>
			</div>
		</div>
		<div class="firehose-item-actions">
			<div class="firehose-item-button">
				<button class="double-border-top">
					<div class="inner-border">Follow</div>
				</button>
			</div>
			{#if showAnalytics}
				<div class="firehose-item-analytics">
					<div class="profile-stats-box" aria-label="user metrics">
						<div class="metric" aria-label="metric">
							<div class="metrics">
								<div class="numeral">
									<p class="metric-numerals">0</p>
								</div>
								<div class="icon">
									<Music />
								</div>
							</div>
						</div>
						<div class="metric" aria-label="metric">
							<div class="metrics">
								<div class="numeral">
									<p class="metric-numerals">0</p>
								</div>
								<div class="icon">
									<Heart />
								</div>
							</div>
						</div>
						<div class="metric" aria-label="metric">
							<div class="metrics">
								<div class="numeral">
									<p class="metric-numerals">0</p>
								</div>
								<div class="icon">
									<Eye />
								</div>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/snippet}

<div class="firehose-wrapper">
	{#each visibleCollections as collection}
		{@render firehoseItem(collection)}
	{/each}
	<div class="load-button-container">
		<button class="standard"> load more </button>
	</div>
</div>

<style>
	.firehose-wrapper {
		height: max-content;
		padding: 2px;
		display: flex;
		flex-direction: column;
	}

	.firehose-item-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 80px;
		max-height: 80px;
		padding: 4px;
		border-bottom: var(--freq-border-panel);
	}

	.firehose-item-info {
		display: flex;
		width: 50%;
		gap: 5px;
	}

	.firehose-item-actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		width: 50%
	}

	.firehose-item-name {
		display: flex;
		text-overflow: ellipsis;
		flex-direction: column;
		align-items: start;
		justify-content: start;
		overflow: hidden;
	}

	.firehose-title-holder {
		max-height: 4rem;
	}

	.firehose-item-name:hover {
		color: var(--freq-color-primary);
	}

	.firehose-item-analytics {
		display: flex;
		flex-direction: row;
		gap: 2rem;
	}

	h3 {
		font-size: smaller;
	}

	.icon {
		display: flex;
		margin-top: 0.2rem;
		align-items: center;
		justify-content: center;
		color: var(--freq-color-mellow);
	}

	.load-button-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	@media screen and (max-width: 1000px) {
		
	}

	
</style>

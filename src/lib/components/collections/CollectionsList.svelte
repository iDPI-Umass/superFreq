<script lang="ts">
	import { displayDate } from '$lib/resources/parseData'
	import wave from '$lib/assets/images/logo/freq-wave.svg';
	import CollectionImage from './CollectionImage.svelte';
	import Heart from '@lucide/svelte/icons/heart';
	import MusicNote from '@lucide/svelte/icons/music';
	import Eye from '@lucide/svelte/icons/eye';
	import { Tooltip } from "bits-ui";


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
		showAnalytics = false
	}: ComponentProps = $props();

	let visible = $state(10);

	let start = $state(0);

	let visibleCollections: App.RowData[] = $derived(collections.slice(start, start + visible));
</script>

{#snippet listItem(collection: App.RowData)}
	<li class="firehose-item-container">
		<CollectionImage src={collection.avatar_url} />
		<a href="/collection/{collection.collection_id}">
			<h3>{collection.title}</h3>
		</a>
		<div class="collection-info-attribution">
			<p class="collection-info-text">
				Collection by 
				<a href="/user/{collection.username}">
					{collection.display_name}
				</a>
			</p>
			<p class="collection-date-text">Last updated on {displayDate(collection.updated_at)}</p>
		</div>
		<!-- <div class="firehose-item-actions">
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
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger style="cursor: pointer; display: flex; justify-content: center; align-items: center; width: 100%; background: transparent;">
											 <MusicNote size="16" color="var(--freq-color-text-medium-dark)"></MusicNote>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content>
												<Tooltip.Arrow />
												<div class="icon-tooltip-content">
													<MusicNote size="16" color="var(--freq-color-text-medium-dark)"></MusicNote>
													This is the number of albums or tracks in this collection.
												</div>
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								</Tooltip.Provider>
								
							</div>
						</div>
						<div class="metric" aria-label="metric">
							<div class="metrics">
								<div class="numeral">
									<p class="metric-numerals">0</p>
								</div>
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger style="cursor: pointer; display: flex; justify-content: center; align-items: center; width: 100%; background: transparent;">
											<Heart size="16" color="var(--freq-color-text-medium-dark)"></Heart>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content>
												<Tooltip.Arrow />
												<div class="icon-tooltip-content">
													<Heart />
													This is the number of users following this collection.
												</div>
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								</Tooltip.Provider>
								
							</div>
						</div>
						<div class="metric" aria-label="metric">
							<div class="metrics">
								<div class="numeral">
									<p class="metric-numerals">0</p>
								</div>
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger style="cursor: pointer; display: flex; justify-content: center; align-items: center; width: 100%; background: transparent;">
											<Eye size="16" color="var(--freq-color-text-medium-dark)"></Eye>
										</Tooltip.Trigger>
										<Tooltip.Portal>
											<Tooltip.Content>
												<Tooltip.Arrow />
												<div class="icon-tooltip-content">
													<Eye size="16" color="var(--freq-color-text-medium-dark)"></Eye>
													This is the number of views this collection has recieved in the past 24 hours.
												</div>
											</Tooltip.Content>
										</Tooltip.Portal>
									</Tooltip.Root>
								</Tooltip.Provider>
							</div>
						</div>
					</div>
				</div>
			{/if}
		</div> -->
	</li>
{/snippet}

<div class="firehose-wrapper">
	<ul>
		{#each visibleCollections as collection}
			{@render listItem(collection)}
		{/each}
	</ul>
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
		cursor: pointer;
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
		margin-top: 0.4rem;
		align-items: center;
		justify-content: center;
		color: var(--freq-color-mellow);
	}

	.load-button-container {
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.icon-tooltip-content {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		padding: 11px;
		border: var(--freq-border-panel);
		gap: 4px;
		border-radius: 10px;
		background-color: var(--freq-color-panel-background);
	}

	@media screen and (max-width: 1000px) {
		
	}

	
</style>

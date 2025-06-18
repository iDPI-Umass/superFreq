<script lang="ts">
	import wave from '$lib/assets/images/logo/freq-wave.svg';
	import CollectionImage from './CollectionImage.svelte';
	import CollectionImageTrio from './CollectionImageTrio.svelte';
	import { onMount } from 'svelte';

	interface ComponentProps {
		sessionUserId?: string;
		mode?: string;
		remaining?: number;
		collections: App.RowData[];
	}

	let { sessionUserId, mode, remaining, collections = [] }: ComponentProps = $props();

	let visible = $state(5);

	let start = $state(0);

	const next = () => {
		if (!(start + visible >= collections.length)) {
			start = Math.min(collections.length - visible, start + visible);
		}
	};

	const back = () => {
		start = Math.max(0, start - visible);
	};

	function checkItemsVisible() {
		const width = window.innerWidth;
		if (width > 1000) {
			return 5;
		} else {
			return 3;
		}
	}

	onMount(() => {
		const updateVisible = () => {
			visible = checkItemsVisible();
		};

		updateVisible();

		window.addEventListener('resize', updateVisible);

		return () => {
			window.removeEventListener('resize', updateVisible);
		};
	});

	let visibleCollections: App.RowData[] = $derived(collections.slice(start, start + visible));
</script>

{#snippet spotlightItem(collection: App.RowData)}
	<div class="spotlight-item">
		<CollectionImageTrio 
			imgUrl={collection.avatar_url}
			orientation='column'
		></CollectionImageTrio>
		<div class="spotlight-collection-info">
			<div class="spotlight-collection-info-text">
				<h3>{collection.title}</h3>
				<span>By {collection.display_name}</span>
			</div>
			<div class="spotlight-latest-update">
				<span>Last Updated: 2d</span>
			</div>
		</div>
	</div>
{/snippet}

<div class="collections-spotlight-wrapper">
	<div class="spotlight-control">
		<button
			class="double-border-top spotlight-control-button"
			onclick={back}
			disabled={start === 0}
		>
			<h4>{'<'}</h4>
		</button>
	</div>
	<div class="spotlight-content">
		{#each visibleCollections as collection}
			{@render spotlightItem(collection)}
		{/each}
	</div>
	<div class="spotlight-control">
		<button
			class="double-border-top spotlight-control-button"
			onclick={next}
			disabled={start + visible >= collections.length}
		>
			<h4>{'>'}</h4>
		</button>
	</div>
</div>

<style>
	.collections-spotlight-wrapper {
		height: 100%;
		display: flex;
	}

	.spotlight-control {
		height: 100%;
		display: flex;
		position: relative;
	}

	.spotlight-control-button {
		width: 2rem;
		height: 100%;
	}

	.spotlight-content {
		width: 100%;
		display: grid;
		grid-auto-flow: column;
		grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
	}

	.spotlight-item {
		display: flex;
		flex-direction: column;
	}

	.spotlight-collection-info {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: center;
		align-items: center;
		padding: 0.5rem;
	}

	.spotlight-latest-update {
		max-width: 100%;
	}

	.spotlight-collection-info-text {
		max-width: 100%;
	}

	.spotlight-latest-update > span {
		font-size: medium;
	}

	.spotlight-collection-info-text > h3 {
		font-size: medium;
	}

	.spotlight-collection-info-text > h3:hover {
		color: var(--freq-color-primary);
		cursor: pointer;
		font-size: medium;
	}

	.spotlight-collection-info-text > span {
		font-size: medium;
	}

	@media screen and (max-width: 1000px) {
		.spotlight-collection-info-text > h3 {
			font-size: x-small;
		}

		.spotlight-collection-info-text > span {
			font-size: xx-small;
		}

		.spotlight-latest-update > span {
			font-size: xx-small;
		}
	}
</style>

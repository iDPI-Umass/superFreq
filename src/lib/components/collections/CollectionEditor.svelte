<script lang="ts">
	import { enhance } from '$app/forms';
	import GridList from 'src/lib/components/collections/GridList.svelte';
	import MusicBrainzSearch from 'src/lib/components/Search/MusicBrainzSearch.svelte';
	import GlobalSearch from 'src/lib/components/Search/GlobalSearch.svelte';
	import ManualAddModal from '$lib/components/modals/ManualAddModal.svelte';
	import CollectionItemTag from 'src/lib/components/collections/CollectionItemTag.svelte';
	import { collectionData, searchResults } from '$lib/resources/states.svelte';

	interface ComponentProps {
		mode?: string | null;
		limit?: string | null;
	}

	let {
		mode = '', // artists || release_groups || recordings
		limit
	}: ComponentProps = $props();

	const categoryLookup: { [index: string]: string } = {
		'': '...',
		artist: 'artists',
		artists: 'artists',
		release_group: 'albums',
		release_groups: 'albums',
		recording: 'tracks',
		recordings: 'tracks',
		episode: 'episode',
		mix: 'episode'
	};

	function searchButtonLabel(lookup: string) {
		if (!lookup) {
			return '...';
		} else return lookup;
	}

	let itemType = $state(mode ?? '') as string;

	let itemLookup = {
		'': 'item',
		artist: 'artist',
		artists: 'artist',
		release_group: 'album',
		release_groups: 'album',
		recording: 'track',
		recordings: 'track',
		episode: 'episode or mix',
		episodes: 'episode or mix'
	} as any;

	let searchCategoryLookup = {
		'': '',
		artist: 'artists',
		artists: 'artists',
		album: 'release_groups',
		albums: 'release_groups',
		release_group: 'release_groups',
		release_groups: 'release_groups',
		track: 'recordings',
		tracks: 'recordings',
		recording: 'recordings',
		recordings: 'recordings',
		episode: 'episode',
		episodes: 'episode',
		mix: 'episode',
		mixes: 'episode',
		collection: 'collection',
		collections: 'collection'
	} as any;

	let showManualAddModal = $state(false);
</script>

<div class="collection-search">
	{#if !mode?.includes('artist') && !mode?.includes('release_group') && !mode?.includes('recording')}
		<div class="form-column">
			<fieldset class="search">
				<legend>
					Add <CollectionItemTag itemType={searchCategoryLookup[itemType]}></CollectionItemTag> to your
					collection
				</legend>
				<ul>
					<li>
						<input
							class="radio"
							type="radio"
							name="item-type"
							id="artist"
							value="artist"
							bind:group={itemType}
						/>
						<label for="artist"> artist </label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="item-type"
							id="release_group"
							value="release_group"
							bind:group={itemType}
						/>
						<label for="release_group"> album </label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="item-type"
							id="recording"
							value="recording"
							bind:group={itemType}
						/>
						<label for="recording"> track </label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="item-type"
							id="episode"
							value="episode"
							bind:group={itemType}
						/>
						<label for="episode"> Episode / DJ Mix </label>
					</li>
					<li>
						<input
							class="radio"
							type="radio"
							name="item-type"
							id="collection"
							value="collection"
							bind:group={itemType}
						/>
						<label for="collection"> collection </label>
					</li>
				</ul>
			</fieldset>
		</div>
	{/if}
	<div class="form-column">
		{#if itemType == 'artist' || itemType == 'release_group' || itemType == 'recording'}
			<div class="collection-search-bar">
				<span class="search-tooltip">
					search for <em>{itemLookup[itemType]}</em> to add info automatically
				</span>
				<MusicBrainzSearch
					searchCategory={searchCategoryLookup[itemType]}
					{limit}
					searchButtonText={`search ${categoryLookup[itemType]}`}
					searchPlaceholder={`search ${categoryLookup[itemType]}`}
					mode="collection"
				></MusicBrainzSearch>
			</div>
			<span class="or">— or —</span>
		{/if}
		{#if itemType && itemType != 'collection'}
			<span class="search-tooltip">
				add <em>{itemLookup[itemType]}</em> info yourself
			</span>
			<ManualAddModal bind:showModal={showManualAddModal} {itemType}>
				{#snippet headerText()}
					manually add {itemLookup[itemType]}
				{/snippet}
			</ManualAddModal>
			<div class="manual-add-button">
				<button
					class="double-border-top"
					onclick={() => (showManualAddModal = true)}
					disabled={itemType == ''}
				>
					<div class="inner-border">
						Add {itemLookup[itemType]} manually
					</div>
				</button>
			</div>
		{:else if itemType == 'collection'}
			<GlobalSearch
				searchCategory="collection"
				searchButtonText="search"
				searchPlaceholder="search collections"
				mode="collection"
				results={searchResults.results}
				resultsCategory={searchResults.category}
				collectionEditor={true}
			></GlobalSearch>
		{/if}
	</div>
</div>
<div class="bottom-double-border"></div>
<GridList
	collectionType={collectionData.type}
	collectionStatus={collectionData.status}
	layout="list"
	mode="edit"
></GridList>

<style>
	fieldset.search {
		margin: 0;
	}
	.form-column {
		margin: var(--freq-spacing-2x-small) 0;
	}
	span.or {
		font-family: 'Krona_One', monospace;
		margin: var(--freq-spacing-medium) auto;
	}
	.manual-add-button {
		margin: var(--freq-spacing-2x-small) 0;
	}
</style>

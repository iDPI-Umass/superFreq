<script lang="ts">
	import { enhance } from '$app/forms'
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { mbSearch, addCollectionItemNoImg, getCoverArt, addSingleItemNoImg, mbidCateogory, artistName, artistMbid, releaseGroupName, releaseGroupMbid, releaseGroupMetadata, recordingName, itemDate, artistOrigin } from '$lib/resources/musicbrainz'
	import CoverArt from './CoverArt.svelte';

	interface ComponentProps {
		searchCategory: string
		searchButtonText: string
		searchPlaceholder: string
		addedItems: any
		deletedItems?: App.RowData[]
		newItemAdded: boolean,
		mode: string,
		limit?: string,
		query?: string,
		imgPromise?: any
	}

	let {
		searchCategory, // "artists" | "release_groups" | "releases" | "recordings" | "labels"
		searchButtonText,
		searchPlaceholder,
		addedItems = $bindable([]),
		deletedItems = $bindable([]),
		newItemAdded = $bindable(false),
		mode, // "single" | "collection" | "avatar-search"
		limit = '25',
		query = '',
		imgPromise = $bindable(null)
	}: ComponentProps = $props()

	let showModal = $state(false)
	let addingItem = $state(false)

	let mbData = $state([]) as any[]
	let searchComplete = $state(false)

	async function search ( query: string, searchCategory: string, limit: string ) {
		mbData = []
		showModal = true
		const searchResults = await mbSearch(query, searchCategory, limit)
		mbData = searchResults.mbData
		searchComplete = searchResults.searchComplete
		return { mbData, searchComplete, showModal }
	}

	const searchCategories = ['artists', 'release_groups', 'recordings']

	const mbidCategory = mbidCateogory( searchCategory )
	
	// Get album art and handle promise for CoverArt component
	async function addItem ( mode: string, item: App.RowData ) {
		addingItem = true
		if ( mode == 'single' ) {
			const singleItem = await addSingleItemNoImg( item, addedItems, searchCategory )
			addedItems = singleItem.addedItems
			query = ""
			searchComplete = false
			newItemAdded = true
			showModal = false
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const releaseGroup = {
					release_group_mbid: releaseGroupMbid(searchCategory, item),
					artist_name: artistName(searchCategory, item),
					release_group_name: releaseGroupName(searchCategory, item)
				}
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				addedItems["img_url"] = success ? coverArtArchiveUrl : null
				addedItems["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				imgPromise = new Promise ((resolve) => resolve(success)) 
			}
			addingItem = false
			return { addedItems, query, searchComplete, newItemAdded, showModal }
		}
		if ( mode == 'collection' ) {
			const collectionItems = await addCollectionItemNoImg( item, addedItems, deletedItems, limit, searchCategory, mbidCategory )
			addedItems = collectionItems.addedItems
			deletedItems = collectionItems.deletedItems
			query = ""
			searchComplete = false
			newItemAdded = collectionItems.newItemAdded
			showModal = false
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const releaseGroup = releaseGroupMetadata( searchCategory, item )
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				const thisItemIndex = addedItems.findIndex((item) => item['release_group_mbid'] == releaseGroup.release_group_mbid)
				addedItems[thisItemIndex]["img_url"] = success ? coverArtArchiveUrl : null
				addedItems[thisItemIndex]["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				imgPromise = new Promise ((resolve) => resolve(success))
			}
			addingItem = false
			return { addedItems, deletedItems, query, searchComplete, newItemAdded, showModal, imgPromise }
		}
	}

	function coverArtItem( searchItem: any, searchCategory: string ) {
		const item = {
			'artist_name': artistName(searchCategory, searchItem),
			'release_group_name': releaseGroupName(searchCategory, searchItem),
			'artist_mbid': artistMbid(searchCategory, searchItem),
			'release_group_mbid': releaseGroupMbid(searchCategory, searchItem)
		}
		return item
	}
</script>

<!-- <svelte:options runes={true} /> -->

<div class="search-bar">
	<ListModal bind:showModal>
		{#snippet headerText()}
			{#if !query}
			Please enter valid input in the search bar.
			{:else if query && !searchComplete}
			Loading...
			{:else if query && searchComplete}
			Results for <span class="dialog-header">{query}</span>
			{/if}
		{/snippet}
		{#snippet list()}
			<div>
				{#if searchComplete}
					<ol class="list-modal">
						{#each mbData as item}
						<li class="list-modal">
							<div class="list-modal-li-row">
								<div class="list-modal-li-row-button-spacing">
									<button 
										class="add"
										aria-label="add item"
										onclick={() => {
											addItem(mode, item)
											}}
										disabled={addingItem}
					
									>
										+ add
									</button>
								</div>
								{#if searchCategory == "artists"}
									<span class="list-modal">
										<span class="list-modal-bold">
											{artistName(searchCategory, item)}
										</span>
										<br />
										{artistOrigin(searchCategory, item)}
										<br /> 
										{itemDate(searchCategory, item)}
									</span>
								{:else if searchCategory == "release_groups"}
									<span class="list-modal">
										<span class="list-modal-bold" >
											{releaseGroupName(searchCategory, item)}
										</span>  
										by 
										{artistName(searchCategory, item)}
										<br /> 
										{itemDate(searchCategory, item)}
									</span>
								{:else if searchCategory == "recordings"}
									<span class="list-modal">
										<span class="list-modal-bold">
											{recordingName(searchCategory, item)}
										</span> 
										by 
										{artistName(searchCategory, item)}
										<br />
										{releaseGroupName(searchCategory, item)}
									</span>
								{/if}
							</div>
							{#if searchCategory == "release_groups" || searchCategory == "recordings"}
								<div class="result-image">
									<CoverArt
										item={coverArtItem(item, searchCategory)}
										altText='album {releaseGroupName(searchCategory, item)} by artist {artistName(searchCategory, item)}'
									></CoverArt>
								</div>
							{/if}
						</li>
						{/each}
					</ol>
				{/if}
			</div>
		{/snippet}
	</ListModal>
	<form class="search">
		<button 
			class="double-border-top"
			onclick={() => search(query, searchCategory, limit)} 
			disabled={!searchCategory || !searchCategories.includes(searchCategory)}
		>
			<div class="inner-border">
				{searchButtonText}
			</div>
		</button>
		<div class="input-sizing">
			<input
				class="search" 
				type="search" 
				id="searchQuery" 
				name="query" 
				placeholder={searchPlaceholder}
				aria-label={searchPlaceholder}
				size="40" 
				bind:value={query}
			/>
		</div>
	</form>
</div>

<style>
	.search-layout {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
    .search-bar {
        display: flex;
        flex-direction: row;
		height: fit-content;
        gap: 0;
        align-items: center;
    }
	span.dialog-header {
		text-transform: uppercase;
	}
	.input-sizing {
		max-width: 100%;
	}
	.result-image {
		width: 100px;
		margin-left: auto;
		margin-right: 0;
	}
	@media screen and (max-width: 600px) {
		form.search {
			display: flex;
			flex-wrap: wrap-reverse;
			align-items: start;
		}
        /* .search-bar * {
            flex-direction: column;
			align-items: start;
        } */
    }
</style>
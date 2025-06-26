<script lang="ts">
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { mbSearch, addCollectionItemNoImg, getCoverArt, addSingleItemNoImg, mbidCateogory, artistName, artistMbid, releaseGroupName, releaseGroupMbid, releaseGroupMetadata, recordingName, itemDate, artistOrigin, getArtistImage } from '$lib/resources/musicbrainz'
	import CoverArt from '../layout/CoverArt.svelte'

    import { promiseStates, collectionData } from '$lib/resources/states.svelte';

	interface ComponentProps {
		searchCategory: string
		searchButtonText: string
		searchPlaceholder: string
		mode: string,
		searchResultsLimit?: string,
		query?: string,
		collectionLimit?: string | null,
		continuePromise? : boolean
	}

	let {
		searchCategory, // "artists" | "release_groups" | "releases" | "recordings" | "labels"
		searchButtonText,
		searchPlaceholder,
		mode, // "single" | "collection" | "avatar-search"
		searchResultsLimit = '5',
		query = '',
		collectionLimit = null,
		continuePromise = $bindable(true)
	}: ComponentProps = $props()

	let showModal = $state(false)
	let addingItem = $state(false)

	let searchData = $state([]) as any[]
	let searchComplete = $state(false)

	async function search ( query: string, searchCategory: string, searchResultsLimit: string ) {
		promiseStates.newItemAdded = false
		searchData = []
		showModal = true
		const searchResults = await mbSearch(query, searchCategory, searchResultsLimit)
		searchData = searchResults.mbData
		searchComplete = searchResults.searchComplete
		return { searchData, searchComplete, showModal }
	}

	const searchCategories = ['artists', 'release_groups', 'recordings']

	const mbidCategory = mbidCateogory( searchCategory )
	
	// Get album art and handle promise for CoverArt component
	async function addItem ( mode: string, item: App.RowData ) {
		addingItem = true
		if ( mode == 'single' ) {
			const singleItem = await addSingleItemNoImg( item, collectionData.singleItem, searchCategory )
			collectionData.singleItem = singleItem.singleItem
			query = ""
			searchComplete = false
			promiseStates.newItemAdded = true
			promiseStates.continueClientSideImgPromise = false
			showModal = false
			addingItem = false
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const releaseGroup = {
					release_group_mbid: releaseGroupMbid(searchCategory, item),
					artist_name: artistName(searchCategory, item),
					artist_mbid: artistMbid(searchCategory, item),
					release_group_name: releaseGroupName(searchCategory, item)
				}
				const artistImgUrl = await getArtistImage(releaseGroup.artist_mbid)
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				collectionData.collectionItems[thisItemIndex]["artist_discogs_img_url"] = artistImgUrl
				collectionData.singleItem['img_url'] = success ? coverArtArchiveUrl : null
				collectionData.singleItem["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				promiseStates.imgPromise = new Promise ((resolve) => resolve(success)) 
			}
			else if ( searchCategory == "artists" ) {
				const thisArtistMbid = artistMbid(searchCategory, item)
				const artistImgUrl = await getArtistImage(thisArtistMbid)
				const thisItemIndex = collectionData.collectionItems.findIndex((item) => item['artist_mbid'] == thisArtistMbid)
				collectionData.collectionItems[thisItemIndex]["artist_discogs_img_url"] = artistImgUrl
				promiseStates.imgPromise = new Promise ((resolve) => resolve(success))
			}
			promiseStates.continueClientSideImgPromise = true
			return { query, searchComplete, showModal }
		}
		if ( mode == 'collection' ) {
			promiseStates.continueClientSideImgPromise = false
			const collectionItems = await addCollectionItemNoImg( item, collectionData.collectionItems, collectionData.deletedItems, collectionLimit, searchCategory, mbidCategory )
			collectionData.collectionItems = collectionItems.addedItems
			collectionData.deletedItems = collectionItems.deletedItems
			query = ""
			searchComplete = false
			promiseStates.newItemAdded = collectionItems.newItemAdded
			showModal = false
			addingItem = false
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const thisArtistMbid = artistMbid(searchCategory, item)
				const artistImgUrl = await getArtistImage(thisArtistMbid)
				const releaseGroup = releaseGroupMetadata( searchCategory, item )
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				const thisItemIndex = collectionData.collectionItems.findIndex((item) => item['release_group_mbid'] == releaseGroup.release_group_mbid)
				collectionData.collectionItems[thisItemIndex]["artist_discogs_img_url"] = artistImgUrl
				collectionData.collectionItems[thisItemIndex]["img_url"] = success ? coverArtArchiveUrl : null
				collectionData.collectionItems[thisItemIndex]["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				promiseStates.imgPromise = new Promise ((resolve) => resolve(success))
			}
			else if ( searchCategory == "artists" ) {
				const thisArtistMbid = artistMbid(searchCategory, item)
				const artistImgUrl = await getArtistImage(thisArtistMbid)
				const thisItemIndex = collectionData.collectionItems.findIndex((item) => item['artist_mbid'] == thisArtistMbid)
				collectionData.collectionItems[thisItemIndex]["artist_discogs_img_url"] = artistImgUrl
				promiseStates.imgPromise = new Promise ((resolve) => resolve(success))
			}
			promiseStates.continueClientSideImgPromise = true
			return { query, searchComplete, showModal }
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
						{#each searchData as item}
						<li class="list-modal">
							<div class="list-modal-li-row">
								<div class="list-modal-li-row-button-spacing">
									<button 
										class="add"
										aria-label="add item"
										onclick={() => {
											continuePromise = false
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
										imgClass="result-image"
										clientSideLoad={true}
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
			onclick={() => search(query, searchCategory, searchResultsLimit)} 
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
	@media screen and (max-width: 770px) {
		form.search {
			display: flex;
			flex-wrap: wrap-reverse;
			align-items: start;
		}
    }
</style>
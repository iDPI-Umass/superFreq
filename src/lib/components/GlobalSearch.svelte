<script lang="ts">
    import { enhance } from '$app/forms'
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { mbSearch, addCollectionItemNoImg, getCoverArt, addSingleItemNoImg, mbidCateogory, artistName, artistMbid, releaseGroupName, releaseGroupMbid, releaseGroupMetadata, recordingName, itemDate, artistOrigin } from '$lib/resources/musicbrainz'
    import { searchResults, collectionData } from '$lib/resources/states.svelte'

	interface ComponentProps {
		searchCategories: string[]
		searchButtonText: string
		searchPlaceholder: string
		mode: string,
		limit?: string | null,
		query?: string,
	}

	let {
		searchCategories, // array with any of these items: ['collections', 'users']
		searchButtonText,
		searchPlaceholder,
		mode, // "search", "collection"
		limit = '25',
		query = '',
	}: ComponentProps = $props()

	let showModal = $state(false)
	let addingItem = $state(false)

	let mbData = $state([]) as any[]
    let loading = $state(false)

    let searchComplete = $derived( searchResults.collections.length > 0 ? true : false )

    async function addCollectionItem ( mode: string, item: App.RowData ) {
    if ( mode == 'collection' ) {
			promiseStates.continueClientSideImgPromise = false
			const collectionItems = await addCollectionItemNoImg( item, collectionData.collectionItems, collectionData.deletedItems, limit, searchCategory, mbidCategory )
			collectionData.collectionItems = collectionItems.addedItems
			collectionData.deletedItems = collectionItems.deletedItems
			query = ""
            searchResults.collections = []
			showModal = false
			addingItem = false
			return { query, searchComplete, showModal }
		}
    }
</script>

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
											addCollectionItem(mode, item)
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
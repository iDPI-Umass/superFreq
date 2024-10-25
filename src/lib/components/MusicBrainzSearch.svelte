<!-- Need to improve image placeholder in GridList using a promise created in this component -->

<script lang="ts">
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { mbSearch, addCollectionItem, addCollectionItemNoImg, getCoverArt, addSingleItem, mbidCateogory } from '$lib/resources/musicbrainz'
	import { imgPromiseStore } from '$lib/stores'
	import imgNotFound from "$lib/assets/images/image-not-found.png"

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
		addedItems = $bindable(),
		deletedItems = $bindable([]),
		newItemAdded = $bindable(),
		mode, // "single" | "collection"
		limit = '25',
		query = '',
		imgPromise = $bindable(null)
	}: ComponentProps = $props()

	let showModal = $state(false)

	let mbData = $state([]) as any[]
	let searchComplete = $state(false)

	const mbidCategory = mbidCateogory( searchCategory )

	async function search ( query: string, searchCategory: string, limit: string ) {
		mbData = []
		showModal = true
		const searchResults = await mbSearch(query, searchCategory, limit)
		mbData = searchResults.mbData
		searchComplete = searchResults.searchComplete
		return { mbData, searchComplete, showModal }
	}
	
	// Attempting to create promise for await block with cover image in GridList component, still working on it.
	async function addItem ( mode: string, item: App.RowData ) {
		if ( mode == 'single' ) {
			const singleItem = await addSingleItem( item, addedItems, searchCategory )
			addedItems = singleItem.addedItems
			query = ""
			searchComplete = false
			newItemAdded = true
			showModal = false
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const releaseGroup = {
					mbid: item["id"] ?? item["releases"][0]["release-group"]["id"],
					artistName: item["artist-credit"][0]["artist"]["name"] ?? item["artist-credit"][0]["artist"]["name"],
					releaseGroupName: item["title"] ?? item["releases"][0]["release-group"]["title"]
				}
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				addedItems["img_url"] = success ? coverArtArchiveUrl : null
				addedItems["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				imgPromise = new Promise ((resolve) => resolve(success)) 
			}
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
				const releaseGroup = {
					mbid: item["id"] ?? item["releases"][0]["release-group"]["id"],
					artistName: item["artist-credit"][0]["artist"]["name"] ?? item["artist-credit"][0]["artist"]["name"],
					releaseGroupName: item["title"] ?? item["releases"][0]["release-group"]["title"]
				}
				const { success, coverArtArchiveUrl, lastFmCoverArtUrl } = await getCoverArt(releaseGroup)
				const thisItemIndex = addedItems.findIndex((item) => item['release_group_mbid'] == releaseGroup.mbid)
				addedItems[thisItemIndex]["img_url"] = success ? coverArtArchiveUrl : null
				addedItems[thisItemIndex]["last_fm_img_url"] = success ? lastFmCoverArtUrl : null
				imgPromise = new Promise ((resolve) => resolve(success))
			}
			return { addedItems, deletedItems, query, searchComplete, newItemAdded, showModal, imgPromise }
		}
	}
</script>

<svelte:options runes={true} />

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
				<ol>
					{#each mbData as item}
					<li>
						<button 
							class="standard"
							aria-label="add item"
							onclick={() => addItem(mode, item)}
		
						>
							+ add
						</button>
						<p>
						{#if searchCategory == "artists"}
							<span>{item["name"] ?? ''}</span>
							({item["area"] ? item["area"]["name"] : ''}, 
							{item["life-span"] ? item["life-span"]["begin"] : ''})
						{:else if searchCategory == "release_groups"}
							<span >{item["title"] ?? '0'}</span>  by 
							{item["artist-credit"][0]["artist"]["name"] ?? ''} 
							({item["first-release-date"] ?? ''})
						{:else if searchCategory == "recordings"}
							<span>{item["title"] ?? ''}</span> by 
							{item["artist-credit"][0]["artist"]["name"] ?? ''} 
							({item["releases"] ? item["releases"][0]["release-group"]["title"] : ''})
						{/if}
						</p>
						<!-- {#if avatarSearch}
							<img class="thumbnail" src={item["img_url"]} />
						{/if} -->
					</li>
					<hr />
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
			
			disabled={!(searchCategory)}
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
	button.standard {
		width: 60px;
		padding-left: 2px;
		padding-right: 2px;
	}
    ol {
		padding: 0;
        list-style: none;
		font-size: var(--freq-font-size-small);

    }
	li {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: var(--freq-spacing-2x-small);
	}
    li span {
		font-size: var(--freq-font-size-medium);
        font-weight: var(--freq-font-weight-medium);
    }
	li p {
		margin: 0 calc( var(--freq-inline-gap) * 2 );
	}
	img {
		width: var(--freq-image-thumbnail-small);
		margin-right: 1%;
	}

	@media screen and (max-width: 600px) {
        .search-bar * {
            flex-direction: column;
			align-items: start;
        }
    }
</style>
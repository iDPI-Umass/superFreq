<!-- Need to improve image placeholder in GridList using a promise created in this component -->

<script lang="ts">
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { mbSearch, addCollectionItem, addCollectionItemNoImg, addSingleItem, mbidCateogory } from '$lib/resources/musicbrainz'
	import { imgPromiseStore } from '$lib/stores'
	import imgNotFound from "$lib/assets/images/image-not-found.png"

	export let searchCategory: string // "artists" | "release_groups" | "releases" | "recordings" | "labels"
    export let searchButtonText: string
    export let searchPlaceholder: string
    export let addedItems: any
	export let deletedItems: App.RowData[] = []
    export let newItemAdded = false
	export let mode: string // "single" | "collection"
	export let limit = '25'
	export let query = ''
	export let avatarSearch = false
	export let imgPromise: any = null

	$: imgPromise

	let showModal = false

	$: deletedItems
	$: addedItems
	let mbData = [] as any[]
	let searchComplete = false

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

			// let coverImg: string | null = null
			if ( searchCategory == "release_groups" || searchCategory == "recordings" ) {
				const release_group_mbid = item["id"] ?? item["releases"][0]["release-group"]["id"]
				console.log(release_group_mbid)
				const { success, coverArtUrl } = await getCoverArt(release_group_mbid)
				const thisItemIndex = addedItems.findIndex((item) => item['release_group_mbid'] == release_group_mbid)
				addedItems[thisItemIndex]["img_url"] = success ? coverArtUrl : null
				imgPromise = new Promise ((resolve) => resolve(coverArtUrl)) 
			}
			return { addedItems, deletedItems, query, searchComplete, newItemAdded, showModal, imgPromise }
		}
	}

    // API call to Cover Art Archive using releaseMbid returned by getLabel()
    async function getCoverArt ( release_group_mbid: string ) {
		try {
			const endpoint = `https://coverartarchive.org/release-group/${release_group_mbid}/front`;

			const res = await fetch(endpoint);
			const coverArtUrl = res["url"]
			return  { coverArtUrl, success: true }
		}
		catch ( error ) {
			return { coverArtUrl: null, success: false }
		}


    }
</script>

<div class="search-bar">
	<ListModal bind:showModal>
		<h1 slot="header-text">
			{#if !query}
			Please enter valid input in the search bar.
			{:else if query && !searchComplete}
			Loading...
			{:else if query && searchComplete}
			Results for <span class="dialog-header">{query}</span>
			{/if}
		</h1>
		<div slot="list">
			{#if searchComplete}
				<ol>
					{#each mbData as item}
					<li>
						<button 
							class="standard"
							aria-label="add item"
							on:click|preventDefault={() => addItem(mode, item)}
		
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
	</ListModal>
	<form class="search">
		<button 
			class="double-border-top"
			on:click={() => search(query, searchCategory, limit)} 
			
			disabled={!(searchCategory)}
		>
			<div class="inner-border">
				{searchButtonText}
			</div>
		</button>
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
	</form>
</div>

<style>
    .search-bar {
        display: flex;
        flex-direction: row;
		height: fit-content;
		width: inherit;
        gap: 0;
        align-items: center;
    }
    .search-bar button{
        width: auto;
    }
	span.dialog-header {
		text-transform: uppercase;
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
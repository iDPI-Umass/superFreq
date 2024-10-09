<!--
	Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.

	All of this is done on the client side.
-->

<script lang="ts">
    import { goto } from '$app/navigation'
    import { username } from '$lib/resources/localStorage.ts'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

	export let data
	let { collectionContents, deletedCollectionContents } =  data
	$: ({ collectionContents, deletedCollectionContents } =  data)

	let collectionType = "release_groups"

	let imgPromise
    $: imgPromise


	let collectionItems = collectionContents ? collectionContents : [] as App.RowData[]
	$: collectionItems

	let deletedItems = deletedCollectionContents ? deletedCollectionContents : [] as App.RowData[]
	$: deletedItems

	console.log(deletedItems)
	let itemAdded = false

	const buttonTextLookup: {[index: string]: string} = {
		"": "...",
		"artists": "artists",
		"release_groups": "albums",
		"recordings": "tracks"
	}

	let placeholderText = "Search for items to add to your collection"
</script>

<svelte:head>
	<title>
		Choose Top Albums
	</title>
</svelte:head>


<div class="panel">
    <PanelHeader>
		<span slot="text">
			my top albums
		</span>
    </PanelHeader>
    <form class="horizontal" method="POST" action='?/submitCollection'>
		<p>Pick your top 8 albums to display on your profile.</p>
		{#key collectionItems?.length}
		<input 
			type="hidden"
			name="collection-items"
			id="collection=items"
			value={JSON.stringify(collectionItems)}
		/>
		{/key}
		{#key deletedItems?.length}
		<input 
			type="hidden"
			name="deleted-items"
			value={JSON.stringify(deletedItems)}
		/>
		{/key}
        <button 
            class="double-border-top" 
            type="submit"
        >
            <div class="inner-border">             
                submit
            </div>
        </button>
    </form>
    <div class="search-bar">
		<MusicBrainzSearch 
            searchCategory={collectionType}
			bind:addedItems={collectionItems}
			bind:newItemAdded={itemAdded}
			searchButtonText={`add ${buttonTextLookup[collectionType]}`}
			searchPlaceholder={placeholderText}
            mode="collection"
            limit="8"
			bind:imgPromise={imgPromise}
		></MusicBrainzSearch>
    </div>
    {#key collectionItems.length}
        <GridList 
            bind:collectionContents={collectionItems}
			bind:deletedItems={deletedItems}
            collectionReturned={itemAdded}
            collectionType={collectionType}
            layout="list"
            mode="edit"
			bind:imgPromise={imgPromise}
        ></GridList>
    {/key}
</div>

<style>
	.horizontal {
		justify-content: space-between;
		align-items: center;
	}
    .search-bar {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);
		margin: var(--freq-spacing-3x-small) 0;
    }
</style>
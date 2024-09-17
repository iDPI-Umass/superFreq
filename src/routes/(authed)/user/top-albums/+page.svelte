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
	let { collection } =  data
	$: ({ collection } =  data)

	let collectionId: string
	let collectionTitle: string = `${username}'s' top albums`
	let collectionType = "release_groups"
	let collectionStatus = "public"
	let descriptionText = ""

	// collections_contents
	interface collectionItemObject {
		[index: string]: string
	}

	let collectionItems: object[] = []
	$: collectionItems
	let itemAdded = false
    let collectionItemCount = collectionItems.length

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
        my top albums
    </PanelHeader>
    <form class="horizontal" method="POST" action='?/submitCollection'>
		<p>Pick your top 8 albums to display on your profile.</p>
		<input 
			type="hidden"
			name="collection-items"
			id="collection=items"
			value={JSON.stringify(collectionItems)}
		/>
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
		></MusicBrainzSearch>
    </div>
    {#key collectionItems.length}
        <GridList 
            bind:collectionContents={collectionItems}
            collectionReturned={itemAdded}
            collectionType={collectionType}
            layout="list"
            mode="edit"
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
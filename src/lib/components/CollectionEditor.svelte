<script lang="ts">
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

    export let collectionType: string
    export let collectionItems: App.RowData[]
    export let deletedItems: App.RowData[] = []
    export let itemAdded: boolean
    export let imgPromise: any

    $: imgPromise
    $: collectionItems
    $: deletedItems

    const buttonTextLookup: {[index: string]: string} = {
		"": "...",
		"artists": "artists",
		"release_groups": "albums",
		"recordings": "tracks"
	}

    function searchButtonLabel ( lookup: string ) {
        if (!lookup) {
            return '...'
        }
        else return lookup
    }

    let placeholderText = "Search for items to add to your collection"
</script>

<div class="collection-search-bar" >
    <MusicBrainzSearch 
        searchCategory={collectionType}
        bind:addedItems={collectionItems}
        bind:deletedItems={deletedItems}
        bind:newItemAdded={itemAdded}
        searchButtonText={`add ${searchButtonLabel(buttonTextLookup[collectionType])}`}
        searchPlaceholder={placeholderText}
        mode="collection"
        bind:imgPromise={imgPromise}
    ></MusicBrainzSearch>
</div>
{#key collectionItems?.length}
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
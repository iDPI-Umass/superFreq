<script lang="ts">
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

    interface ComponentProps {
        collectionType: string
        collectionItems: App.RowData[]
        deletedItems?: App.RowData[]
        itemAdded: boolean
        imgPromise?: any
    }

    let {
        collectionType,
        collectionItems = $bindable([]),
        deletedItems = $bindable([]),
        itemAdded = $bindable(false),
        imgPromise = $bindable(null)
    }: ComponentProps = $props()

    // $: imgPromise
    // $: collectionItems
    // $: deletedItems

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

    const placeholderText = "Search for items to add to your collection"
</script>

<svelte:options runes={true} />

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
<GridList 
    bind:collectionContents={collectionItems}
    bind:deletedItems={deletedItems}
    collectionType={collectionType}
    layout="list"
    mode="edit"
    bind:imgPromise={imgPromise}
></GridList>
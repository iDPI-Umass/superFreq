<script lang="ts">
    import { enhance } from '$app/forms'
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import ManualAddModal from '$lib/components/modals/ManualAddModal.svelte'
    import CollectionItemTag from '$lib/components/CollectionItemTag.svelte'

    interface ComponentProps {
        collectionType: string
        collectionStatus: string
        mode?: string
        collectionItems: App.RowData[]
        deletedItems?: App.RowData[]
        itemAdded: boolean
        formAction?: string
        imgPromise?: any
    }

    let {
        collectionType,
        collectionStatus,
        mode = '', // artists || release_groups || recordings
        collectionItems = $bindable([]),
        deletedItems = $bindable([]),
        itemAdded = $bindable(false),
        formAction,
        imgPromise = $bindable(null)
    }: ComponentProps = $props()

    // $: imgPromise
    // $: collectionItems
    // $: deletedItems

    const categoryLookup: {[index: string]: string} = {
		"": "...",
        "artist": "artists",
		"artists": "artists",
        "release_group": "albums",
		"release_groups": "albums",
        "recording": "tracks",
		"recordings": "tracks",
        "episode": "episode",
        "mix": "episode"
	}

    function searchButtonLabel ( lookup: string ) {
        if (!lookup) {
            return '...'
        }
        else return lookup
    }

    let itemType = $state( mode ?? '') as string

    let itemLookup = {
        '': 'item',
        'artist': 'artist',
        'artists': 'artist',
        'release_group': 'album',
        'release_groups': 'album',
        'recording': 'track',
        'recordings': 'track',
        'episode': 'episode or mix',
        'episodes': 'episode or mix',
    } as any

    let searchCategoryLookup = {
        '': '',
        'artist': 'artists',
        'artists': 'artists',
        'album': 'release_groups',
        'albums': 'release_groups',
        'release_group': 'release_groups',
        'release_groups': 'release_groups',
        'track': 'recordings',
        'tracks': 'recordings',
        'recording': 'recordings',
        'recordings': 'recordings',
        'episode': 'episode',
        'episodes': 'episode',
        'mix': 'episode',
        'mixes': 'episode'
    } as any

    let showManualAddModal = $state(false)
</script>

<svelte:options runes={true} />

<div class="collection-search" >
    {#if !(mode?.includes('artist')) && !(mode?.includes('release_group')) && !(mode?.includes('recording')) }
    <div class="form-column">
        <fieldset class="search">
            <legend>
                Add <CollectionItemTag itemType={searchCategoryLookup[itemType]}></CollectionItemTag> to your collection
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
                    <label for="artist">
                        artist
                    </label>
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
                    <label for="release_group">
                        album
                    </label>
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
                    <label for="recording">
                        track
                    </label>
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
                    <label for="episode">
                        Episode / DJ Mix
                    </label>
                </li>
            </ul>
        </fieldset>
    </div>
    {/if}
    <div class="form-column">
        {#if itemType != "episode"}
            <div class="collection-search-bar">
                <span class="search-tooltip">
                    search for <em>{itemLookup[itemType]}</em> to add info automatically
                </span>
                <MusicBrainzSearch 
                    searchCategory={searchCategoryLookup[itemType]}
                    bind:addedItems={collectionItems}
                    bind:deletedItems={deletedItems}
                    bind:newItemAdded={itemAdded}
                    searchButtonText={`search ${categoryLookup[itemType]}`}
                    searchPlaceholder={`search ${categoryLookup[itemType]}`}
                    mode="collection"
                    bind:imgPromise={imgPromise}
                ></MusicBrainzSearch>
            </div>
            <span class="or">— or —</span>
        {/if}
        <span class="search-tooltip">
            add <em>{itemLookup[itemType]}</em> info yourself
        </span>
        <ManualAddModal
            showModal={showManualAddModal}
            items={collectionItems}
            itemType={itemType}
        >
            {#snippet headerText()}
                manually add {itemLookup[itemType]}
            {/snippet}
        </ManualAddModal>
        <div class="manual-add-button">
            <button
                class="double-border-top"
                onclick={() => showManualAddModal = true}
                disabled={itemType == ''}
            >
                <div class="inner-border">
                    Add {itemLookup[itemType]} manually
                </div>
            </button>
        </div>
    </div>
</div>
<div class="bottom-double-border"></div>
<GridList 
    bind:collectionContents={collectionItems}
    bind:deletedItems={deletedItems}
    collectionType={collectionType}
    collectionStatus={collectionStatus}
    layout="list"
    mode="edit"
    bind:imgPromise={imgPromise}
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
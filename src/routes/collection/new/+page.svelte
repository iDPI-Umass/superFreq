<!--
	Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.
-->

<script lang="ts">
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
	import InfoBox from 'src/lib/components/InfoBox.svelte';

	export let data
    let { sessionUserId, infoBoxText } = data
	$: ({ sessionUserId, infoBoxText } = data)

	let collectionTitle: string
	let collectionType: string
	let collectionStatus: string

	let collectionItems: object[] = []
	$: collectionItems
	let itemAdded = false
    let imgPromise
    $: imgPromise

	// UI
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

<svelte:head>
	<title>
		New Collection
	</title>
</svelte:head>

<InfoBox>
    A collection is a list of albums, tracks, or artists. Among many other things, you can make a colleciton to keep track of music you want to listen to or create a resource for other people who might want to learn more about music you love.
</InfoBox>

<div class="collection-container">
    <PanelHeader>
        <span slot="text">
            new collection
        </span>
    </PanelHeader>
    <form
        class="horizontal"
        method="POST"
        action="?/insertCollection"
    >
        <div class="form-column">
            <input 
                type="hidden"
                name="collection-contents"
                id="collection-contents"
                value={JSON.stringify(collectionItems)}
            />
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="collection-title"
                >
                    collection name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                type="text" 
                name="collection-title" 
                id="collection-title" 
                bind:value={collectionTitle} 
                required 
            />
            <fieldset>
                <div class="label-group">
                    <legend>Type of collection</legend>
                    <Tooltip>
                        All items in a collection must be the same type. You can not mix and match artists, ablums, and tracks.
                    </Tooltip>
                </div>
                <span class="label-explainer">
                    * required
                </span>
                <ul>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="artists" 
                            value="artists" 
                            bind:group={collectionType} 
                        />
                        <label for="artists">artists</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="albums" 
                            value="release_groups" 
                            bind:group={collectionType} 
                        />
                        <label for="albums">albums</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="tracks" 
                            value="recordings" 
                            bind:group={collectionType} 
                        />
                        <label for="tracks">tracks</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset>
                <div class="label-group">
                    <legend>Status of collection</legend>
                    <Tooltip>
                        <u>Open</u> collections can be viewed and edited by anyone.
                        <br />
                        <br />
                        <u>Public</u> collections can be viewed by anyone, but only edited by you.
                        <br />
                        <br />
                        <u>Private</u> collections can only be viewed and edited by you.
                    </Tooltip>
                </div>
                <span class="label-explainer">
                    * required
                </span>
                <ul>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="open" 
                            value="open" 
                            bind:group={collectionStatus} 
                        />
                        <label for="open">open</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="public" 
                            value="public" 
                            bind:group={collectionStatus} 
                        />
                        <label for="public">public</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="private" 
                            value="private" 
                            bind:group={collectionStatus} 
                        />
                        <label for="private">private</label>
                    </li>
                </ul>
            </fieldset>
            {#if collectionStatus && collectionStatus != 'public'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionStatus]}
                </InfoBox>
            {/if}
        </div>
        <div class="form-column">
            <label 
                class="text-label" 
                for="description"
            >
                Collection Description
            </label>
            <textarea
                id="description"
                name="description"
                rows="10"
                cols="1"
                spellcheck=true 
                required
            ></textarea>
            <div class="collection-info-button-spacing">
                <button 
                    class="double-border-top" 
                    type="submit"
                    formAction="?/insertCollection"
                    disabled={!(collectionStatus && collectionTitle && (collectionItems.length > 0))}
                >
                    <div class="inner-border">
                        create new collection
                    </div>
                </button>
            </div>
        </div>
    </form>
    <div class="collection-search-bar">
		<MusicBrainzSearch 
            searchCategory={collectionType}
			bind:addedItems={collectionItems}
			bind:newItemAdded={itemAdded}
			searchButtonText={`add ${searchButtonLabel(buttonTextLookup[collectionType])}`}
			searchPlaceholder={placeholderText}
            mode="collection"
            bind:imgPromise={imgPromise}
		></MusicBrainzSearch>
    </div>
    {#key collectionItems.length}
        <GridList 
            bind:collectionContents={collectionItems}
            collectionReturned={itemAdded}
            collectionType={collectionType}
            layout="list"
            mode="edit"
            imgPromise={imgPromise}
        ></GridList>
    {/key}
</div>

<style>
    @media screen and (max-width: 600px) {
        form.horizontal {
            flex-direction: column;
        }
    }
</style>
<!--
	Retrieve existing collection if user has edit permission.
    
    Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.

    Upsert updates.

	All of this is done on the client side.
-->

<script lang="ts">
    import type { PageData } from './$types';

    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
    import InfoBox from '$lib/components/InfoBox.svelte'


	export let data: PageData;
    let { collection, sessionUserId, collectionId } = data;
    $: ({ collection, sessionUserId, collectionId } = data);

    let imgPromise
    $: imgPromise
    
	/* 
	Let's declare some variables for...
	*/

    const collectionInfo = collection?.info as App.RowData

	// collections_info
	let collectionTitle = collectionInfo["title"] 
	let collectionType = collectionInfo["type"] 
	let collectionStatus = collectionInfo["status"] 
	let descriptionText = collectionInfo["description_text"] 

	// collections_contents
	interface collectionObject {
		[index: string]: string
	}

	let collectionItems = collection?.collectionContents as App.RowData[]
	$: collectionItems
	let itemAdded = false
	
    let deletedItems = collection?.deletedCollectionContents as App.RowData[]
    $: deletedItems

	// UI
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
		Edit {collectionInfo.title}
	</title>
</svelte:head>


<div class="collection-builder">
    <div class="builder-header">
        <h1>
            edit collection
        </h1>
    </div>
    <form class="form-box" method="POST" action ="?/updateCollection">
        <div class="form-block">
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
            <input class="text" type="text" name="collection-title" id="collection-title" bind:value={collectionTitle} required />
            <input 
                type="hidden"
                name="collection-id"
                value={collectionId}
            />
            <input 
                type="hidden"
                name="collection-type"
                value={collectionType}
            />
            {#key collectionItems?.length}
            <input 
                type="hidden"
                name="collection-contents"
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
            <input 
                type="hidden"
                name="updated-by"
                value={sessionUserId}
            />
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
                <ul>
                    <li>
                        <input class="radio" type="radio" name="status" id="open" value="open" bind:group={collectionStatus} />
                        <label for="open">open</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="status" id="public" value="public" bind:group={collectionStatus} />
                        <label for="public">public</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="status" id="private" value="private" bind:group={collectionStatus} />
                        <label for="private">private</label>
                    </li>
                </ul>
            </fieldset>
        </div>
        <div class="form-block">
            <label class="text-label" for="description">
                Collection Description
            </label>
            <textarea
                id="description"
                name="description"
                rows="10"
                cols="1"
                spellcheck=true 
                required
            >{descriptionText}</textarea>
            <button 
                class="double-border-top" 
                formAction = '?/updateCollection'
                disabled={!(collectionStatus && collectionTitle)}
            >
                <div class="inner-border">
                    submit
                </div>
            </button>
        </div>
    </form>
    <div class="search-bar">
		<MusicBrainzSearch 
            searchCategory={collectionType}
			bind:addedItems={collectionItems}
            bind:deletedItems={deletedItems}
			bind:newItemAdded={itemAdded}
			searchButtonText={`add ${buttonTextLookup[collectionType]}`}
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
</div>

<style>
    .collection-builder {
        width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: var(--freq-border-panel);
    }
    .builder-header {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        margin: var(--freq-spacing-3x-small) 0;
        align-items: center;
    }
    .builder-header h1 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer);
    }
    form {
        display: flex;
        flex-direction: row;
        gap: var(--freq-width-spacer);
        padding: var(--freq-width-spacer);
    }
    form label.text-label {
        text-transform: uppercase;
    }
    form input {
        width: auto;
    }
    .form-block {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .search-bar {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);
		margin: var(--freq-spacing-3x-small) 0;
    }
    @media screen and (max-width: 600px) {
        form.horizontal {
            flex-direction: column;
        }
    }
</style>
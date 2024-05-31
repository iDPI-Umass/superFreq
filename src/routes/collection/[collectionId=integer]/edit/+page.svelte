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

	/* 
	Functions for interacting with Supabase API
	*/
	import { itemUpsert } from '$lib/resources/backend-calls/musicDataFunctions'
	import { prepareMusicDataUpsert, populateCollectionContents } from '$lib/resources/parseData';
	import { insertCollectionInfo, insertCollectionSocial, insertCollectionContents, insertCollectionUpdateRecord } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions.js'
	import { AppWindow } from 'lucide-svelte';

	export let data: PageData;
    let { supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned} = data;
    $: ({ supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned } = data);

	/* 
	Let's declare some variables for...
	*/

	// collections_info
	let collectionTitle = collectionInfo[0]["title"]
	let collectionType = collectionInfo[0]["type"]
	let collectionStatus = collectionInfo[0]["status"]
	let descriptionText = collectionInfo[0]["description_text"]

    console.log(collectionContents)

	// collections_contents
	interface collectionObject {
		[index: string]: string
	}

	let collectionItems: object[] = []
	$: collectionItems
	let itemAdded = false
	
	// UI
	const buttonTextLookup: {[index: string]: string} = {
		"": "...",
		"artists": "artists",
		"release_groups": "albums",
		"recordings": "tracks"
	}

	let placeholderText = "Search for items to add to your collection"

	/*
	Functions for submitting new collection to database
	*/

	// Insert row into tables: artists, release_groups, recordings
	async function upsertMusicData({locals: { supabase }}: { locals: App.Locals }) {
		const { upsertArtists, upsertReleaseGroups, upsertRecordings } = await prepareMusicDataUpsert( collectionItems, collectionType )

		let item = {
			tableName: "artists",
			itemData: upsertArtists
		}

		const artistRes = await itemUpsert({item, locals: { supabase }})
		const artistStatus = artistRes.statusText

		if (collectionType == "release_groups") {
			item = {
				tableName: "release_groups",
				itemData: upsertReleaseGroups
			}
			const rgRes = await itemUpsert({item, locals: { supabase }})
			const rgStatus = rgRes.statusText
			return { artistStatus, rgStatus }
		}

		if (collectionType == "recordings") {
			item = {
				tableName: "release_groups",
				itemData: upsertReleaseGroups
			}
			const rgRes = await itemUpsert({item, locals: { supabase }});
			item = {
				tableName: "recordings",
				itemData: upsertRecordings
			}
			const recRes = await itemUpsert({item, locals: { supabase }});
			const rgStatus = rgRes.statusText
			const recStatus = recRes.statusText
			return { artistStatus, rgStatus, recStatus }
		}

		return artistStatus

	}

	// Insert row into table collections_info, returns collection_id to be used in subsequent REST requests
	async function submitCollectionInfo({ locals: { supabase }}: { locals: { supabase: App.Locals["supabase"] } }) {

		// formats data as expected by collections_info
		const collectionInfo = {
			"owner_id": id,
			"created_by": id,
			"title": collectionTitle,
			"type": collectionType,
			"status": collectionStatus,
			"description_text": descriptionText
		}

		const collectionInfoResponse = await insertCollectionInfo( { collectionInfo, locals: { supabase }} );
		collectionId = await collectionInfoResponse[0]["collection_id"];

		const socialInfo = {
			"collection_id": collectionId,
			"user_id": id,
			"user_role": "owner",
		}

		await insertCollectionSocial( { socialInfo, locals: {supabase} } );
		await insertCollectionUpdateRecord({ id, collectionId, locals: { supabase }});

	 }
	
	// Inserts rows into table collections_contents using collection_id returned after "submitCollectionContents" runs, and only once relevant mbids have been added to their respective music data tables (artists, release_groups, and/or recordings)
	async function submitCollectionContents({ locals: { supabase }}: { locals: { supabase: App.Locals["supabase"] } }) {
		for ( const collectionItem of collectionItems ) {
			const thisItem = collectionItem as collectionObject
			thisItem["item_position"] = thisItem["id"];
			delete thisItem["id"];
		}
		
		await submitCollectionInfo({ locals: { supabase }});
		await upsertMusicData({ locals: { supabase }});
		const collectionContents = await populateCollectionContents( collectionItems, collectionId );

		const res = await insertCollectionContents( { collectionContents, locals: { supabase }});

		return res.toString();
	}
</script>

<div class="collection-builder">
    <div class="builder-header">
        <h1>
            new collection
        </h1>
    </div>
    <form class="form-box">
        <div class="form-block">
            <label class="text-label" for="collection-title">
                collection name
            </label>
            <input class="text" type="text" name="collection-title" id="collection-title" bind:value={collectionTitle} required />
            <fieldset>
                <legend>Type of collection</legend>
                <ul>
                    <li>
                        <input class="radio" type="radio" name="collection-type" id="artists" value="artists" bind:group={collectionType} />
                        <label for="artists">artists</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="collection-type" id="albums" value="release_groups" bind:group={collectionType} />
                        <label for="albums">albums</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="type" id="tracks" value="recordings" bind:group={collectionType} />
                        <label for="tracks">tracks</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset>
                <legend>Status of collection</legend>
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
            ></textarea>
            <button 
                class="double-border-top" 
                type="submit"
                on:click|preventDefault={submitCollectionContents}
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
			bind:newItemAdded={itemAdded}
			searchButtonText={`add ${buttonTextLookup[collectionType]}`}
			searchPlaceholder={placeholderText}
            mode="collection"
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
</style>
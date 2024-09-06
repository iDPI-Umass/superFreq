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

	/* 
	Functions for interacting with Supabase API
	*/
	// import { itemUpsert } from '$lib/resources/backend-calls/musicDataFunctions'
	// import { prepareMusicDataUpsert, populateCollectionContents } from '$lib/resources/parseData';
	// import { insertCollectionInfo, insertCollectionSocial, insertCollectionContents, insertCollectionUpdateRecord } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions.js'
	// import { redirect } from '@sveltejs/kit';

	/* 
	Get user session
	*/
	export let data
	$: data

	const { session } = data
	const { user: { id }} =  session

    const { supabase } = data

    // const { username } =  getLocalProfile(localStorage.getItem('profile') as string)

	/* 
	Let's declare some variables for...
	*/

	// collections_info
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
    
    // limit size of collection to 8, in order to profile UI
    function limitCollection() {

    }
	
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
	async function upsertMusicData() {
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
	async function submitCollectionInfo() {

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

		// log that collectionId in user's profile
		await supabase
			.from('profiles')
			.update({'top_albums_collection_id': collectionId})
			.eq('id', id)

		await insertCollectionSocial( { socialInfo, locals: {supabase} } );
		await insertCollectionUpdateRecord({ id, collectionId, locals: { supabase }});

	 }
	
	// Inserts rows into table collections_contents using collection_id returned after "submitCollectionContents" runs, and only once relevant mbids have been added to their respective music data tables (artists, release_groups, and/or recordings)
	async function submitCollectionContents() {
        console.log("button clicked")

		for ( const collectionItem of collectionItems ) {
			const thisItem = collectionItem as collectionItemObject
			thisItem["item_position"] = thisItem["id"];
			delete thisItem["id"];
		}
		
        console.log("IDs updated")

		await submitCollectionInfo();
        console.log("collection info submitted")

		await upsertMusicData();
        console.log("music data upserted")

		const collectionContents = await populateCollectionContents( collectionItems, collectionId );
        console.log("collection contents populated")

		const res = await insertCollectionContents( { collectionContents, locals: { supabase }});

        if ( res.status === 201 ) {
            goto(`/${username}`)
        }
        else {
            goto(`/`)
        }

	}
</script>

<div class="panel">
    <PanelHeader>
        {username}'s top albums
    </PanelHeader>
    <form class="horizontal">
        <input 
            class="text" 
            type="hidden" 
            name="collection-title" 
            id="collection-title" 
            bind:value={collectionTitle}
        />
        <input 
            class="text" 
            type="hidden" 
            name="collection-type" 
            id="collection-type" 
            bind:value={collectionType}
        />
        <input 
            class="text" 
            type="hidden" 
            name="status" 
            id="status" 
            bind:value={collectionStatus}
        />
        <button 
            class="double-border-top" 
            type="submit"
            on:click|preventDefault={submitCollectionContents}
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
            limit={8}
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
    .search-bar {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);
		margin: var(--freq-spacing-3x-small) 0;
    }
</style>
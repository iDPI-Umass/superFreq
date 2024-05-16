<!--
	Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.

	All of this is done on the client side.
-->


<script lang="ts">
	// library imports
	//import { supabase } from "$lib/supabaseClient";
	//import { userProfile } from "$lib/store.js";
	//import { GET } from './+server.ts';

	//functions for UI stuff
	//import { setTableFormat } from '$lib/resources/collections-forms/setTableFormat.ts';
	import { categoriesTable } from '$lib/resources/parse-data/categoriesTable.ts';
	//import { mbSearch } from '$lib/resources/musicbrainz-calls/mbSearch.ts';

	//sortable table stuff
	import {dndzone, SOURCES, TRIGGERS	} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';
	const flipDurationMs = 200;

	// functions for interacting with Supabase API
	import { insertCollectionInfo } from '$lib/resources/database/collections/insertCollectionInfo';
	import { insertCollectionSocial } from '$lib/resources/database/collections/insertCollectionSocial';
	import { itemUpsert } from '$lib/resources/database/music-data/itemUpsert';
	import { insertCollectionContents } from '$lib/resources/database/collections/insertCollectionContents';
	import { prepareMusicDataUpsert } from '$lib/resources/parse-data/prepareMusicDataUpsert';
	import { populateCollectionContents } from '$lib/resources/parse-data/populateCollectionContents';
	import { insertCollectionUpdateRecord } from "$lib/resources/database/collections/insertCollectionUpdateRecord";
	
	//PageData
	export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

	let { user: { id } } = session;

	// collections_info variables
	let collectionId = "";
	let collectionTitle = "";
	let collectionType = "";
	let collectionStatus = "";
	let descriptionText = "";

	// collections_contents variables
	let collectionItems = [];

	/* 
	UI elements
	*/
	let dragDisabled = true;
	
	function handleConsider(e) {
		const {items: newItems, info: {source, trigger}} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via keyboard
		if (source === SOURCES.KEYBOARD && trigger === TRIGGERS.DRAG_STOPPED) {
			dragDisabled = true;
		}
	}
	function handleFinalize(e) {
		const {items: newItems, info: {source}} = e.detail;
		items = newItems;
		// Ensure dragging is stopped on drag finish via pointer (mouse, touch)
		if (source === SOURCES.POINTER) {
			dragDisabled = true;
		}
		console.log(collectionItems)
	}
	function startDrag(e) {
		// preventing default to prevent lag on touch devices (because of the browser checking for screen scrolling)
		e.preventDefault();
		dragDisabled = false;
	}
	function handleKeyDown(e) {
		if ((e.key === "Enter" || e.key === " ") && dragDisabled) dragDisabled = false;
	}

	let items = {};
	// for ( const contentItem of collectionItems ) {
	// 	contentItem["id"] = collectionItems.indexOf(contentItem) + 1;
	// }

	function collectionItemIndex(collectionItems){
		const collectionLength =  collectionItems.length;
		return collectionLength + 1;
	}

	//variables for table display
	// const { tableHeaderOne, tableHeaderTwo, tableHeaderThree, tableValueOne, tableValueTwo, tableValueThree } = await setTableFormat;
	let tableHeaderOne = "";
	let tableHeaderTwo = "";
	let tableHeaderThree = "";
	let tableValueOne = "";
	let tableValueTwo = "";
	let tableValueThree = "";

	// to convert categories <select> value to suffix for API endpoint
	// let categoriesTable = 
	// 	{
	// 		"artists": "artist",
	// 		"release_groups": "release-group",
	// 		"recordings": "recording"
	// 	};

	// delete item from collection editor
	function deleteItem(item) {
		collectionItems = collectionItems.filter(i => i != item);
		for (const i of collectionItems) {
			i["id"] = collectionItems.indexOf(i);
		}
	}

	// formats table columns to display artists, albums, or tracks depending on collectionType
	function setTableFormat() {
			if ( collectionType == "") {
				tableHeaderOne = "";
				tableHeaderTwo = "";
				tableHeaderThree = "";
				tableValueOne = "";
				tableValueTwo = "";
				tableValueThree = "";
			}
			else if ( collectionType == "artists") {
				tableHeaderOne = "Artist";
				tableHeaderTwo = "From location";
				tableHeaderThree = "Debut year";

				tableValueOne = `${["name"]}`;
				tableValueTwo = `${["area"]["name"]}`;
				tableValueThree = `${["life-span"]["begin"]}`;
			}
			else if ( collectionType == "release_groups" ) {
				tableHeaderOne = "Album";
				tableHeaderTwo = "Artist";
				tableHeaderThree = "Release Date";
				tableValueOne = "item[`title`]";
				tableValueTwo = "item[`artist-credit`][0][`artist`][`name`]";
				tableValueThree = "item[`first-release-date`]";
			}
			else if ( collectionType == "recordings" ) {
				tableHeaderOne = "Track";
				tableHeaderTwo = "Artist";
				tableHeaderThree = "Release Date";
				tableValueOne = `["name"]`;
				tableValueTwo = `["artist-credit"][0]["artist"]["name"]`;
				tableValueThree = `["first-release-date"]`;
			}
	}

	/*
	Functions to call MusicBrainz database and parse relevant data.
	*/

	// search MusicBrainz using form info
	let mbData = "";
	let query = "";
	let searchComplete: boolean;
	async function mbSearch() {
		const apiCategory = categoriesTable[`${collectionType}`];

		let apiString = "https://musicbrainz.org/ws/2/";
		apiString = apiString.concat(apiCategory);
        const endpoint = new URL (apiString);
            
		endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("query", `${query}`);

		if (collectionType == "recordings") {
			endpoint.searchParams.set("inc", "releases+release-groups+artist-rels");
		}

        const res = await fetch(endpoint);
        const searchResults = await res.json();

        const mbObjectKey = apiCategory.concat('s');
		mbData = searchResults[mbObjectKey];
		
		searchComplete =  true;

		const thisSession = await session;

		return {
			mbData, searchComplete
		}
    };

	// returns mbid and label name for earliest release in release group
	async function getLabel( item ) {
		const releaseGroupMbid = item["mbid"];
		const releaseDate = item["releaseDate"];
		const endpoint = `https://musicbrainz.org/ws/2/release?release-group=${releaseGroupMbid}&inc=labels&fmt=json`;
		const res = await fetch (endpoint);
		let releases = await res.json();
		releases = releases["releases"];

		for ( const release of releases ) {
			if ( releaseDate == release["date"] ) {
				const releaseMbid = release["id"];
				const label = release["label-info"][0]["label"]["name"];
				return { releaseMbid, label };
			}
		}
	}

	// API call to Cover Art Archive using releaseMbid returned by getLabel()
	async function getCoverArt ( release_group_mbid ) {
		const endpoint = `http://coverartarchive.org/release-group/${release_group_mbid}/front`;
		const res = await fetch(endpoint, {
			"mode": "no-cors"
		});
		const coverArtUrl = await res["url"];

		return  coverArtUrl;
	}

	// adds item from MusicBrainz search results to collection editor
	let itemAdded: boolean;
	async function addItem(item) {
		if ( collectionType == "artists" ) {
			collectionItems = [...collectionItems, {
				"item_position": collectionItems.length,
				"artistMbid": item["id"],
				"artistName": item["name"],
				"releaseGroupMbid": null,
				"releaseGroupName": null,
				"releaseDate": null,
				"recordingMbid": null,
				"recordingName": null,
				"remixerMbid": null,
				"imgUrl": null,
				"label": null,
				"notes": null,
				"id": collectionItems.length + 1
			}];
		}
		else if ( collectionType == "release_groups" ) {
			const releaseGroup = {
				mbid: item["id"],
				releaseDate: item["first-release-date"] 
			}
			const { label } = await getLabel(releaseGroup);
			const coverArt = await getCoverArt( releaseGroup.mbid );
			collectionItems = [...collectionItems, {
				"item_position": collectionItems.length,
				"artistMbid": item["artist-credit"][0]["artist"]["id"],
				"artistName": item["artist-credit"][0]["artist"]["name"],
				"releaseGroupMbid": item["id"],
				"releaseGroupName": item["title"],
				"releaseDate": item["first-release-date"],
				"recordingMbid": null,
				"recordingName": null,
				"remixerMbid": null,
				"imgUrl": coverArt,
				"label": label, 
				"notes": null,
				"id": collectionItems.length + 1
			}];
		}
		else if ( collectionType == "recordings" ) {
			let remixerMbid = null;
			if ( item["relations"][0]["artist"]["type"] == "remixer" ) {
				remixerMbid = item["relations"][0]["artist"]["id"];
			}
			collectionItems = [...collectionItems, {
				"item_position": collectionItems.length,
				"artistMbid": item["artist-credit"][0]["artist"]["id"],
				"artistName": item["artist-credit"][0]["artist"]["name"],
				"releaseGroupMbid": item["release-group"]["id"],
				"releaseGroupName": item["release-group"]["title"],
				"recordingMbid": item["id"],
				"recordingName": item["name"],
				"releaseDate": item["first-release-date"],
				"remixerMbid": remixerMbid,
				"imgUrl": null,
				"label": null,
				"notes": null,
				"id": collectionItems.length +1
			}];
		}
		itemAdded = true;
		items = collectionItems;
		console.log(collectionItems)
		return itemAdded
	}

	
	// insert row into tables: artists, release_groups, recordings
	async function upsertMusicData( ) {
		const { upsertArtists, upsertReleaseGroups, upsertRecordings } = await prepareMusicDataUpsert( collectionItems, collectionType );

		let item = {
			tableName: "artists",
			itemData: upsertArtists
		}

		const artistRes = await itemUpsert({item, locals: { supabase }});

		if (collectionType == "release_groups") {
			item = {
				tableName: "release_groups",
				itemData: upsertReleaseGroups
			}
			const rgRes = await itemUpsert({item, locals: { supabase }});
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
		}

	}

	// insert row into table collections_info, returns collection_id to be used in subsequenct REST requests
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

		const collectionInfoResponse = await insertCollectionInfo( collectionInfo );
		collectionId = await collectionInfoResponse[0]["collection_id"];

		const socialInfo = {
			"collection_id": collectionId,
			"user_id": id,
			"user_role": "owner",
		}

		await insertCollectionSocial( { socialInfo, locals: {supabase} } );
		await insertCollectionUpdateRecord({ id, collectionId, locals: { supabase }});

	 }
	
	// inserts rows into table collections_contents using collection_id returned after "submitCollectionContents" runs, and only once relevant mbids have been added to their respective music data tables (artists, release_groups, and/or recordings)
	async function submitCollectionContents() {
		for ( const collectionItem of collectionItems) {
			collectionItem["item_position"] = collectionItem["id"];
			delete collectionItem["id"];
		}
		
		await submitCollectionInfo();
		await upsertMusicData();
		const collectionContents = await populateCollectionContents( collectionItems, collectionId );

		const res = await insertCollectionContents( { collectionContents, locals: { supabase }} );

		return res.toString();
	}

</script>

<!--
	Form to set collection title, type, and status, then submit that collection.
-->
<h1>New collection</h1>
<h2>Collection info</h2>
<form>
	<div>
		<label for="collection-title">
			Name your collection.
		</label>
		<p>{collectionTitle}</p>
		<input type="text" id="collection-title" minlength="3" bind:value={collectionTitle} />
	</div>
	<div>
		<label for="category">
			Choose a category for your collection:
		</label>
		<select name="collection-type" id="category" bind:value={collectionType} on:change={() => setTableFormat()} required>
			<option value="" disabled>
				--Categories--
			</option>
			<option value="artists">
				Artists
			</option>
			<option value="release_groups">
				Albums
			</option>
			<option value="recordings">
				Tracks
			</option>
		</select>
		<p>Collection of {collectionType}</p>
	</div>
	
	<label for="status">
		Should this collection be public or private?
	</label>
	<select name="collection-status" id="status" bind:value={collectionStatus} required>
		<option value="" disabled>
			--Status--
		</option>
		<option value="public">
			Public
		</option>
		<option value="private">
			Private
		</option>
	</select>
		<p>This collection is {collectionStatus}</p>
	<p>describe your collection</p>
	<textarea rows="5" cols="50" bind:value={descriptionText} />
	<button on:click|preventDefault={submitCollectionContents} disabled={!(collectionStatus && collectionTitle)}>
		Submit collection
	</button>
</form>

<!--
	Collection editor
-->
<h2>Add items to your collection</h2>

<!--
	Table displaying collection not yet submitted
-->
<br/>
{#if itemAdded}
<h1>your collection</h1>
<table>
	<caption>this collection</caption>
	<thead>
		<tr>
		  <th></th>
		  {#if collectionType == "artists"}
			<th>Artist</th>
			<th></th>
			<th></th>
		  {:else if collectionType == "release_groups"}
			<th>Album</th>
			<th>Artist</th>
			<th>Release date</th>
			<th>Cover art</th>
		  {:else if collectionType == "recordings"}
			<th>Track</th>
			<th>Artist</th>
			<th>Release date</th>
		  {/if}
		</tr>
	  </thead>
	  <tbody>
		<!--<section
		use:dndzone="{{ items: collectionItems, dragDisabled, flipDurationMs }}"
		on:consider="{handleConsider}"
		on:finalize="{handleFinalize}"
	>-->
		{#each collectionItems as item, index(item.id) }
		<!--<div class="drag-area" animate:flip="{{ duration: flipDurationMs }}">-->
			<tr>

					<!--<div tabindex={dragDisabled? 0 : -1} 
							 aria-label="drag-handle"
							 class="handle" 
							 style={dragDisabled ? 'cursor: grab' : 'cursor: grabbing'}
							 on:mousedown={startDrag} 
							 on:touchstart={startDrag}
							 on:keydown={handleKeyDown}
					/>-->
					<td>{index + 1}</td>
				{#if collectionType == "artists"}
					<td>{item["artistName"]}</td>
					<td></td>
					<td></td>
				{:else if collectionType == "release_groups"}
					<td >{item["releaseGroupName"]}</td>
					<td>{item["artistName"]}</td>
					<td>{item["releaseDate"]}</td>
					<td><img src={item["imgUrl"]} alt={item["releaseGroupName"]} /></td>
				{:else if collectionType == "recordings"}
					<td >{item["recordingNAme"]}</td>
					<td>{item["artistName"]}</td>
					<td>{item["releaseDate"]}</td>
				{/if}
				<td> 
					<button on:click|preventDefault={() => deleteItem(item)}>remove</button>
				</td>

			</tr>
		<!--</div>-->
		{/each}
		<!--</section>-->
	  </tbody>
	</table>
{/if}

<!--
	Search form for querying MusicBrainz
-->
<form>
	<input type="search" name="query" bind:value={query} placeholder="Search for an album, EP, single, etc."/>
	<button on:click|preventDefault={mbSearch} disabled={!(collectionType)}>search</button>
</form>

<!--
	Table to display search results
-->
{#if searchComplete}
<table>
	<caption>search results</caption>
	<thead>
		<tr>
		  <th class="w-[100px]"></th>
		  {#if collectionType == "artists"}
			<th>Artist</th>
			<th>Debut year</th>
			<th>From location</th>
		  {:else if collectionType == "release_groups"}
			<th>Album</th>
			<th>Artist</th>
			<th>Release date</th>
		  {:else if collectionType == "recordings"}
			<th>Track</th>
			<th>Artist</th>
			<th>Release date</th>
		  {/if}
		</tr>
	  </thead>
	  <tbody>
		{#each mbData as item}
			<tr>
				<td>
					<button on:click|preventDefault={() => addItem(item)}>select</button>
				</td>
				{#if collectionType == "artists"}
					<td>{item["name"]}</td>
					<td>{item["area"]["name"]}</td>
					<td>{item["life-span"]["begin"]}</td>
				{:else if collectionType == "release_groups"}
					<td >{item["title"]}</td>
					<td>{item["artist-credit"][0]["artist"]["name"]}</td>
					<td>{item["first-release-date"]}</td>
				{:else if collectionType == "recordings"}
					<td >{item["name"]}</td>
					<td>{item["artist-credit"][0]["artist"]["name"]}</td>
					<td>{item["first-release-date"]}</td>
				{/if}
			</tr>
		{/each}
		</tbody>
	</table>
{/if}

<style>
	form {
		width: 60%;
		border: 1px solid white;
		border-radius: 10px;
		padding: 5vh 5vw;
		color: white;
	}
	button:disabled{
		background: black;
		color: orchid;
		border-color: lightgray;
		padding: 1vh 1vw;
	}
	select {
		margin: 2vh auto;
	}
	input {
		margin: 2vh auto;
		width: 30vw;
	}
	img {
		width: 50px;
	}
	.drag-area {

		border: 1px solid white;

	}
	.handle {


		width: 1em;
		height: 0.5em;
		background-color: grey;
	}
	section {
		padding: 5vh 5vw;
		border: 2px solid white;
	}
</style>
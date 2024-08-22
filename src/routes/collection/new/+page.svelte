<!--
	Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.
-->

<script lang="ts">
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

	/* 
	Functions for interacting with Supabase API
	*/
	// import { itemUpsert } from '$lib/resources/backend-calls/musicDataFunctions'
	// import { prepareMusicDataUpsert, populateCollectionContents, timestampISO, timestampISOString } from '$lib/resources/parseData';
	// import { insertCollectionInfo, insertCollectionSocial, insertCollectionContents, insertCollectionUpdateRecord } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions.js'
	// import { redirect } from '@sveltejs/kit';

	/* 
	Get user session
	*/
	export let data
	$: data

	const { sessionUserId } = data

    // const { supabase } = data

	/* 
	Let's declare some variables for...
	*/

	// collections_info
	let collectionId = ""
	let collectionTitle = ""
	let collectionType = ""
	let collectionStatus = ""
	let descriptionText = ""

	// collections_contents
	interface collectionObject {
		[index: string]: string
	}

	let collectionItems: object[] = []
	$: collectionItems
	let itemAdded = false

    console.log(collectionItems)

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
	// async function upsertMusicData() {
	// 	const { upsertArtists, upsertReleaseGroups, upsertRecordings } = await prepareMusicDataUpsert( collectionItems, collectionType )

	// 	let item = {
	// 		tableName: "artists",
	// 		itemData: upsertArtists
	// 	}

	// 	const artistRes = await itemUpsert({item, locals: { supabase }})
	// 	const artistStatus = artistRes.statusText

	// 	if (collectionType == "release_groups") {
	// 		item = {
	// 			tableName: "release_groups",
	// 			itemData: upsertReleaseGroups
	// 		}
	// 		const rgRes = await itemUpsert({item, locals: { supabase }})
	// 		const rgStatus = rgRes.statusText
	// 		return { artistStatus, rgStatus }
	// 	}

	// 	if (collectionType == "recordings") {
	// 		item = {
	// 			tableName: "release_groups",
	// 			itemData: upsertReleaseGroups
	// 		}
	// 		const rgRes = await itemUpsert({item, locals: { supabase }});
	// 		item = {
	// 			tableName: "recordings",
	// 			itemData: upsertRecordings
	// 		}
	// 		const recRes = await itemUpsert({item, locals: { supabase }});
	// 		const rgStatus = rgRes.statusText
	// 		const recStatus = recRes.statusText
	// 		return { artistStatus, rgStatus, recStatus }
	// 	}

	// 	return artistStatus

	// }

	// Insert row into table collections_info, returns collection_id to be used in subsequent REST requests
	// async function submitCollectionInfo() {

    //     const infoChangelog: App.Changelog = {}
    //     infoChangelog[timestampISOString] = {
    //         "updated_at": timestampISO,
    //         "updated_by": sessionUserId,
	// 		"title": collectionTitle,
	// 		"status": collectionStatus,
	// 		"description_text": descriptionText
    //     }
	// 	// formats data as expected by collections_info
	// 	const collectionInfo = {
	// 		"owner_id": sessionUserId,
	// 		"created_by": sessionUserId,
    //         "created_at": timestampISO,
    //         "updated_at": timestampISO,
	// 		"title": collectionTitle,
	// 		"type": collectionType,
	// 		"status": collectionStatus,
	// 		"description_text": descriptionText,
    //         "changelog": infoChangelog
	// 	}

	// 	const collectionInfoResponse = await insertCollectionInfo( { collectionInfo, locals: { supabase }} );
	// 	collectionId = await collectionInfoResponse[0]["collection_id"];

    //     const socialChangelog: App.Changelog = {}

    //     socialChangelog[timestampISOString] = {
    //         'follows_now': true,
    //         'user_role': 'owner'
    //     }
	// 	const socialInfo = {
	// 		"collection_id": collectionId,
	// 		"user_id": id,
	// 		"user_role": "owner",
    //         "updated_at": timestampISO,
    //         "changelog": socialChangelog
	// 	}

	// 	await insertCollectionSocial( { socialInfo, locals: {supabase} } );
	// 	await insertCollectionUpdateRecord({ sessionUserId, collectionId, locals: { supabase }});

	//  }
	
	// Inserts rows into table collections_contents using collection_id returned after "submitCollectionContents" runs, and only once relevant mbids have been added to their respective music data tables (artists, release_groups, and/or recordings)
	// async function submitCollectionContents() {
    //     console.log("button clicked")

	// 	for ( const collectionItem of collectionItems ) {
	// 		const thisItem = collectionItem as collectionObject
	// 		thisItem["item_position"] = thisItem["id"];
	// 		delete thisItem["id"];
	// 	}
		
    //     console.log("IDs updated")

	// 	await submitCollectionInfo();
    //     console.log("collection info submitted")

	// 	await upsertMusicData();
    //     console.log("music data upserted")

	// 	const collectionContents = await populateCollectionContents( collectionItems, collectionId );
    //     console.log("collection contents populated")

	// 	const res = await insertCollectionContents( { collectionContents, locals: { supabase }});

    //     if ( res.status === 201 ) {
    //         goto(`/collection/${collectionId}`)
    //     }
    //     else {
    //         goto(`/collections`)
    //     }

	// }
</script>

<div class="panel">
    <PanelHeader>
        new collection
    </PanelHeader>
    <form
        class="horizontal"
        method="POST"
        action="?/insertCollection"
    >
        <div class="form-column">
            <input
                type="hidden"
                name="session-user-id"
                id="session-user-id"
                value={sessionUserId}
            />
            <input 
                type="hidden"
                name="collection-contents"
                id="collection-contents"
                value={JSON.stringify(collectionItems)}
            />
            <label 
                class="text-label" 
                for="collection-title"
            >
                collection name
            </label>
            <input 
                class="text" 
                type="text" 
                name="collection-title" 
                id="collection-title" 
                bind:value={collectionTitle} 
                required 
            />
            <fieldset>
                <legend>Type of collection</legend>
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
                <legend>Status of collection</legend>
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
            <button 
                class="double-border-top" 
                type="submit"
                formAction="?/insertCollection"
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
    .search-bar {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);
		margin: var(--freq-spacing-3x-small) 0;
    }
</style>
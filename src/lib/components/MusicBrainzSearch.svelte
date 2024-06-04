<script lang="ts">
    import { categoriesTable } from '$lib/resources/parse-data/categoriesTable.ts'

	export let searchCategory: string //expects "albums", "release_groups", "recordings", or "labels"
    export let searchButtonText: string
    export let searchPlaceholder: string
    export let addedItems: any
    export let newItemAdded: boolean
	export let mode: string //expects "single" or "collection"

    let dialog: any

    /*
	Functions to call MusicBrainz database and parse relevant data.
	*/

	// search MusicBrainz using form info
	let mbData: any
	let query: string
	let searchComplete: boolean
	async function mbSearch() {
		console.log(searchCategory, query)
		const apiCategory = categoriesTable[`${searchCategory}`]

		let apiString = "https://musicbrainz.org/ws/2/"
		apiString = apiString.concat(apiCategory)
        const endpoint = new URL (apiString)
            
		endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("query", `${query}`)

		if (searchCategory == "recordings") {
			endpoint.searchParams.set("inc", "releases+release-groups+artist-rels")
		}

        const res = await fetch(endpoint)
        const searchResults = await res.json()

        const mbObjectKey = apiCategory.concat('s')
		mbData = searchResults[mbObjectKey]
		
		searchComplete =  true
		return {
			mbData, searchComplete
		}
    }

	// returns mbid and label name for earliest release in release group
	async function getLabel( item: any ) {
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
				if (label == true && releaseMbid == true) {
					return { releaseMbid, label };
				}
				else {
					return {releaseMbid: "", label: ""}
				}
			}
		}
	}


    // API call to Cover Art Archive using releaseMbid returned by getLabel()
    async function getCoverArt ( release_group_mbid: string ) {
        const endpoint = `http://coverartarchive.org/release-group/${release_group_mbid}/front`;
        const res = await fetch(endpoint);
        console.log(res);
        const coverArtUrl = await res["url"];

        return  coverArtUrl;
    }

    // adds item from MusicBrainz search results to collection editor
	async function addCollectionItem( item: any ) {
		if ( searchCategory == "artists" ) {
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
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
				"id": addedItems.length + 1
			}];
		}
		else if ( searchCategory == "release_groups" ) {
			const releaseGroup = {
				mbid: item["id"],
				releaseDate: item["first-release-date"] 
			}
			const { label } = await getLabel(releaseGroup);
			const coverArt = await getCoverArt( releaseGroup.mbid );
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
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
				"id": addedItems.length + 1
			}];
		}
		else if ( searchCategory == "recordings" ) {
			let remixerMbid = null;
			if ( item["relations"][0]["artist"]["type"] == "remixer" ) {
				remixerMbid = item["relations"][0]["artist"]["id"];
			}
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
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
				"id": addedItems.length +1
			}];
		}
		return newItemAdded = true
	}

	// adds single item from MusicBrainz search results to whatever needs it
	async function addSingleItem( item: any ) {
		if ( searchCategory == "artists" ) {
			addedItems =  {
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
			};
		}
		else if ( searchCategory == "release_groups" ) {
			const releaseGroup = {
				mbid: item["id"],
				releaseDate: item["first-release-date"] 
			}
			const { label } = await getLabel(releaseGroup);
			const coverArt = await getCoverArt( releaseGroup.mbid );
			addedItems = {
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
			};
		}
		else if ( searchCategory == "recordings" ) {
			let remixerMbid = null;
			if ( item["relations"][0]["artist"]["type"] == "remixer" ) {
				remixerMbid = item["relations"][0]["artist"]["id"];
			}
			addedItems = {
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
			};
		}
		return newItemAdded = true
	}

</script>

<div class="search-bar">
    <dialog
		aria-label="search results dialog"
		bind:this={dialog}
	>
		<div class="dialog-header">
			<h1>Results for <span>{query}</span></h1>
			<button aria-label="close dialog" on:click={() => dialog.close()}>x</button>
		</div>
        {#if searchComplete}
        <ul>
            {#each mbData as item}
            <li>
				{#if mode === "collection"}
					<button 
						class="standard"
						aria-label="add item"
						on:click|preventDefault={() => addCollectionItem(item)}
						on:click={() => dialog.close()}
					>
						+ add
					</button>
				{:else if mode === "single"}
					<button 
						class="standard"
						aria-label="add item"
						on:click|preventDefault={() => addSingleItem(item)}
						on:click={() => dialog.close()}
					>
						+ add
					</button>
				{/if}
				<p>
					{#if searchCategory == "artists"}
                    <span>{item["name"]}</span>
                    ({item["area"]["name"]}, 
                    {item["life-span"]["begin"]})
                {:else if searchCategory == "release_groups"}
                    <span >{item["title"]}</span>  by 
                    {item["artist-credit"][0]["artist"]["name"]} 
                    ({item["first-release-date"]})
                {:else if searchCategory == "recordings"}
                    <span>{item["name"]}</span> by 
                    {item["artist-credit"][0]["artist"]["name"]} 
                    ({item["first-release-date"]})
                {/if}
				</p>
            </li>
			<hr />
            {/each}
        </ul>
        {/if}
    </dialog>
    <button 
        class="double-border-top"
        on:click={() => dialog.showModal()}
        on:click|preventDefault={mbSearch} 
        disabled={!(searchCategory)}
    >
        <div class="inner-border">
            {searchButtonText}
        </div>
    </button>
    <input
        class="search" 
        type="search" 
        id="searchQuery" 
        name="query" 
        placeholder={searchPlaceholder}
        aria-label={searchPlaceholder}
        size="40" 
        bind:value={query}
    />
</div>

<style>
    .search-bar {
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 0;
        align-items: center;
    }
    .search-bar button{
        width: auto;
    }
    dialog {
        text-decoration: none;
    }
	.dialog-header {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
	.dialog-header h1 {
		font-size: var(--freq-font-size-x-small);
	}
	.dialog-header h1 span {
		text-transform: uppercase;
	}
	.dialog-header button {
		width: fit-content;
		text-transform: uppercase;
		padding: var(--freq-spacing-2x-small) var(--freq-spacing-x-small);
		font-weight: var(--freq-font-weight-bold);
		text-align: center;
	}
	button.standard {
		width: 60px;
		padding-left: 2px;
		padding-right: 2px;
	}
    ul {
		padding: 0;
        list-style: none;
		font-size: var(--freq-font-size-small);

    }
	li {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: var(--freq-spacing-2x-small);
	}
    li span {
		font-size: var(--freq-font-size-medium);
        font-weight: var(--freq-font-weight-medium);
    }
	li p {
		margin: 0 calc( var(--freq-inline-gap) * 2 );
	}
</style>
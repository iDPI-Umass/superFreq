<!-- 
 Example:

	<MusicBrainzSearch 
		searchCategory={collectionType}
		bind:addedItems={collectionItems}
		bind:newItemAdded={itemAdded}
		searchButtonText={`add ${buttonTextLookup[collectionType]}`}
		searchPlaceholder={placeholderText}
		mode="collection"
	></MusicBrainzSearch>
-->

<script lang="ts">
	import { onMount } from 'svelte'
	import { enhance } from '$app/forms'
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
    import { categoriesTable } from '$lib/resources/parseData.ts'

	export let searchCategory: string // "artists" | "release_groups" | "releases" | "recordings" | "labels"
    export let searchButtonText: string
    export let searchPlaceholder: string
    export let addedItems: any
    export let newItemAdded: boolean
	export let mode: string // "single" | "collection"
	export let limit = '25'
	export let query = ''
	export let requestSubmit = false

	let showModal = false

    /*
	Functions to call MusicBrainz database and parse relevant data.
	*/

	// search MusicBrainz using form info
	let mbData: any
	let searchComplete: boolean
	async function mbSearch() {
		console.log(searchCategory, query)
		const apiCategory = categoriesTable[`${searchCategory}`]

		let apiString = "https://musicbrainz.org/ws/2/"
		apiString = apiString.concat(apiCategory)
        const endpoint = new URL (apiString)
            
		endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("query", `${query}`)
		endpoint.searchParams.set("limit", limit)

		if (searchCategory == "recordings") {
			endpoint.searchParams.set("inc", "releases+release-groups+artist-rels")
		}

        const res = await fetch(endpoint)
        const searchResults = await res.json()

        const mbObjectKey = apiCategory.concat('s')
		mbData = searchResults[mbObjectKey]
		
		searchComplete =  true
		showModal = true
		return {
			mbData, searchComplete
		}
    }

	// returns mbid and label name for earliest release in release group
	async function getLabel( item: any ) {
		const releaseGroupMbid = item["mbid"];
		const releaseDate = item["releaseDate"];
		let labelName: string | null = null
		let labelMbid: string | null = null
		const endpoint = `https://musicbrainz.org/ws/2/release?release-group=${releaseGroupMbid}&inc=labels&fmt=json`;
		const res = await fetch (endpoint);
		let releases = await res.json();
		releases = releases["releases"];

		console.log(releases)

        for ( const release of releases ) {
			if ( releaseDate == release["date"] ) {
				if ( release["label-info"].length > 0 ) {
					labelName = release["label-info"][0]["label"]["name"];
					labelMbid = release["label-info"][0]["label"]["id"];
				}
				return { labelName, labelMbid }
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
		if ( limit && addedItems.length === limit ) {
			alert(`Only ${limit} items are allowed in this collection. Please delete an item before you add something new.`)
			return addedItems
		}

		let labelName: string | null = null
		let labelMbid: string | null = null
		if ( searchCategory == "artists" ) {
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
				"artist_mbid": item["id"],
				"artist_name": item["name"],
				"release_group_mbid": null,
				"release_group_name": null,
				"release_date": null,
				"recording_mbid": null,
				"recording_name": null,
				"remixer_mbid": null,
				"img_url": null,
				"label_name": null,
				"label_mbid": null,
				"notes": null,
				"id": addedItems.length + 1
			}];
		}
		else if ( searchCategory == "release_groups" ) {
			const releaseGroup = {
				mbid: item["id"],
				releaseDate: item["first-release-date"] 
			}
			const label = await getLabel(releaseGroup);
			labelName = label?.labelName ?? null
			labelMbid = label?.labelMbid ?? null
			const coverArt = await getCoverArt( releaseGroup.mbid );
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
				"artist_mbid": item["artist-credit"][0]["artist"]["id"],
				"artist_name": item["artist-credit"][0]["artist"]["name"],
				"release_group_mbid": item["id"],
				"release_group_name": item["title"],
				"release_date": item["first-release-date"],
				"recording_mbid": null,
				"recording_name": null,
				"remixer_mbid": null,
				"img_url": coverArt,
				"label_name": labelName, 
				"label_mbid": labelMbid,
				"notes": null,
				"id": addedItems.length + 1
			}];
		}
		else if ( searchCategory == "recordings" ) {

			let remixerMbid: string | null = null;
			if ( item["relations"][0]["artist"]["type"] == "remixer" ) {
				remixerMbid = item["relations"][0]["artist"]["id"];
			}
			const releaseGroup = item["releases"][0]["release-group"]["id"];
			const releaseDate = item["first-release-date"]
			const labelObject = {
				'mbid': releaseGroup,
				'releaseDate': releaseDate
			}
			const label = await getLabel(labelObject);
			labelName = label?.labelName ?? null
			labelMbid = label?.labelMbid ?? null
			const coverArt = await getCoverArt( releaseGroup );
			addedItems = [...addedItems, {
				"item_position": addedItems.length,
				"artist_mbid": item["artist-credit"][0]["artist"]["id"],
				"artist_name": item["artist-credit"][0]["artist"]["name"],
				"release_group_mbid": item["releases"][0]["release-group"]["id"],
				"release_group_name": item["releases"][0]["release-group"]["title"],
				"recording_mbid": item["id"],
				"recording_name": item["title"],
				"release_date": item["first-release-date"],
				"remixer_mbid": remixerMbid,
				"img_url": coverArt,
				"label_name": labelName, 
				"label_mbid": labelMbid,
				"notes": null,
				"id": addedItems.length +1
			}];
		}
		newItemAdded = true
		query = ""
		searchComplete = false
		console.log(addedItems)
		return {newItemAdded, showModal, query, searchComplete}
	}

	// adds single item from MusicBrainz search results to whatever needs it
	async function addSingleItem( item: any ) {
		console.log(item)
		let labelName: string | null = null
		let labelMbid: string | null = null
		if ( searchCategory == "artists" ) {
			addedItems =  {
				"artist_mbid": item["id"],
				"artist_name": item["name"],
				"release_group_mbid": null,
				"release_group_name": null,
				"release_date": null,
				"recording_mbid": null,
				"recording_name": null,
				"remixer_mbid": null,
				"img_url": null,
				"label": null,
				"notes": null,
			};
		}
		else if ( searchCategory == "release_groups" ) {
			const releaseGroup = {
				mbid: item["id"],
				releaseDate: item["first-release-date"] 
			}
			const label = await getLabel(releaseGroup);
			labelName = label?.labelName ?? null
			labelMbid = label?.labelMbid ?? null
			const coverArt = await getCoverArt( releaseGroup.mbid );
			addedItems = {
				"artist_mbid": item["artist-credit"][0]["artist"]["id"],
				"artist_name": item["artist-credit"][0]["artist"]["name"],
				"release_group_mbid": item["id"],
				"release_group_name": item["title"],
				"release_date": item["first-release-date"],
				"recording_mbid": null,
				"recording_name": null,
				"remixer_mbid": null,
				"img_url": coverArt,
				"label_name": labelName, 
				"label_mbid": labelMbid,
				"notes": null,
			};
		}
		else if ( searchCategory == "recordings" ) {
			console.log(item)
			let remixerMbid: string | null = null;
			if ( item["releations"] && item["relations"][0]["artist"]["type"] == "remixer" ) {
				remixerMbid = item["relations"][0]["artist"]["id"];
			}
			const releaseGroup = item["releases"][0]["release-group"]["id"];
			const releaseDate = item["first-release-date"]
			const labelObject = {
				'mbid': releaseGroup,
				'releaseDate': releaseDate
			}
			const label = await getLabel(labelObject);
			labelName = label?.labelName ?? null;
			labelMbid = label?.labelMbid ?? null;
			const coverArt = await getCoverArt( releaseGroup );
			addedItems = {
				"artist_mbid": item["artist-credit"][0]["artist"]["id"],
				"artist_name": item["artist-credit"][0]["artist"]["name"],
				"release_group_mbid": item["releases"][0]["release-group"]["id"],
				"release_group_name": item["releases"][0]["release-group"]["title"],
				"recording_mbid": item["id"],
				"recording_name": item["title"],
				"release_date": item["first-release-date"],
				"remixer_mbid": remixerMbid,
				"img_url": coverArt,
				"label_name": labelName, 
				"label_mbid": labelMbid,
				"notes": null,
			};
		}
		newItemAdded = true
		showModal = false
		query = ""
		searchComplete = false
		console.log(addedItems)
		return {newItemAdded, showModal, addedItems, query, searchComplete}
	}
</script>

<div class="search-bar">
	<ListModal bind:showModal>
		<h1 slot="header-text">
			Results for <span class="dialog-header">{query}</span>
		</h1>
		<div slot="list">
			{#if searchComplete}
				<ol>
					{#each mbData as item}
					<li>
						{#if mode === "collection"}
							<button 
								class="standard"
								aria-label="add item"
								on:click|preventDefault={() => addCollectionItem(item)}
								on:click={() => ( showModal = false )}
							>
								+ add
							</button>
						{:else if mode === "single"}
							<button 
								class="standard"
								aria-label="add item"
								on:click|preventDefault={() => addSingleItem(item)}
								on:click={() => ( showModal = false )}
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
							<span>{item["title"]}</span> by 
							{item["artist-credit"][0]["artist"]["name"]} 
							({item["disambiguation"] ?? item["releases"][0]["release-group"]["title"]})
						{/if}
						</p>
					</li>
					<hr />
					{/each}
				</ol>
			{/if}
		</div>
	</ListModal>
	<form class="search">
		<button 
			class="double-border-top"
			on:click={mbSearch} 
			
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
	</form>
</div>

<style>
    .search-bar {
        display: flex;
        flex-direction: row;
		height: fit-content;
		width: auto;
        gap: 0;
        align-items: center;
    }
    .search-bar button{
        width: auto;
    }
	span.dialog-header {
		text-transform: uppercase;
	}
	button.standard {
		width: 60px;
		padding-left: 2px;
		padding-right: 2px;
	}
    ol {
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
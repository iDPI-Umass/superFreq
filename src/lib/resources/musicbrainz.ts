import { categoriesTable, mbidCategoryTable } from "$lib/resources/parseData"

import { PUBLIC_LAST_FM_API_KEY } from '$env/static/public'

const lastFmApiKey = PUBLIC_LAST_FM_API_KEY ?? process.env.LAST_FM_API_KEY

export const mbSearch = async function ( query: string, searchCategory: string, limit: string ) {
    if ( !query ) {
        return { mbData: null, searchComplete: false }
    }

    const apiCategory = categoriesTable[searchCategory] as string

    let apiString = "https://musicbrainz.org/ws/2/";
    apiString = apiString.concat(apiCategory);
    const endpoint = new URL (apiString);
        
    endpoint.searchParams.set("fmt", "json");
    endpoint.searchParams.set("query", `${query}`)
    endpoint.searchParams.set("limit", limit)

    if (searchCategory == "recordings") {
        endpoint.searchParams.set("inc", "releases+release-groups+artist-rels");
    }

    const res = await fetch(endpoint);
    const searchResults = await res.json();

    const mbObjectKey = apiCategory.concat('s');
    const mbData = searchResults[mbObjectKey];

    return { mbData, searchComplete: true}
}

// returns mbid and label name for earliest release in release group
export const getLabel = async function( item: App.RowData ) {
    const releaseGroupMbid = item["mbid"]
    const releaseDate = item["releaseDate"]
    let labelName: string | null = null
    let labelMbid: string | null = null

    const endpoint = `https://musicbrainz.org/ws/2/release?release-group=${releaseGroupMbid}&inc=labels&fmt=json`

    const res = await fetch (endpoint)
    let releases = await res.json()
    releases = releases["releases"]

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

// find "mega" image in Last.fm JSON response
function getMega(img) {
    return img.size == "mega"
}

// API call to Cover Art Archive and Last.fm using album mbid 
export const getCoverArt = async function ( releaseGroup: App.Lookup ) {
    console.log(releaseGroup.mbid)
    const coverArtArchiveEndpoint = `https://coverartarchive.org/release-group/${releaseGroup.mbid}/front`
    const lastFmEndpoint = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${lastFmApiKey}&artist=${releaseGroup.artistName}&album=${releaseGroup.releaseGroupName}&format=json`

    try {
        const coverArtArchiveRes = await fetch(coverArtArchiveEndpoint)
        const coverArtUrl = coverArtArchiveRes["url"]
        return  coverArtUrl
    }
    catch ( error ) {
        const lastFmRes = await fetch(lastFmEndpoint)
        const lastFmData = await lastFmRes.json()
        const imgArray = lastFmData["album"]["image"]
        const megaImg = imgArray.find(getMega)
        const coverArtUrl = megaImg["#text"]
        return coverArtUrl
    }
}

// Get MBID category
export const mbidCateogory = function ( searchCategory: string ) {
    return mbidCategoryTable[searchCategory] as string
}

// Check if item is already in collection
export const checkDuplicate = function ( item: App.RowData, addedItems: App.RowData | App.RowData[], deletedItems: App.RowData[], mbidCategory: string ) {
    if ( deletedItems.length < 1 ) {
        return false
    }
    const itemMbid = item['id']
    const isDuplicate = addedItems.find((item) => item[mbidCategory] == itemMbid) ? true : false
    return isDuplicate
}

// Check if item was previously deleted
export const checkDeleted = function ( item: App.RowData, deletedItems: App.RowData | App.RowData[], mbidCategory: string ) {
    if (deletedItems.length <= 1) {
        return false
    }
    const itemMbid = item['id']
    const wasDeleted = deletedItems.find((item) => item[mbidCategory] == itemMbid) ? true : false
    return wasDeleted
}

// Check if collection has reached limit
export const checkLimit = function ( limit: string, addedItems: App.RowData | App.RowData[] ) {
    const limitValue = parseInt(limit)
    const limitReached = ( addedItems.length >= limitValue ) ? true : false
    return limitReached
}

// adds item from MusicBrainz search results to collection editor
export const addCollectionItem = async function ( 
    item: App.RowData, 
    addedItems: App.RowData[], 
    deletedItems: App.RowData[],
    limit: string, 
    searchCategory: string,
    mbidCategory: string, 
) {
    const isDuplicate = checkDuplicate( item, addedItems, deletedItems, mbidCategory )
    const wasDeleted = checkDeleted( item, deletedItems, mbidCategory )
    const limitReached = checkLimit ( limit, addedItems )

    const itemMbid = item['id']

    // Warn if item already in collection and don't add new item.
    if ( isDuplicate ) {
        alert(`That item is already in this collection.`)
        return {
            addedItems,
            deletedItems,
            newItemAdded: false
        }
    }

    // Delete item from deletedItems and warn that it was previously deleted from this collection, but let rest of function proceed.
    let originalId: string |  null = null

    if ( wasDeleted ) {
        const deletedItem = deletedItems.find((item) => item[mbidCategory] == itemMbid)
        originalId = deletedItem?.original_id
        deletedItems = deletedItems.filter((item) => item != deletedItem)
        alert(`That item was previously deleted from this collection, but will now be added back in.`)
    }

    // Warn if collection is at limit and don't add new item.
    if ( limitReached ) {
        alert(`Only ${limit} items are allowed in this collection. Please delete an item before you add something new.`)
        return {
            addedItems,
            deletedItems,
            newItemAdded: false
        }
    }

    // Add the item
    let labelName: string | null = null
    let labelMbid: string | null = null
    if ( searchCategory == "artists" ) {
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
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
            releaseDate: item["first-release-date"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["title"]
        }
        const label = await getLabel(releaseGroup);
        labelName = label?.labelName ?? null
        labelMbid = label?.labelMbid ?? null
        const coverArt = await getCoverArt( releaseGroup );
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
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
        if ( item["relations"] && item["relations"][0]["artist"]["type"] == "remixer" ) {
            remixerMbid = item["relations"][0]["artist"]["id"];
        }
        const releaseGroup = {
            mbid: item["releases"][0]["release-group"]["id"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["releases"][0]["release-group"]["title"]
        }
        const releaseDate = item["first-release-date"]
        const labelObject = {
            'mbid': releaseGroup.mbid,
            'releaseDate': releaseDate
        }
        const label = await getLabel(labelObject);
        labelName = label?.labelName ?? null
        labelMbid = label?.labelMbid ?? null
        const coverArt = await getCoverArt( releaseGroup );
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
            "item_position": addedItems.length,
            "artist_mbid": item["artist-credit"][0]["artist"]["id"],
            "artist_name": item["artist-credit"][0]["artist"]["name"],
            "release_group_mbid": item["releases"][0]["release-group"]["id"],
            "release_group_name": item["releases"][0]["release-group"]["title"],
            "recording_mbid": item["id"],
            "recording_name": item["title"],
            "release_date": item["first-release-date"],
            "remixer_artist_mbid": remixerMbid,
            "img_url": coverArt,
            "label_name": labelName, 
            "label_mbid": labelMbid,
            "notes": null,
            "id": addedItems.length +1
        }];
    }
    return {
        addedItems,
        deletedItems,
        newItemAdded: true
    }
}


// adds item from MusicBrainz search results to collection editor
export const addCollectionItemNoImg = async function ( 
    item: App.RowData, 
    addedItems: App.RowData[], 
    deletedItems: App.RowData[],
    limit: string, 
    searchCategory: string,
    mbidCategory: string, 
) {
    const isDuplicate = checkDuplicate( item, addedItems, deletedItems, mbidCategory )
    const wasDeleted = checkDeleted( item, deletedItems, mbidCategory )
    const limitReached = checkLimit ( limit, addedItems )

    const itemMbid = item['id']

    // Warn if item already in collection and don't add new item.
    if ( isDuplicate ) {
        alert(`That item is already in this collection.`)
        return {
            addedItems,
            deletedItems,
            newItemAdded: false
        }
    }

    // Delete item from deletedItems and warn that it was previously deleted from this collection, but let rest of function proceed.
    let originalId: string |  null = null

    if ( wasDeleted ) {
        const deletedItem = deletedItems.find((item) => item[mbidCategory] == itemMbid)
        originalId = deletedItem?.original_id
        deletedItems = deletedItems.filter((item) => item != deletedItem)
        alert(`That item was previously deleted from this collection, but will now be added back in.`)
    }

    // Warn if collection is at limit and don't add new item.
    if ( limitReached ) {
        alert(`Only ${limit} items are allowed in this collection. Please delete an item before you add something new.`)
        return {
            addedItems,
            deletedItems,
            newItemAdded: false
        }
    }

    // Add the item
    let labelName: string | null = null
    let labelMbid: string | null = null
    if ( searchCategory == "artists" ) {
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
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
            releaseDate: item["first-release-date"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["title"]
        }
        const label = await getLabel(releaseGroup);
        labelName = label?.labelName ?? null
        labelMbid = label?.labelMbid ?? null
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
            "item_position": addedItems.length,
            "artist_mbid": item["artist-credit"][0]["artist"]["id"],
            "artist_name": item["artist-credit"][0]["artist"]["name"],
            "release_group_mbid": item["id"],
            "release_group_name": item["title"],
            "release_date": item["first-release-date"],
            "recording_mbid": null,
            "recording_name": null,
            "remixer_mbid": null,
            "img_url": null,
            "label_name": labelName, 
            "label_mbid": labelMbid,
            "notes": null,
            "id": addedItems.length + 1
        }];
    }
    else if ( searchCategory == "recordings" ) {
        let remixerMbid: string | null = null;
        if ( item["relations"] && item["relations"][0]["artist"]["type"] == "remixer" ) {
            remixerMbid = item["relations"][0]["artist"]["id"];
        }
        const releaseGroup = {
            mbid: item["releases"][0]["release-group"]["id"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["releases"][0]["release-group"]["title"]
        }
        const releaseDate = item["first-release-date"]
        const labelObject = {
            'mbid': releaseGroup.mbid,
            'releaseDate': releaseDate
        }
        const label = await getLabel(labelObject);
        labelName = label?.labelName ?? null
        labelMbid = label?.labelMbid ?? null
        addedItems = [...addedItems, {
            "original_id": originalId ?? null,
            "item_position": addedItems.length,
            "artist_mbid": item["artist-credit"][0]["artist"]["id"],
            "artist_name": item["artist-credit"][0]["artist"]["name"],
            "release_group_mbid": item["releases"][0]["release-group"]["id"],
            "release_group_name": item["releases"][0]["release-group"]["title"],
            "recording_mbid": item["id"],
            "recording_name": item["title"],
            "release_date": item["first-release-date"],
            "remixer_artist_mbid": remixerMbid,
            "img_url": null,
            "label_name": labelName, 
            "label_mbid": labelMbid,
            "notes": null,
            "id": addedItems.length +1
        }];
    }
    return {
        addedItems,
        deletedItems,
        newItemAdded: true
    }
}

// Adds single item from MusicBrainz search results to whatever needs it. This was originally written for the profile avatar search, but is not currently being used. Could probably be deleted.
export const addSingleItem = async function  (     
    item: App.RowData, 
    addedItems: App.RowData, 
    searchCategory: string,  
) {
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
        }
    }
    else if ( searchCategory == "release_groups" ) {
        console.log(item)
        const releaseGroup = {
            mbid: item["id"],
            releaseDate: item["first-release-date"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["title"]
        }
        const label = await getLabel(releaseGroup);
        labelName = label?.labelName ?? null
        labelMbid = label?.labelMbid ?? null
        const coverArt = await getCoverArt( releaseGroup );
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
        }
    }
    else if ( searchCategory == "recordings" ) {
        let remixerMbid: string | null = null;
        if ( item["releations"] && item["relations"][0]["artist"]["type"] == "remixer" ) {
            remixerMbid = item["relations"][0]["artist"]["id"];
        }
        const releaseGroup = {
            mbid: item["releases"][0]["release-group"]["id"],
            artistName: item["artist-credit"][0]["artist"]["name"],
            releaseGroupName: item["releases"][0]["release-group"]["title"]
        }
        const releaseDate = item["first-release-date"]
        const labelObject = {
            'mbid': releaseGroup.mbid,
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
            "remixer_artist_mbid": remixerMbid,
            "img_url": coverArt,
            "label_name": labelName, 
            "label_mbid": labelMbid,
            "notes": null,
        }
    }
    return {
        addedItems
    }
}
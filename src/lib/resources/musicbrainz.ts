import { categoriesTable, mbidCategoryTable, itemTypeTable } from "$lib/resources/parseData"

import { PUBLIC_LAST_FM_API_KEY } from '$env/static/public'

const lastFmApiKey = PUBLIC_LAST_FM_API_KEY

/*
//
** Search
//
*/

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
export const getLabel = async function( searchCategory: string, releaseGroupMbid: string, releaseDate: string ) {
    let name = null
    let mbid = null

    const endpoint = `https://musicbrainz.org/ws/2/release?release-group=${releaseGroupMbid}&inc=labels&fmt=json`

    if ( searchCategory == 'release_groups' || searchCategory == 'recordings' ) {
        const res = await fetch (endpoint)
        let releases = await res.json()
        releases = releases["releases"]
    
        if ( releases && releases.length > 0) {
            for ( const release of releases ) {
                if ( releaseDate == release["date"] ) {
                    if ( release["label-info"].length > 0 ) {
                        name = release["label-info"][0]["label"]["name"];
                        mbid = release["label-info"][0]["label"]["id"];
                    }
                    return { name, mbid }
                }
            }
        }

    }
    return { name, mbid }
}

/*
//
** Get various metadata
//
*/

export const mbidCateogory = function ( searchCategory: string ) {
    return mbidCategoryTable[searchCategory] as string
}

export const artistMbid = function ( searchCategory: string, item: App.RowData ) {
    let mbid = null
    if ( searchCategory == 'artists' ) {
        mbid = item["id"] ?? null
    }
    else if ( searchCategory == 'release_groups' ) {
        mbid = item["artist-credit"][0]["artist"]["id"] ?? null
    }
    else if ( searchCategory == 'recordings' ) {
        mbid = item["artist-credit"][0]["artist"]["id"] ?? null
    }
    return mbid
}

export const artistName = function ( searchCategory: string, item: App.RowData ) {
    let name = null
    if ( searchCategory == 'artists' ) {
        name = item["name"] ?? null
    }
    else if ( searchCategory == 'release_groups' ) {
        name = item["artist-credit"][0]["artist"]["name"] ?? null
    }
    else if ( searchCategory == 'recordings' ) {
        name = item["artist-credit"][0]["artist"]["name"] ?? null
    }
    return name
}

export const artistOrigin = function ( searchCategory: string, item: App.RowData ) {
    let origin = null
    if ( searchCategory == 'artists' ) {
        origin = item["area"] ? item["area"]["name"] : null
    }
    return origin
}

export const releaseGroupMetadata =  function ( searchCategory: string, item: App.RowData ) {
    let releaseGroup = {           
        mbid: null,
        release_date: null,
        artist_name: null,
        release_group_name: null
    } as App.RowData

    if ( searchCategory == 'release_groups' ) {
        releaseGroup = {
            mbid: item["id"],
            release_date: item["first-release-date"],
            artist_name: item["artist-credit"][0]["artist"]["name"],
            release_group_name: item["title"]
        }
    }
    else if ( searchCategory == 'recordings' ) {
        releaseGroup = {
            mbid: item["releases"][0]["release-group"]["id"],
            release_date: null,
            artist_name: item["artist-credit"][0]["artist"]["name"],
            release_group_name: item["releases"][0]["release-group"]["title"]
        }
    }
    return releaseGroup
}

export const releaseGroupMbid  = function ( searchCategory: string, item: App.RowData ) {
    let mbid = null
    if ( searchCategory == 'release_groups' ) {
        mbid = item["id"] ?? null
    }
    else if ( searchCategory == 'recordings' ) {
        mbid = item["releases"][0]["release-group"]["id"] ?? null
    }
    return mbid
}

export const releaseGroupName = function ( searchCategory: string, item: App.RowData ) {
    let name = null
    if ( searchCategory == 'release_groups' ) {
        name = item["title"] ?? null
    }
    else if ( searchCategory == 'recordings' ) {
        name = item["releases"] ? item["releases"][0]["release-group"]["title"] : null
    }
    return name
}

export const recordingMbid = function ( searchCategory: string, item: App.RowData ) {
    let name = null
    if ( searchCategory == 'recordings' ) {
        name = item["id"] ?? null
    }
    return name
}


export const recordingName = function ( searchCategory: string, item: App.RowData ) {
    let name = null
    if ( searchCategory == 'recordings' ) {
        name = item["title"] ?? null
    }
    return name
}

export const remixerMbid = function ( searchCategory: string, item: App.RowData ) {
    let mbid = null
    if ( searchCategory == 'recordings' ) {
        mbid = item["releations"] && item["relations"][0]["artist"]["type"] == "remixer" ? item["relations"][0]["artist"]["id"] : null
    }
    return mbid
}

export const itemDate = function ( searchCategory: string, item: App.RowData ) {
    let date = ''
    if ( searchCategory == 'artists' ) {
        date = item["life-span"] ? item["life-span"]["begin"] : ''
    }
    else if ( searchCategory == 'release_groups' ) {
        date = item["first-release-date"] ?? ''
    }
    return date
}

/*
//
** Get cover art from Cover Art Archive or Last.fm
//
*/

function getMegaImage(img: App.Lookup) {
    return img.size == "mega"
}

export const getLastFmCoverArt = async function ( releaseGroup: App.Lookup ) {
    try {
        const lastFmEndpoint = `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${lastFmApiKey}&artist=${releaseGroup.artist_name}&album=${releaseGroup.release_group_name}&format=json`
        const lastFmRes = await fetch(lastFmEndpoint)
        const lastFmData = await lastFmRes.json()
        const imgArray = lastFmData["album"]["image"]
        const megaImg = imgArray.find(getMegaImage)
        const coverArtUrl = megaImg["#text"] as string
        return coverArtUrl
    }
    catch ( error ) {
        const coverArtUrl = null
        return coverArtUrl
    }
}

export const getCoverArt = async function ( releaseGroup: App.RowData ) {
    const coverArtArchiveEndpoint = `https://coverartarchive.org/release-group/${releaseGroup.mbid}/front`

    try {
        const coverArtArchiveRes = await fetch(coverArtArchiveEndpoint, { signal: AbortSignal.timeout(3000) })
        const coverArtArchiveUrl = coverArtArchiveRes["url"]
        const lastFmCoverArtUrl = await getLastFmCoverArt( releaseGroup )

        return  { coverArtArchiveUrl, lastFmCoverArtUrl, success: true }
    }
    catch ( error ) {
        const lastFmCoverArtUrl = await getLastFmCoverArt( releaseGroup )
        if ( lastFmCoverArtUrl ) {

            return { coverArtArchiveUrl: null, lastFmCoverArtUrl, success: true }
        }
        else {
            return { coverArtArchiveUrl: null, lastFmCoverArtUrl: null, success: false }
        }
    }
}

export const checkFetchedCoverArt = async function( item: App.RowData ){
    try {
        const imgUrl =  item["img_url"] as string
        const coverArt = await fetch( imgUrl, { signal: AbortSignal.timeout(5000)} )
        return coverArt
    }
    catch ( error ) {
        const releaseGroup = {
            artist_name: item["artist_name"],
            release_group_name: item["release_group_name"]
        }
        const coverArt = await getLastFmCoverArt(releaseGroup)
        if (coverArt) {
            return coverArt
        }
        else {
            throw new Error('request failed')
        }
    }
}

/*
//
** Add item from search results
//
*/

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
    const mbid = releaseGroupMbid( searchCategory, item )
    const releaseDate = itemDate( searchCategory, item )
    const label = await getLabel( searchCategory, mbid, releaseDate )
    const releaseGroup = releaseGroupMetadata(searchCategory, item )
    const coverArt = await getCoverArt( releaseGroup )

    addedItems = [...addedItems, {
        "original_id": originalId ?? null,
        "item_position": addedItems.length,
        "artist_mbid": artistMbid( searchCategory, item ),
        "artist_name": artistName( searchCategory, item ),
        "release_group_mbid": mbid,
        "release_group_name": releaseGroupName( searchCategory, item ),
        "recording_mbid": recordingMbid( searchCategory, item ),
        "recording_name": recordingName( searchCategory, item ),
        "remixer_mbid": remixerMbid( searchCategory, item ),
        "release_date": releaseDate,
        "img_url": coverArt.coverArtArchiveUrl,
        "last_fm_img_url": coverArt.lastFmCoverArtUrl,
        "label": label.name,
        "notes": null,
        "item_type": itemTypeTable[searchCategory],
        "id": addedItems.length + 1
    }]
    return {
        addedItems,
        deletedItems,
        newItemAdded: true
    }
}

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
    const mbid = releaseGroupMbid( searchCategory, item )
    const releaseDate = itemDate( searchCategory, item )
    const label = await getLabel( searchCategory, mbid, releaseDate )

    addedItems = [...addedItems, {
        "original_id": originalId ?? null,
        "item_position": addedItems.length,
        "artist_mbid": artistMbid( searchCategory, item ),
        "artist_name": artistName( searchCategory, item ),
        "release_group_mbid": mbid,
        "release_group_name": releaseGroupName( searchCategory, item ),
        "recording_mbid": recordingMbid( searchCategory, item ),
        "recording_name": recordingName( searchCategory, item ),
        "remixer_mbid": remixerMbid( searchCategory, item ) ?? null,
        "release_date": releaseDate,
        "img_url": null,
        "last_fm_img_url": null,
        "label": label.name,
        "notes": null,
        "item_type": itemTypeTable[searchCategory],
        "id": addedItems.length + 1
    }]
    return {
        addedItems,
        deletedItems,
        newItemAdded: true
    }
}

export const addSingleItem = async function  (     
    item: App.RowData, 
    addedItems: App.RowData, 
    searchCategory: string,  
) {
    const releaseGroup = releaseGroupMetadata(searchCategory, item )
    const coverArt = await getCoverArt( releaseGroup )
    const mbid = releaseGroupMbid( searchCategory, item )
    const releaseDate = itemDate( searchCategory, item )
    const label = await getLabel( searchCategory, mbid, releaseDate )
    addedItems =  {
        "artist_mbid": artistMbid( searchCategory, item ),
        "artist_name": artistName( searchCategory, item ),
        "release_group_mbid": mbid,
        "release_group_name": releaseGroupName( searchCategory, item ),
        "recording_mbid": recordingMbid( searchCategory, item ),
        "recording_name": recordingName( searchCategory, item ),
        "remixer_mbid": remixerMbid( searchCategory, item ),
        "release_date": releaseDate,
        "img_url": coverArt.coverArtArchiveUrl,
        "last_fm_img_url": coverArt.lastFmCoverArtUrl,
        "label": label.name,
        "notes": null,
        "item_type": itemTypeTable[searchCategory],
    }
    return {
        addedItems
    }
}

export const addSingleItemNoImg = async function  (     
    item: App.RowData, 
    addedItems: App.RowData, 
    searchCategory: string,  
) {
    const mbid = releaseGroupMbid( searchCategory, item )
    const releaseDate = itemDate( searchCategory, item )
    const label = await getLabel( searchCategory, mbid, releaseDate )
    addedItems =  {
        "artist_mbid": artistMbid( searchCategory, item ),
        "artist_name": artistName( searchCategory, item ),
        "release_group_mbid": mbid,
        "release_group_name": releaseGroupName( searchCategory, item ),
        "recording_mbid": recordingMbid( searchCategory, item ),
        "recording_name": recordingName( searchCategory, item ),
        "remixer_mbid": remixerMbid( searchCategory, item ),
        "release_date": releaseDate,
        "img_url": null,
        "last_fm_img_url": null,
        "label": label.name,
        "notes": null,
        "item_type": itemTypeTable[searchCategory],
    }
    return { addedItems }
}
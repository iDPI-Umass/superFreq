import { categoriesTable, mbidCategoryTable, itemTypeTable } from "$lib/resources/parseData"

import { PUBLIC_LAST_FM_API_KEY, PUBLIC_DISCOGS_KEY, PUBLIC_DISCOGS_SECRET,PUBLIC_DISCOGS_TOKEN, PUBLIC_WIKIDATA_ACCESS_TOKEN, PUBLIC_WIKIDATA_KEY, PUBLIC_WIKIDATA_SECRET } from '$env/static/public'
import wave from "$lib/assets/images/logo/freq-wave.svg"

const lastFmApiKey = PUBLIC_LAST_FM_API_KEY

const musicbrainzRequestHeader = {
    mode: 'cors',
    headers: {
        "User-Agent": "Freq/0.1 ( hello@freq.social )"
    }
}

const wikiToken = PUBLIC_WIKIDATA_ACCESS_TOKEN
const wikiKey = PUBLIC_WIKIDATA_KEY
const wikiSecret = PUBLIC_WIKIDATA_SECRET
const wikidataRequestHeader = {
    mode: 'cors',
    data: {
        'client_id': `${wikiKey}`,
        'client_secret':`${wikiSecret}`
    }
}

const discogsRequestHeader = {
    headers: {
        "Authorization": `Discogs key=${PUBLIC_DISCOGS_KEY}, secret=${PUBLIC_DISCOGS_SECRET}`,
      }
}

/*
//
** Metadata lookup
//
*/

export const musicbrainzLookup = async function ( mbid: string, mbidCategory: string ) {
    const apiCategory = categoriesTable[mbidCategory] as string

    const apiString = `https://musicbrainz.org/ws/2/${apiCategory}/${mbid}`
    const endpoint = new URL (apiString)

    if ( apiCategory == 'artist' ) {
        endpoint.searchParams.set('inc', 'aliases+recordings+label-rels+url-rels+release-groups')
        endpoint.searchParams.set('type', 'album')
    }
    else if ( apiCategory == 'release-group' ) {
        endpoint.searchParams.set('inc', 'artists+releases+label-rels+url-rels')
    }
    else if ( apiCategory == 'release' ) {
        endpoint.searchParams.set('inc', 'recordings+labels')
    }
    else if ( apiCategory == 'recording' ) {
        endpoint.searchParams.set('inc', 'artists+release-groups+releases+url-rels')
    }
    else {
        return null
    }

    endpoint.searchParams.set("fmt", "json")

    const res = await fetch( endpoint, musicbrainzRequestHeader )
    const metadata = await res.json() as App.RowData

    return metadata
}

// Useful for getting something like the Wikidata ID
export const musicbrainzMetadataRelationUrl = function ( relations: App.RowData[], relationType: string ) {
    if ( !relations || !relationType ) {
        return null
    }

    const thisRelation = relations.find(( element ) => element.type == relationType) as App.RowData[] ?? null
    const relationUrl = thisRelation?.url.resource as string ?? null
    return relationUrl
}

export const relationIdFromUrl = function ( relationUrl: string ) {
    const tokens = relationUrl ? relationUrl.split('/') : null
    const id = tokens ? tokens[tokens.length - 1] : null
    return id
}

export const getWikipediaUrlFromWikidata = async function ( wikidataId: string | null, language: string ) {
    if ( !wikidataId ) {
        return null
    }

    const apiString = `https://www.wikidata.org/w/rest.php/wikibase/v1/entities/items/${wikidataId}`
    const endpoint = new URL (apiString)

    const res = await fetch( endpoint, wikidataRequestHeader)
    const json = await res.json() as App.RowData

    const { sitelinks } = json
    const pageLanguage = language + 'wiki'
    const url = sitelinks[pageLanguage]['url']

    return url
}

export const getWikipediaPageExtract = async function ( wikiUrl: string ) {
    if ( !wikiUrl ) {
        return null
    }

    const tokens = wikiUrl.split('/')
    const pageTitle = tokens[tokens.length - 1]
    const extracttCharacterCount = 1000
    const extractLimit = 2
    const urlString = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${pageTitle}&exintro&explaintext`

    const endpoint = new URL (urlString)
    const res = await fetch( endpoint, wikidataRequestHeader )
    const json = await res.json()

    const extract = {
        'url': wikiUrl,
        'extract': Object.values(json.query.pages)[0]['extract']
    } as App.RowData

    return extract
}

export const discogsLookup = async function ( discogsUrl: string | null ) {
    if ( !discogsUrl ) {
        return null
    }
    const tokens = discogsUrl.split('/')
    const discogsId = tokens[tokens.length - 1]
    let category = tokens[tokens.length - 2]

    const apiString = `https://api.discogs.com/${category}s/${discogsId}`
    const discogsData = {}

    if ( category == 'artist' ) {
        const releasesApiString = apiString + '/releases?year,asc'

        const artistRes = await fetch( apiString, discogsRequestHeader )
        discogsData['artist'] = await artistRes.json()

        await delay(1000)

        const releasesRes = await fetch( releasesApiString, discogsRequestHeader )
        const { releases } = await releasesRes.json()
        discogsData['releases'] = releases
    }
    else if ( category == 'release' || category == 'master' ) {
        const res = await fetch ( apiString, discogsRequestHeader )
        discogsData['release'] =  await res.json()
    }
    else if ( category == 'label' ) {
        const releasesApiString = apiString + '/releases'

        const labelRes = await fetch ( apiString, discogsRequestHeader )
        discogsData['label'] = await labelRes.json()

        await delay(1000)
        
        const releasesRes = await fetch( releasesApiString, discogsRequestHeader )
        const { releases } = await releasesRes.json()
        discogsData['releases'] = releases
    }
    else {
        return null
    }

    return discogsData
}

export const metadataLookup =  async function ( mbid: string, mbidCategory: string ) {
    const musicbrainzMetadata = await musicbrainzLookup( mbid, mbidCategory )

    console.log(mbidCategory)

    if ( categoriesTable[mbidCategory] == 'release-group' ) {
        await delay(1000)
        const releaseMbid = musicbrainzMetadata['releases'][0]['id']
        const releaseMetadata = await musicbrainzLookup( releaseMbid, 'release' )
        const tracks = releaseMetadata['media'][0]['tracks']
        const labelInfo = releaseMetadata['label-info'][0]
        musicbrainzMetadata['tracks'] = tracks
        musicbrainzMetadata['label'] = labelInfo
    }
    else if ( categoriesTable[mbidCategory] == 'recording' ) {
        await delay(1000)
        const releaseGroupMbid = musicbrainzMetadata['releases'][0]['release-group']['id']
        const releaseGroupMetadata = await musicbrainzLookup( releaseGroupMbid, 'release-group' )
        const releaseGroupRelations = releaseGroupMetadata['relations']
        const appendedRelations = releaseGroupRelations.concat(releaseGroupRelations)
        musicbrainzMetadata.relations = appendedRelations
    }

    const { relations } = musicbrainzMetadata

    const wikidataUrl = musicbrainzMetadataRelationUrl( relations, 'wikidata' )
    const wikidataId = relationIdFromUrl( wikidataUrl )
    const wikipediaUrl = await getWikipediaUrlFromWikidata( wikidataId, 'en' )
    const wikipediaExtract = await getWikipediaPageExtract( wikipediaUrl )

    const discogsRelation = musicbrainzMetadataRelationUrl( relations, 'discogs')
    const discogsData = await discogsLookup( discogsRelation )

    return { musicbrainzMetadata, wikipediaExtract, discogsData }
}


/*
//
** Search
//
*/

export const mbSearch = async function ( query: string, searchCategory: string, limit: string = '10' ) {
    if ( !query ) {
        return { mbData: null, searchComplete: false }
    }

    const apiCategory = categoriesTable[searchCategory] as string

    let apiString = "https://musicbrainz.org/ws/2/";
    apiString = apiString.concat(apiCategory)
    const endpoint = new URL (apiString)
        
    endpoint.searchParams.set("fmt", "json")
    endpoint.searchParams.set("query", `${query}`)
    endpoint.searchParams.set("limit", limit)

    if (searchCategory == "recordings") {
        endpoint.searchParams.set("inc", "releases+release-groups+artist-rels");
    }

    const res = await fetch(endpoint)
    const searchResults = await res.json()

    const mbObjectKey = apiCategory.concat('s')
    const mbData = searchResults[mbObjectKey]

    return { mbData, searchComplete: true}
}


async function delay ( milliseconds: number ) { 
    new Promise(resolve => setTimeout(resolve, milliseconds)) 
}

export const musicbrainzAdvancedSearch = async function ( category: string, searchTerms: any, limit: number = 25 ) {

    await delay(2000)

    const { artistName, releaseGroupName, recordingName } = searchTerms

    const apiCategory = categoriesTable[category] as string

    let query: string


        
    // endpoint.searchParams.set("fmt", "json")
    // endpoint.searchParams.set("query", `${query}`)
    // endpoint.searchParams.set("limit", limit)

    if ( apiCategory == 'release-group' ) {
        query = releaseGroupName as string
        if ( artistName ) {
            query = query + ' AND artistname:' + artistName
        }
    }
    else if ( apiCategory == 'recording' ) {
        query = recordingName
        if ( artistName ) {
            query = query + ' AND artistname:' + artistName
        }
        if ( releaseGroupName ) {
            query = query + ' AND release:' + releaseGroupName
        }
    }
    // endpoint.searchParams.set("fmt", "json")
    // endpoint.searchParams.set("query", `${query}`)
    // endpoint.searchParams.set("limit", limit)


    const apiString = `https://musicbrainz.org/ws/2/${apiCategory}/?query=${query}&fmt=json&limit=${limit}`;
    const endpoint = new URL(apiString)

    const res = await fetch(endpoint, musicbrainzRequestHeader)
    const searchResults = await res.json()

    return { searchResults }


}

export const discogsSearch = async function ( searchTerms: any ) {
    const { releaseGroupName, artistName } = searchTerms
    const apiString = `https://api.discogs.com/database/search?release_title=${releaseGroupName}&artist=${artistName}`
    const endpoint = new URL(apiString)
    const res = await fetch(endpoint, discogsRequestHeader)
    const searchResults = await res.json()
    return searchResults
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



// Get URLs in artist MusicBrainz entry
export const getArtistUrlRels = async function ( mbid: string ) {
    const endpoint = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels&fmt=json`

    const url = new URL(endpoint)

    const res = await fetch(url, {
        mode: 'cors',
        headers: {
            "User-Agent": "Freq/0.1 ( hello@freq.social )"
        }

    })
    const json = await res.json()
    const relations = json.relations ?? null

    return { relations }
}

// Get URL from MusicBrainz artist relations
export const getRelationUrl = function ( relations: App.RowData[], relationType: string ) {

    if ( !relations || !relationType ) {
        return { relationUrl: null }
    }

    const thisRelation = relations?.find((element) => element.type == relationType) ?? null

    const relationUrl = thisRelation?.url?.resource ?? null

    return { relationUrl }
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
        release_group_mbid: null,
        release_date: null,
        artist_name: null,
        release_group_name: null
    } as App.RowData

    if ( searchCategory == 'release_groups' ) {
        releaseGroup = {
            release_group_mbid: item["id"],
            release_date: item["first-release-date"],
            artist_name: item["artist-credit"][0]["artist"]["name"],
            release_group_name: item["title"]
        }
    }
    else if ( searchCategory == 'recordings' ) {
        releaseGroup = {
            release_group_mbid: item["releases"][0]["release-group"]["id"],
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
    let mbid = null
    if ( searchCategory == 'recordings' ) {
        mbid = item["id"] ?? null
    }
    return mbid
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

export const getLastFmCoverArt = async function ( releaseGroup: App.RowData ) {
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
    const validReleaseGroup = ( releaseGroup.release_group_name == null && releaseGroup.release_group_mbid == null ) ? false : true
    if ( !validReleaseGroup ) {
        throw Error
    }

    const coverArtArchiveEndpoint = `https://coverartarchive.org/release-group/${releaseGroup.release_group_mbid}/front`

    try {
        let coverArtArchiveUrl = null as string | null
        if (validReleaseGroup) {
            const coverArtArchiveRes = await fetch(coverArtArchiveEndpoint, { signal: AbortSignal.timeout(3000) })
            const coverArtArchiveResUrl = coverArtArchiveRes["url"]
           
            const httpCoverArtArchive = new XMLHttpRequest()
            httpCoverArtArchive.open('HEAD', coverArtArchiveResUrl, false)
            httpCoverArtArchive.send()
    
            coverArtArchiveUrl = ( httpCoverArtArchive.status == 404 ) ?  null :  coverArtArchiveResUrl
        }

        const lastFmResUrl = await getLastFmCoverArt( releaseGroup ) as string

        const httpLastFm = new XMLHttpRequest()
        httpLastFm.open('HEAD', lastFmResUrl, false)
        httpLastFm.send()
        const lastFmCoverArtUrl = ( httpLastFm.status == 404 ) ? null : lastFmResUrl

        if ( !coverArtArchiveUrl && !lastFmResUrl ) {
            throw Error
        }

        return  { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: true }
    }
    catch ( error ) {
        throw Error
    }
}

export const getCoverArtClientSide = async function ( releaseGroup: App.RowData, continuePromise: boolean ) {
    const validReleaseGroup = ( releaseGroup.release_group_name == null && releaseGroup.release_group_mbid == null ) ? false : true
    if ( !validReleaseGroup ) {
        throw Error
    }

    if ( !continuePromise ) {
        return  { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: false }
    }

    const coverArtArchiveUrl = releaseGroup.release_group_mbid ? `https://coverartarchive.org/release-group/${releaseGroup.release_group_mbid}/front` : null
    
    const lastFmCoverArtUrl = null as string | null
    const lastFmResUrl = await getLastFmCoverArt( releaseGroup ) as string

    try {
        const httpLastFm = new XMLHttpRequest()
        httpLastFm.open('HEAD', lastFmResUrl, false)
        httpLastFm.send()
        const lastFmCoverArtUrl = ( httpLastFm.status == 404 ) ? null : lastFmResUrl

        if ( !lastFmCoverArtUrl ) {
            throw Error
        }
        else {
            return { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: true }
        }
    }
    catch ( error ) {
        return  { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: false }
    }
}

export const checkFetchedCoverArt = async function( item: App.RowData ){

    const coverArtArchiveResUrl =  item['img_url'] as string
    const lastFmResUrl = item['last_fm_img_url']
    
    const httpCoverArtArchive = new XMLHttpRequest()
    httpCoverArtArchive.open('HEAD', coverArtArchiveResUrl, false)
    httpCoverArtArchive.send()

    const coverArtArchiveUrl = ( httpCoverArtArchive.status == 404 ) ?  null :  coverArtArchiveResUrl

    const httpLastFm = new XMLHttpRequest()
    httpLastFm.open('HEAD', lastFmResUrl, false)
    httpLastFm.send()
    const lastFmCoverArtUrl = ( httpLastFm.status == 404 ) ? null : lastFmResUrl

    return { coverArtArchiveUrl, lastFmCoverArtUrl }
}


// Get artist photo from Discogs using URL for artist page
export const getDiscogsArtistPhoto = async function ( url: URL ) {
    if ( !url ) {
        return { imgUrl: null }
    }

    const tokens = url.split('/')
    const discogsArtistId = tokens[tokens.length-1]
    const endpoint = `https://api.discogs.com/artists/${discogsArtistId}`
    
    const res = await fetch(endpoint, discogsRequestHeader)
    const json = await res.json() ?? null

    const images = json?.images ?? null
    const primaryImage = images?.find((element) => element.type == 'primary') ?? null
    const imgUrl = primaryImage?.resource_url ?? null
    
    return { imgUrl }
}

// Use artist_mbid to get a Discogs Artist photo. Include milliseconds to set timeout based on MusicBrainz and Discogs API rate limiting
export const getArtistImage = async function ( mbid: string, milliseconds: number = 0 ) {
    function delay ( milliseconds ) { 
        new Promise(resolve => setTimeout(resolve, milliseconds)) 
    }

    await delay(milliseconds)

    const {relations} = await getArtistUrlRels(mbid)
    const {relationUrl} = await getRelationUrl( relations, 'discogs')
    const {imgUrl} = await getDiscogsArtistPhoto(relationUrl)

    return imgUrl
}

/*
//
** Add item from search results
//
*/

// Check if item is already in collection
export const checkDuplicate = function ( mbid: string, addedItems: App.RowData | App.RowData[], deletedItems: App.RowData[], mbidCategory: string ) {
    if ( deletedItems.length < 1 ) {
        return { isDuplicate: false, duplicateItem: null }
    }
    const findMbidDuplicate = addedItems.find((element) => element[mbidCategory] == mbid)
    const findUserAddedMetadataDuplicate = addedItems.find((element) => element['user_added_metadata_id'] == mbid)
    const isDuplicate = ( findMbidDuplicate || findUserAddedMetadataDuplicate ) ? true : false
    const duplicateItem = isDuplicate ? ( findMbidDuplicate ?? findUserAddedMetadataDuplicate ) : null
    return { isDuplicate, duplicateItem }
}

// Check if item was previously deleted
export const checkDeleted = function ( item: App.RowData, deletedItems: App.RowData | App.RowData[], mbidCategory: string ) {
    if (deletedItems.length <= 1) {
        return false
    }
    const itemMbid = item['id']
    const wasDeleted = deletedItems.find((element) => element[mbidCategory] == itemMbid) ? true : false
    return wasDeleted
}

// Check if collection has reached limit
export const checkLimit = function ( limit: string | null, addedItems: App.RowData | App.RowData[] ) {
    const limitValue = limit ? parseInt(limit) : null
    const limitReached =  ( limitValue && addedItems.length >= limitValue ) ? true : false
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
    const { isDuplicate } = checkDuplicate( item["id"], addedItems, deletedItems, mbidCategory )
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

    const artistMbid = artistMbid( searchCategory, item )
    const artistImage = await getArtistImage(artistMbid)

    addedItems = [...addedItems, {
        "original_id": originalId ?? null,
        "item_position": addedItems.length,
        "artist_mbid": artistMbid,
        "artist_name": artistName( searchCategory, item ),
        "artist_discogs_img_url": artistImage,
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
    limit: string | null, 
    searchCategory: string,
    mbidCategory: string, 
) {
    const { isDuplicate } = checkDuplicate( item["id"], addedItems, deletedItems, mbidCategory )
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
        "id": addedItems.length
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


    const artistMbid = artistMbid( searchCategory, item )
    const artistImage = await getArtistImage(artistMbid)

    addedItems =  {
        "artist_mbid": artistMbid,
        "artist_name": artistName( searchCategory, item ),
        "artist_discogs_img_url": artistImage,
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
    singleItem: App.RowData, 
    searchCategory: string,  
) {
    const mbid = releaseGroupMbid( searchCategory, item )
    const releaseDate = itemDate( searchCategory, item )
    const label = await getLabel( searchCategory, mbid, releaseDate )
    singleItem =  {
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

    return { singleItem }
}
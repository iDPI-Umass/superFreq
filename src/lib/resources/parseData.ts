import { parseISO } from "date-fns"
import { parseHTML } from 'linkedom'


/*
//
** Time and date
//
*/

/* Time now in ISO string */

export const timestampISOString: string = new Date().toISOString()

/* Time now in ISO Date */

export const timestampISO: Date = parseISO(timestampISOString)

/* Convert Date string into ISO format Date */

export function dateToISODate ( dateString: string ) {
    return new Date(parseInt(dateString.valueOf()))
}

/* Parse date as locale string for display */
const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

export const displayDate = ( date: Date ) => {
    return new Date(date).toLocaleDateString( undefined, options )
}

/*
//
** User data parsing
//
*/

/*
If user has chose a display_name, use that instead of username
*/

export const profileName = function (username: string, display_name: string) {
    const profileName = ( display_name && ( username != display_name )) ? display_name : username
    return profileName
}

/*
//
** MBID associated parsing
//
*/

/* Converts values to mbid categories */

export const categoriesTable: App.Lookup = {
    "artists": "artist",
    "release-groups": "release-group",
    "release_groups": "release-group",
    "recordings": "recording",
    "albums": "release-group",
    "tracks": "recording",
    "songs": "recording"
}

/* Converts values to mbid slug */

export const mbidCategoryTable: App.Lookup = {
    "artists": "artist_mbid",
    "release-groups": "release_group_mbid",
    "release_groups": "release_group_mbid",
    "recordings": "recording_mbid",
    "albums": "release_group_mbid",
    "tracks": "recording_mbid",
    "songs": "recording_mbid"
}

/* Converts values to UI text */

export const categories: App.Lookup = {
    "artists": "artists",
    "release_groups": "albums",
    "recording": "tracks"
}

export const categoryParser = ( category: string ) => {
    return categories[category]
}

/*
//
** Prepare data for insert/update
//
*/

/*
Prepare data for table insert in format expected by: artists, release_groups, and recordings.
*/

export const prepareMusicMetadataInsert = function ( collectionItems: App.RowData, collectionType: string ) {

    let artistsMetadata = [] as any
    let releaseGroupsMetadata = [] as any
    let recordingsMetadata = [] as any

    for (const item in collectionItems) {
        const thisItem = collectionItems[item] as App.CollectionItem

        if ( collectionType == "artists" ) {
            artistsMetadata = [...artistsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"],
                "added_at": timestampISO
            }];
        }
        else if	( collectionType == "release_groups" ) {
            artistsMetadata = [...artistsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"],
                "added_at": timestampISO
            }];

            releaseGroupsMetadata = [...releaseGroupsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_date"],
                "label": thisItem["label_name"],
                "img_url": thisItem["img_url"],
                "added_at": timestampISO
            }];
        }
        else if ( collectionType == "recordings" ) {
            artistsMetadata = [...artistsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"],
                "added_at": timestampISO
            }];
            releaseGroupsMetadata = [...releaseGroupsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_date"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"],
                "added_at": timestampISO
            }];

            recordingsMetadata = [...recordingsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "recording_name": thisItem["recording_name"],
                "remixer_artist_mbid": thisItem["remixer_artist_mbid"],
                "release_date": thisItem["release_date"],
                "added_at": timestampISO
            }];
        }
    }

    return { artistsMetadata, releaseGroupsMetadata, recordingsMetadata };
}

/*
Prepare data for table insert in format expected by: artists, release_groups, and recordings.
*/

export const prepareAvatarMetadataInsert = function ( avatarItem: App.RowData ) {

    let artistsMetadata = [] as any
    let releaseGroupsMetadata = [] as any

    artistsMetadata = [...artistsMetadata, {
        "artist_mbid": avatarItem["artist_mbid"],
        "artist_name": avatarItem["artist_name"],
        "added_at": timestampISO
    }]

    releaseGroupsMetadata = [...releaseGroupsMetadata, {
        "artist_mbid": avatarItem["artist_mbid"],
        "release_group_mbid": avatarItem["release_group_mbid"],
        "release_group_name": avatarItem["release_group_name"],
        "release_date": avatarItem["release_date"],
        "label": avatarItem["label_name"],
        "img_url": avatarItem["img_url"],
        "added_at": timestampISO
    }]

    return { artistsMetadata, releaseGroupsMetadata };
}

/*
Prepare data for table upsert in format expected by: artists, release_groups, and recordings.
*/

export const prepareMusicDataUpsert = function ( collectionItems: App.RowData, collectionType: string ) {

    let upsertArtists: object[] = []
    let upsertReleaseGroups: object[] = []
    let upsertRecordings: object[] = []

    for (const item in collectionItems) {
        const thisItem = collectionItems[item] as App.CollectionItem

        if ( collectionType == "artists" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"]
            }];
        }
        else if	( collectionType == "release_groups" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_date"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"]
            }];
        }
        else if ( collectionType == "recordings" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_fate"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"]
            }];

            upsertRecordings = [...upsertRecordings, {
                "artist_mbid": thisItem["artist_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "recording_name": thisItem["recording_name"],
                "remixer_mbid": thisItem["remixer_mbid"],
                "release_date": thisItem["release_date"]
            }];
        }
    }

    return { upsertArtists, upsertReleaseGroups, upsertRecordings };
}

/*
Parse data for table upsert in format expected by collections_contents. null item_position means item is deleted from collection.
*/

export const populateCollectionContents = function ( collectionItems: App.RowData, collectionId: string ) {
    
    let collectionContents = [] as any

    for (const [index, item] of collectionItems.entries()) {
        const thisItem = item as App.RowData

        const changelog: App.Changelog = thisItem.changelog ?? {}

        const itemPosition = ( thisItem.item_position == null ) ? null : index

        changelog[timestampISOString] = {
            "updated_at": timestampISO,
            "item_position": itemPosition,
            "notes": thisItem["notes"]
        }

        if ( thisItem.original_id != null ) {
            collectionContents = [...collectionContents, {
                "id": thisItem["original_id"],
                "collection_id": collectionId,
                "inserted_at": thisItem["inserted_at"] ?? timestampISO,
                "updated_at": timestampISO,
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "item_position": itemPosition,
                "notes": thisItem["notes"],
                "changelog": changelog
            }];
        }
        else {
            collectionContents = [...collectionContents, {
                "collection_id": collectionId,
                "inserted_at": thisItem["inserted_at"] ?? timestampISO,
                "updated_at": timestampISO,
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "item_position": itemPosition,
                "notes": thisItem["notes"],
                "changelog": changelog
            }];
        }

    }
    return collectionContents;
}

/* Gets data for populating embed. Works with Bandcamp, Soundcloud, YouTube. Mixcloud needs to be debugged. */

export const getListenUrlData = async function ( listenUrlString: string ) { 

    if ( !listenUrlString ) {
        const embedInfo = {
            'id': null,
            'source': null,
            'title': null,
            'artist': null,
            'account': null
        }
        return embedInfo 
    }
    
    function parseUrlSource ( listenUrlString: string ) {
        const linkTokens = listenUrlString.split('/')
        for ( const token of linkTokens ) {
            if ( token.includes('youtu.be')) {
                return 'youtube'
            }
            if ( token.includes('.com')) {
                const domain = token.split('.')
                return domain[domain.length - 2]
            } 
        }
    }

    const urlSource = parseUrlSource(listenUrlString)

    async function getHtml( listenUrl: URL) {
        const response = await fetch(listenUrl)
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`)
        }
        return await response.text()
    }

    async function parseBandcampHtml( html: any ) {
        const {document} = await parseHTML(html)
        const embedLink = document.head.querySelector('meta[property="og:video"]').content
        const embedAccount = document.head.querySelector('meta[property="og:site_name"]').content
        const embedElements = embedLink.split('/')

        let id = ''

        for ( const element of embedElements ) {
            if ( element.includes('album=') || element.includes('track=') ) {
                id = element
                break
            }
        }

        const pageTitle = document.title
        const titleElements = pageTitle.split(' | ')
        const itemTitle = titleElements[0]
        const itemArtist = titleElements[1]
        const itemInfo = {
            'url': listenUrlString,
            'id': id,
            'source': 'bandcamp',
            'title': itemTitle,
            'artist': itemArtist,
            'account': embedAccount
        } 
        return itemInfo
    }

    async function parseSoundcloudHtml ( html: any ) {
        const {document} = await parseHTML(html)
        const embedLink = document.head.querySelector('meta[property="twitter:app:url:googleplay"]').content
        const elements = embedLink.split(':')
        const itemId = elements[2]
        const pageTitle = document.title
        const titleElements = pageTitle.split(' | ')
        const info = titleElements[0].split(' by ')
        const itemTitle = info[0].replace('Stream ', '')
        const itemAccount = info[1]
        const itemInfo = {
            'url': listenUrlString,
            'id': itemId,
            'source': 'soundcloud',
            'title': itemTitle,
            'artist': null,
            'account': itemAccount
        } 
        return itemInfo
    }

    async function parseYouTubeHtml ( html: any, listenUrlString: string) {
        const itemId = listenUrlString.includes('youtu.be') ? listenUrlString.split('/')[3].split('?')[0] : listenUrlString.split('=')[1]
        const {document} = await parseHTML(html)
        const pageTitle = document.title
        let title: string | null = null
        let artist: string | null = null

        if ( pageTitle.includes(' - ')) {
            const elements = pageTitle.split(' - ')
            artist = elements[0]
            title = elements[1]
        }

        const itemInfo = {
            'url': listenUrlString,
            'id': itemId,
            'source': 'youtube',
            'title': title ?? pageTitle,
            'artist': artist,
            'account': null
        }
        return itemInfo
    }

    async function parseMixcloudHtml ( html: any, listenUrlString: string ) {
        const itemId = listenUrlString.split('.com')[1]
        const {document} = await parseHTML(html)
        const pageTitle = document.title
        const info = pageTitle.split(' - ')
        const itemTitle = info[0]
        const itemAccount = info[1]
        const itemInfo = {
            'url': listenUrlString,
            'id': itemId,
            'source': 'mixcloud',
            'title': itemTitle,
            'artist': null,
            'account': itemAccount
        }
        return itemInfo
    }

    if ( urlSource == 'bandcamp' ) {
        const listenUrl = new URL(listenUrlString)
        const html = await getHtml(listenUrl)
        const embedInfo = await parseBandcampHtml(html)
        return embedInfo
    }
    else if ( urlSource == 'soundcloud') {
        const listenUrl = new URL(listenUrlString)
        const html = await getHtml(listenUrl)
        const embedInfo = await parseSoundcloudHtml(html)
        return embedInfo
    }
    else if ( urlSource == 'youtube' ) {
        const listenUrl = new URL(listenUrlString)
        const html = await getHtml(listenUrl)
        const embedInfo =  await parseYouTubeHtml(html, listenUrlString)
        return embedInfo
    }
    // else if ( urlSource == 'mixcloud' ) {
    //     const listenUrl = new URL(listenUrlString)
    //     const html = await getHtml(listenUrl)
    //     const embedInfo =  await parseMixcloudHtml(html, listenUrlString)
    //     return embedInfo
    // }
    else {
        const embedInfo = {
            'id': null,
            'source': null,
            'title': null,
            'artist': null,
            'account': null
        }
        return embedInfo
    }
}
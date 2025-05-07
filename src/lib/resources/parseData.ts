import { parseISO, getDate, parse, format } from "date-fns"
import { parseHTML } from 'linkedom'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkUnlink from 'remark-unlink'
import remarkStringify from 'remark-stringify'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'
import { stringSimilarity } from "string-similarity-js"

export function validStringCheck ( value: string ) {
    if ( value && value.length > 0 ) {
        return value
    }
    else return null
}

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

/* Parse timestamp for hyperlinks */
export function parseTimestamp ( itemTimestamp: Date ) {
    const timestampString = itemTimestamp.toISOString()
    const timestamp = Date.parse(timestampString).toString()
    return timestamp
}


/* Make sure username only contains letters, numbers, and underscore */

export const validateUsernameCharacters = function ( username: string) {
	const valid = /\W+/.test(username) ? false : true

    return valid
}

/* Convert object in 'options' column from 'profiles' table to format that OptionsMenu component can use. 

'options' object used for selectedOptions has format:
[
    { 
        'category': string,
        'items': string[]
    }
]

array for optionsGroups must contain objects with keys 'category', 'legend', and 'items', such as:
    [
        {
            'category': 'feed_item_types',
            'legend': 'Feed Item Types',
            'items': ['now_playing_post', 'comment', reaction]
        },
        {
            'category: 'item_owners',
            'legend': 'Whose items?',
            'items': ['user', 'followers', 'strangers']
        }
    ]

*/

export const consolidatedOptions = ( optionsGroups: any[], selectedOptions: any[] ) => {
    for ( const group of optionsGroups ) {
        const category = group.category
        const options = selectedOptions.find((element) => element.category == category)
        group.selectedOptions = options ? options.items : []
    }

    return optionsGroups
}

/*
//
** Markdown parsing
//
*/

/* Takes string from database and outputs html. Need to use {@html} tag in HTML to display what this funciton outputs. ALWAYS user DOMPurify.sanitize in that {@html} tag */
export const parseMarkdown = async function ( text: string ) {
    const parsedText = await unified()
        .use(remarkParse)
        .use(remarkUnlink)
        .use(remarkStringify)
        .use(remarkGfm)
        .use(remarkRehype, {allowDangerousHtml: true})
        .use(rehypeStringify)
        .process(text)

    const formattedText = parsedText ? parsedText : ''

    return formattedText
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
    "artist": "artist",
    "artists": "artist",
    "album": "release-group",
    "albums": "release-group",
    "release-group": "release-group",
    "release-groups": "release-group",
    "release_groups": "release-group",
    "recording": "recording",
    "recordings": "recording",
    "track": "recording",
    "tracks": "recording",
    "songs": "recording"
}

/* Converts values to item types */

export const itemTypeTable: App.Lookup = {
    "artist": "artist",
    "artists": "artist",
    "release_group": "release_group",
    "release-groups": "release_group",
    "release_groups": "release_group",
    "recording": "recording",
    "recordings": "recording",
    "albums": "release_group",
    "track": "recording",
    "tracks": "recording",
    "songs": "recording",
    "episode": "episode",
    "episodes": "episode",
    "mix": "episode",
    "mixes": "episode"
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

export const prepareMusicMetadataInsert = function ( collectionItems: App.RowData ) {

    let artistsMetadata = [] as any
    let releaseGroupsMetadata = [] as any
    let recordingsMetadata = [] as any

    for (const item in collectionItems) {
        const thisItem = collectionItems[item] as App.CollectionItem

        const itemType = thisItem["item_type"] as string
        const existsInDatabase = thisItem["original_id"] ? true : false

        if ( itemType && !existsInDatabase ) {
            
            if ( thisItem["artist_mbid"] ) {
                artistsMetadata = [...artistsMetadata, {
                    "artist_mbid": thisItem["artist_mbid"],
                    "artist_name": thisItem["artist_name"],
                    "discogs_img_url": thisItem["artist_discogs_img_url"] ?? null,
                    "added_at": timestampISO
                }]
            }
            
            if	( itemType.includes("release_group") && thisItem["release_group_mbid"] ) {
                releaseGroupsMetadata = [...releaseGroupsMetadata, {
                    "artist_mbid": thisItem["artist_mbid"],
                    "release_group_mbid": thisItem["release_group_mbid"],
                    "release_group_name": thisItem["release_group_name"],
                    "release_date": thisItem["release_date"],
                    "label": thisItem["label_name"],
                    "img_url": thisItem["img_url"],
                    "last_fm_img_url": thisItem["last_fm_img_url"],
                    "added_at": timestampISO
                }]
            }
            else if ( itemType.includes("recording") && thisItem["recording_mbid"]) {
                releaseGroupsMetadata = [...releaseGroupsMetadata, {
                    "artist_mbid": thisItem["artist_mbid"],
                    "release_group_mbid": thisItem["release_group_mbid"],
                    "release_group_name": thisItem["release_group_name"],
                    "release_date": thisItem["release_date"],
                    "label": thisItem["label"],
                    "img_url": thisItem["img_url"],
                    "last_fm_img_url": thisItem["last_fm_img_url"],
                    "added_at": timestampISO
                }];

                recordingsMetadata = [...recordingsMetadata, {
                    "artist_mbid": thisItem["artist_mbid"],
                    "recording_mbid": thisItem["recording_mbid"],
                    "recording_name": thisItem["recording_name"],
                    "remixer_artist_mbid": thisItem["remixer_artist_mbid"],
                    "release_date": thisItem["release_date"],
                    "added_at": timestampISO
                }]
            }
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
        "discogs_img_url": thisItem["artist_discogs_img_url"] ?? null,
        "added_at": timestampISO
    }]

    releaseGroupsMetadata = [...releaseGroupsMetadata, {
        "artist_mbid": avatarItem["artist_mbid"],
        "release_group_mbid": avatarItem["release_group_mbid"],
        "release_group_name": avatarItem["release_group_name"],
        "release_date": avatarItem["release_date"],
        "label": avatarItem["label_name"],
        "img_url": avatarItem["img_url"],
        "last_fm_img_url": avatarItem["last_fm_img_url"],
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
                "artist_name": thisItem["artist_name"],
                "discogs_img_url": thisItem["artist_discogs_img_url"] ?? null
            }];
        }
        else if	( collectionType == "release_groups" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"],
                "discogs_img_url": thisItem["artist_discogs_img_url"] ?? null
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_date"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"],
                "last_fm_img_url": thisItem["last_fm_img_url"],
            }];
        }
        else if ( collectionType == "recordings" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artist_mbid"],
                "artist_name": thisItem["artist_name"],
                "discogs_img_url": thisItem["artist_discogs_img_url"] ?? null
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "release_group_name": thisItem["release_group_name"],
                "release_date": thisItem["release_fate"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"],
                "last_fm_img_url": thisItem["last_fm_img_url"],
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

export const populateCollectionContents = function ( sessionUserId: string, collectionItems: App.RowData, collectionId: string ) {
    
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
                "inserted_by": thisItem['inserted_by'],
                "updated_at": timestampISO,
                "updated_by": sessionUserId,
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "item_position": itemPosition,
                "item_type": thisItem["item_type"],
                "notes": thisItem["notes"],
                "user_added_metadata_id": thisItem["user_added_metadata_id"] ?? null,
                "changelog": changelog
            }];
        }
        else {
            collectionContents = [...collectionContents, {
                "collection_id": collectionId,
                "inserted_at": thisItem["inserted_at"] ?? timestampISO,
                "inserted_by": sessionUserId,
                "updated_at": timestampISO,
                "updated_by": sessionUserId,
                "artist_mbid": thisItem["artist_mbid"],
                "release_group_mbid": thisItem["release_group_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "item_position": itemPosition,
                "item_type": thisItem["item_type"],
                "notes": thisItem["notes"],
                "user_added_metadata_id": thisItem["user_added_metadata_id"] ?? null,
                "changelog": changelog
            }];
        }

    }
    return collectionContents;
}

//
/*
** Link parsing
*/
//

/* Name of URL source */

export const parseUrlSource = function ( listenUrlString: string ) {
    const linkTokens = listenUrlString.split('/')
    for ( const token of linkTokens ) {
        if ( token.includes('youtu.be')) {
            return 'youtube'
        }
        if ( token.includes('.com')) {
            const domain = token.split('.')
            return domain[domain.length - 2].toLowerCase()
        } 
    }

    return ''
}

/* Check if URL is from approved list of sites */

export const listenUrlSourceWhitelist = [
    'bandcamp',
    'soundcloud',
    'youtube',
    'mixcloud'
]

export const listenUrlWhitelistCheck = function ( urlString: string ) {
    const urlSource = parseUrlSource(urlString ?? '') as string
    const approved = listenUrlSourceWhitelist.includes(urlSource) ? true : false
    return approved
}

/* Gets data for populating embed. Works with Bandcamp, Soundcloud, YouTube. Mixcloud needs to be debugged. */

export const fetchHtml = async function ( listnUrl: string ) {
    const url = new URL(listnUrl)
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`)
    }
    const html = await response.text()
    const { document } = await parseHTML(html)
    return document
}

export const parseBandcampHtml  = async function ( listenUrlString: string ) { 

    const document = await fetchHtml(listenUrlString)

    const embedLink = document.head.querySelector('meta[property=og:video]')?.content as string
    const embedAccount = document.head.querySelector('meta[property=og:site_name]')?.content as string
    const embedElements = embedLink.split('/')
    const coverArt = document.head.querySelector('meta[property=og:image]')?.content as string
    const description = document.head.querySelector('meta[name=description]')?.content

    const lines = description.split('\n')
    let titleArtistReleaseDate: string
    const tracklist = [] as string[]
    for (const line of lines) {
        if ( line.includes(' by ') && line.includes(', released')) {
            titleArtistReleaseDate = line
        }
        if (parseInt(line[0]) && line.split(' ')[0].includes('.')) {
            let lineItem = line
            if ( line.includes('&#39;')) {
                lineItem = line.replace('&#39;', '\'')
            }
            tracklist.push(lineItem)
        }
    }

    const releaseDateString = titleArtistReleaseDate.split(' released ')[1]

    let id = ''
    let itemType = ''

    for ( const element of embedElements ) {
        if ( element.includes('album=') || element.includes('track=') ) {
            id = element
            itemType = element.includes('album=') ? 'album' : 'track'
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
        'item_type': itemType,
        'artist': itemArtist,
        'account': embedAccount,
        'img_url': coverArt,
        'tracklist': tracklist,
        'release_date': releaseDateString,
    } 
    return itemInfo
}

export const getListenUrlData = async function ( listenUrlString: string ) { 

    if ( !listenUrlString ) {
        const embedInfo = {
            'id': null,
            'source': null,
            'title': null,
            'itemType': null,
            'artist': null,
            'account': null,
            'img_url': null,
            'tracklist': null,
            'release_date': null,
        }
        return embedInfo 
    }

    const urlSource = parseUrlSource(listenUrlString)

    async function getHtml( listenUrl: URL) {
        const response = await fetch(listenUrl)
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`)
        }
        return await response.text()
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
            'itemType': null,
            'artist': null,
            'account': itemAccount,
            'img_url': null,
            'tracklist': null,
            'release_date': null,
        } 
        return itemInfo
    }

    async function parseYouTubeHtml ( html: any, listenUrlString: string) {
        let itemId = listenUrlString.includes('youtu.be') ? listenUrlString.split('/')[3].split('?')[0] : listenUrlString.split('=')[1]

        if ( itemId.includes('&')) {
            const elements = itemId.split('&')
            itemId = elements[0]
        }

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
            'itemType': null,
            'artist': artist,
            'account': null,
            'img_url': null,
            'tracklist': null,
            'release_date': null,
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
            'itemType': null,
            'artist': null,
            'account': itemAccount,
            'img_url': null,
            'tracklist': null,
            'release_date': null,
        }
        return itemInfo
    }

    if ( urlSource == 'bandcamp' ) {
        const embedInfo = await parseBandcampHtml(listenUrlString)
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
            'itemType': null,
            'artist': null,
            'account': null,
            'img_url': null,
            'tracklist': null,
            'release_date': null,
        }
        return embedInfo
    }
}
 
//
/*
** Matchcing search query against search results
*/
//

export const searchForAlbumMetadata = async function ( album: any ) {
    async function delay ( milliseconds: number ) { 
        new Promise(resolve => setTimeout(resolve, milliseconds)) 
    }

    await delay(20000)
    const title = album['Album Title']
    const artist = album['Artist']

    const searchTerms = {
        artistName: artist,
        releaseGroupName: title
    }

    let mbid = null as string | null
    if ( artist != 'Compilation') {
        const {searchResults} = await musicbrainzAdvancedSearch('album', searchTerms, 3)

        console.log(searchResults)

        if ( searchResults['release-groups']){
            for ( const result of searchResults['release-groups'] ) {
                const resultTitle = result.title
                const resultArtist = result['artist-credit'][0]['artist']['name']
                mbid = result.id

                const titleSimilarity = stringSimilarity(title, resultTitle)

                const artistSimilarity = stringSimilarity(artist, resultArtist)

                console.log(titleSimilarity, artistSimilarity)
                if (titleSimilarity >=0.5 && artistSimilarity >= 0.5 ) {
                    console.log('mbid: ', mbid)
                }
            }
        }
    }

    return { mbid }
    
}

export const getMetadataAlbumsArray = async function (albums: any) {
    let mbidCount = 0
    for ( const album of albums ) {
        await delay(2000)
        const {mbid} = await parseAlbum(album)
        await delay(2000)
        album.mbid = mbid


        if (album.mbid) {
            console.log(album)
            mbidCount ++
        }
        await delay(20000)
    }
    console.log('done')
    console.log('album: ', albums.length)
    console.log('mbids: ', mbidCount)
    return
}
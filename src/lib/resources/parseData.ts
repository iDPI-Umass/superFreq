import { parseISO } from "date-fns"

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

export const dateToISODate = ( dateString: string ) => {
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
    "artists": "artists",
    "release-groups": "release-group",
    "release_groups": "release-group",
    "recordings": "recording",
    "albums": "release-group",
    "tracks": "recording",
    "songs": "recording"
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
            console.log(thisItem["artist_name"])
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
            console.log(thisItem["release_group_name"])
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
                "release_date": thisItem["release_fate"],
                "label": thisItem["label"],
                "img_url": thisItem["img_url"],
                "added_at": timestampISO
            }];

            recordingsMetadata = [...recordingsMetadata, {
                "artist_mbid": thisItem["artist_mbid"],
                "recording_mbid": thisItem["recording_mbid"],
                "recording_name": thisItem["recording_name"],
                "remixer_mbid": thisItem["remixer_mbid"],
                "release_date": thisItem["release_date"],
                "added_at": timestampISO
            }];
        }
    }

    return { artistsMetadata, releaseGroupsMetadata, recordingsMetadata };
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
    return collectionContents;
}
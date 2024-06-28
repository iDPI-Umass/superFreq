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
** MBID associated parsing
//
*/

/* Converts values to mbid categories */

export const categoriesTable: App.Lookup = {
    "artists": "artists",
    "release-groups": "release-group",
    "release_groups": "release-group",
    "recordings": "recordings",
    "albums": "release-group",
    "tracks": "recordings",
    "songs": "recordings"
}

/* Converts values to UI text */

const categories: App.Lookup = {
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
Prepare data for table upsert in format expected by: artists, release_groups, and recordings.
*/

export const prepareMusicDataUpsert = function ( collectionItems: object[], collectionType: string ) {

    let upsertArtists: object[] = []
    let upsertReleaseGroups: object[] = []
    let upsertRecordings: object[] = []

    for (const item in collectionItems) {
        const thisItem = collectionItems[item] as App.CollectionItem

        if ( collectionType == "artists" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artistMbid"],
                "artist_name": thisItem["artistName"]
            }];
        }
        else if	( collectionType == "release_groups" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artistMbid"],
                "artist_name": thisItem["artistName"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artistMbid"],
                "release_group_mbid": thisItem["releaseGroupMbid"],
                "release_group_name": thisItem["releaseGroupName"],
                "release_date": thisItem["releaseDate"],
                "label": thisItem["label"],
                "img_url": thisItem["imgUrl"]
            }];
        }
        else if ( collectionType == "recordings" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": thisItem["artistMbid"],
                "artist_name": thisItem["artistName"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": thisItem["artistMbid"],
                "release_group_mbid": thisItem["releaseGroupMbid"],
                "release_group_name": thisItem["releaseGroupName"],
                "release_date": thisItem["releaseDate"],
                "label": thisItem["label"],
                "img_url": thisItem["imgUrl"]
            }];

            upsertRecordings = [...upsertRecordings, {
                "artist_mbid": thisItem["artistMbid"],
                "recording_mbid": thisItem["recordingMbid"],
                "recording_name": thisItem["recordingName"],
                "remixer_mbid": thisItem["remixerMbid"],
                "release_date": thisItem["releaseDate"]
            }];
        }
    }

    return { upsertArtists, upsertReleaseGroups, upsertRecordings };
}

/*
Parse data for table upsert in format expected by collections_contents.
*/

export const populateCollectionContents = function ( collectionItems: object[], collectionId: string ) {
    let collectionContents: object[] = [];

    for (const [index, item] of collectionItems.entries()) {
        const thisItem = item as App.CollectionItem

        collectionContents = [...collectionContents, {
            "collection_id": collectionId,
            "artist_mbid": thisItem["artistMbid"],
            "release_group_mbid": thisItem["releaseGroupMbid"],
            "recording_mbid": thisItem["recordingMbid"],
            "item_position": index,
            "notes": thisItem["notes"],
        }];

        console.log(collectionContents)
    }
    return collectionContents;
}
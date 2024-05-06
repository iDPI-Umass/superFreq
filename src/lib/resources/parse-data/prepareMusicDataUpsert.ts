/*
Parse data for table upsert in format expected by: artists, release_groups, and recordings.
*/

export const prepareMusicDataUpsert = function ( collectionItems: Array<object>, collectionType: string ) {
    let upsertArtists = [];
    let upsertReleaseGroups = [];
    let upsertRecordings = [];

    for (const item in collectionItems) {
        if ( collectionType == "artists" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": collectionItems[item]["artistMbid"],
                "artist_name": collectionItems[item]["artistName"]
            }];
        }
        else if	( collectionType == "release_groups" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": collectionItems[item]["artistMbid"],
                "artist_name": collectionItems[item]["artistName"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": collectionItems[item]["artistMbid"],
                "release_group_mbid": collectionItems[item]["releaseGroupMbid"],
                "release_group_name": collectionItems[item]["releaseGroupName"],
                "release_date": collectionItems[item]["releaseDate"],
                "label": collectionItems[item]["label"],
                "img_url": collectionItems[item]["imgUrl"]
            }];
        }
        else if ( collectionType == "recordings" ) {
            upsertArtists = [...upsertArtists, {
                "artist_mbid": collectionItems[item]["artistMbid"],
                "artist_name": collectionItems[item]["artistName"]
            }];

            upsertReleaseGroups = [...upsertReleaseGroups, {
                "artist_mbid": collectionItems[item]["artistMbid"],
                "release_group_mbid": collectionItems[item]["releaseGroupMbid"],
                "release_group_name": collectionItems[item]["releaseGroupName"],
                "release_date": collectionItems[item]["releaseDate"],
                "label": collectionItems[item]["label"],
                "img_url": collectionItems[item]["imgUrl"]
            }];

            upsertRecordings = [...upsertRecordings, {
                "artist_mbid": item["artistMbid"],
                "recording_mbid": item["recordingMbid"],
                "recording_name": item["recordingName"],
                "remixer_mbid": item["remixerMbid"],
                "release_date": item["releaseDate"]
            }];
        }
    }

    return { upsertArtists, upsertReleaseGroups, upsertRecordings };
}
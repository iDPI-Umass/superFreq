/*
Parse data for table upsert in format expected by collections_contents.
*/

export const populateCollectionContents = function ( collectionItems: Array<object>, collectionId: string ) {
    let collectionContents = [];
    for (const item in collectionItems) {
        collectionContents = [...collectionContents, {
            "collection_id": collectionId,
            "artist_mbid": collectionItems[item]["artistMbid"],
            "release_group_mbid": collectionItems[item]["releaseGroupMbid"],
            "recording_mbid": collectionItems[item]["recordingMbid"],
            "item_position": collectionItems[item]["position"],
            "notes": collectionItems[item]["notes"]
        }];
    }
    return collectionContents;
}
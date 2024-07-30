import { db } from 'src/database.ts'
import { prepareMusicMetadataInsert, populateCollectionContents } from '$lib/resources/parseData';

/*
Insert collection info when user first creates collection. Run this function before "insertCollectionContents" since it returns a collection_id.
*/

export const insertCollectionInfo = async function ({ collectionInfo, locals: {supabase} }: {collectionInfo: {[index: string]: string}, locals: { supabase: App.Locals["supabase"] }}) {
    const insert = supabase
    .from( "collections_info" )
    .insert( collectionInfo )
    .select();

    const post =  await insert;

    if ( post.status === 201 ) {

        return await post.data;
    }
    if ( post.status === 409 ) {

        return await post.statusText;
    }
    throw new Error( `Unexpected response ${ post.error }`);
}


/*
Insert collection social. Expects object:
{
    "collection_id": collectionId,
    "user_id": userId,
    "user_role": role
}
*/

export const insertCollectionSocial = async function ({ socialInfo, locals: { supabase }}: { socialInfo: object, locals: { supabase: App.Locals["supabase"] } }) {
    const insert = supabase
    .from( "collections_social" )
    .insert( socialInfo );

    const post = await insert;

    if ( post.status === 201 ) {
    return await post.status;
    }
    if ( insert.status === 409 ) {
    return await post.status;
    }
    throw new Error( `Unexpected response ${ insert.error }`);
}

/*
Generic insert that takes string "tableName" to determine table and array "itemsData" to populate row or rows in table.

Intended for creation of collections, and can be used to insert rows into collections_info and collections_contents. 
For collections_social_graph, you likely want to use an uspert function to avoid accidentally adding duplicate rows.
*/

export const insertCollectionContents = async function ({ collectionContents, locals: { supabase }}: { collectionContents: object, locals: { supabase: App.Locals["supabase"] } }) {
    const insert = supabase
    .from( "collections_contents" )
    .insert( collectionContents );

    const post =  await insert;

    if ( post.status === 201 ) {
        return await post;
    }
    if ( post.status === 409 ) {
        return await post;
    }
    throw new Error( `Unexpected response ${ post.error }`);
}

/*
Update collection with transaciton that does the following:
    - updates collection_info row
    - inserts metadata for items in collection
    - inserts new collections_contents rows and updates existing ones
*/

export const updateCollection = async function ({ collectionInfo, collectionItems }: { collectionInfo: any, collectionItems: any }) {

    const collectionId = collectionInfo['collection_id']
    const collectionType = collectionInfo['type']

    const { artistsMetadata, releaseGroupsMetadata, recordingsMetadata } =  await prepareMusicMetadataInsert(collectionItems, collectionType)

    const collectionContents = await populateCollectionContents(collectionItems, collectionId)

    const update = await db.transaction().execute(async (trx) => {

        await trx
            .updateTable('collections_info')
            .set({
                updated_at: collectionInfo['updated_at'],
                updated_by: collectionInfo['updated_by'],
                status: collectionInfo['status'],
                title: collectionInfo['title'],
                description_text: collectionInfo['description_text']
            })
            .where('collection_id', '=', collectionInfo["collection_id"])
            .returningAll()
            .executeTakeFirstOrThrow()

        if ( collectionInfo["type"] == 'artists') {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }
        else if ( collectionInfo["type"] == 'release_groups' ) {
            console.log('collection type: release_groups')
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
        }
        else if ( collectionInfo["type"] ==  'recordings' ) {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
            await trx
                .insertInto('recordings')
                .values(recordingsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }
        
        return await trx
            .insertInto( 'collections_contents' )
            .values( collectionContents )
            .onConflict((oc) => oc
                .column( 'id' )
                .doUpdateSet((eb) => ({
                    updated_at: eb.ref('excluded.updated_at'),
                    item_position: eb.ref('excluded.item_position'),
                    notes: eb.ref('excluded.notes')
                }))
            )
            .returningAll()
            .execute()
    })

    // const update = await db
    //     .with('updated_collection_info', (db) => db
    //         .updateTable( 'collections_info' )
    //         .set({
    //             updated_at: collectionInfo['updated_at'],
    //             updated_by: collectionInfo['updated_by'],
    //             status: collectionInfo['status'],
    //             title: collectionInfo['title'],
    //             description_text: collectionInfo['description_text'],
    //             changelog: collectionInfo['changelog']
    //         })
    //         .where('collection_id', '=', collectionInfo["collection_id"])
    //         .returning('updated_by')
    //     )
    //     .with('updated_collection_contents', (db) => db
    //         .insertInto( 'collections_contents' )
    //         .values( collectionContents )
    //         .onConflict((oc) => oc
    //             .column( 'id' )
    //             .doUpdateSet((eb) => ({
    //                 updated_at: eb.ref('excluded.updated_at'),
    //                 item_position: eb.ref('excluded.item_position'),
    //                 notes: eb.ref('excluded.notes'),
    //                 changelog: eb.ref('excluded.changelog')
    //             }))
    //         )
    //     )
    //     .selectFrom('updated_collection_info')
    //     .select('updated_by')
    //     .execute()

        const collectionUpdate = await update
        return collectionUpdate
}

/*
Insert row in collection updates records. Do this every time a collection is created or updated.
*/

export const insertCollectionUpdateRecord = async function ({ id, collectionId, locals: { supabase }}: { id: string, collectionId: string, locals: { supabase: App.Locals["supabase"] }}) {
    const insert = supabase
    .from( "collections_updates" )
    .insert(
        {
            "collection_id": collectionId,
            "updated_by": id
        }
    )

    const response = await insert;
    const { status } = response;
    if ( status == 201 ) {
        return true;
    }
    else {
        return false;
    }
}

/*
Insert collection follow into social graph
*/

export const insertCollectionFollow = async function({ collectionId, sessionUserId, locals: { supabase }}: { collectionId: number, sessionUserId: string, locals: { supabase: App.Locals["supabase"] }}) {
    const insert = await supabase
    .from("collections_social")
    .insert({
        "user_id": sessionUserId,
        "collection_id": collectionId,
        "follows_now": true,
        "user_role": "follower"
    })
    .select();

    const response = await insert;
    const { data, status } = await response; 
    const responseStatus = status;

    if (status === 201) {
        const insertedFollow = data;
        return { insertedFollow, responseStatus };
        }
    if ( response.status === 404 ) {
        console.warn( ` Collection social graph for ${ id } not found` );
        return responseStatus;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}

/*
Update collection follow in social graph. Expects object:

const followData = {
    "user_id": followerId,
    "collection_id": collectionId,
    "user_role": role,
    "follows_now": boolean,
    "updated_at": null,
    "changelog": json
}
*/

export const updateCollectionFollow = async function({ id, followData, locals: { supabase }}: { id: string, followData: object, locals: { supabase: App.Locals["supabase"] }}) {

    const update = await supabase
    .from("collections_social")
    .update(followData)
    .eq("id", id)
    .select();

    const response = await update;
    const { data, status } = await response;

    if (status === 200) {
        const updatedFollow = data;
        return updatedFollow;
        }
    if ( response.status === 404 ) {
        console.warn( ` Collection social graph for ${ id } not found` );
        return null;
    }
    throw new Error( `Unexpected response ${ response.error }`);
}
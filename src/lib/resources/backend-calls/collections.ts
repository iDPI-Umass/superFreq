import { db } from 'src/database.ts'
import { parseISO } from "date-fns"
import { prepareMusicMetadataInsert, populateCollectionContents } from '$lib/resources/parseData'

export const selectAllOpenPublicCollections = async function ( batchSize: number, batchIterator: number ) {

    let offset = batchSize * batchIterator

    const selectCollections = await db.transaction().execute(async (trx) => {

        const collectionsCount = await trx
        .selectFrom('collections_info')
        .select((eb) => eb.fn.count<number>('collection_id').as('count'))
        .where(({eb, or}) => or([
            eb('status', '=', 'open'),
            eb('status', '=', 'public')
        ]))
        .execute()

        const collections = await trx
        .selectFrom('collections_info')
        .innerJoin('profiles as profile', 'profile.id', 'owner_id')
        .select([
            'collections_info.collection_id as collection_id', 
            'collections_info.created_at as created_at', 
            'collections_info.updated_at as updated_at',
            'collections_info.created_at as created_at',
            'collections_info.owner_id as owner_id', 
            'collections_info.title as title', 
            'collections_info.type as type',
            'profile.username as username', 
            'profile.display_name as display_name',
            'profile.avatar_url as avatar_url'
        ])
        .where(({eb, or}) => or([
                eb('status', '=', 'open'),
                eb('status', '=', 'public')
            ]))
        .orderBy('collections_info.updated_at desc')
        .limit(batchSize)
        .offset(offset)
        .execute()

        return { collectionsCount, collections }
    })
    
    const batch = await selectCollections
    const count = batch.collectionsCount[0].count
    batchIterator ++
    offset = batchSize * batchIterator
    const remainingCount = count - offset

    return { batch, remainingCount }
}

export const selectSpotlightCollections = async function ( batchSize: number, batchIterator: number ) {

    const offset = batchSize * batchIterator

    const selectCollections = await db.transaction().execute(async (trx) => {

        const collectionsCount = await trx
        .selectFrom('collections_info')
        .select((eb) => eb.fn.count<number>('collection_id').as('count'))
        .where(({eb, or}) => or([
            eb('status', '=', 'open'),
            eb('status', '=', 'public')
        ]))
        .execute()

        const collections = await trx
        .selectFrom('collections_info')
        .innerJoin('profiles as profile', 'profile.id', 'owner_id')
        .select([
            'collections_info.collection_id as collection_id', 
            'collections_info.created_at as created_at', 
            'collections_info.updated_at as updated_at', 
            'collections_info.owner_id as owner_id', 
            'collections_info.title as title', 
            'collections_info.type as type',
            'profile.username as username', 
            'profile.display_name as display_name',
            'profile.avatar_url as avatar_url'
        ])
        .where(({eb, and, or}) => and([
            or([
                eb('status', '=', 'open'),
                eb('status', '=', 'public')
            ]),
            eb('spotlight', '=', true)
        ]))
        .orderBy('collections_info.collection_id desc')
        .limit(batchSize)
        .offset(offset)
        .execute()

        return { collectionsCount, collections }
    })

    const collections = await selectCollections
    const count = collections.collectionsCount[0].count
    const remainingCount = count - offset
    return { collections, remainingCount }
}

/*
Fetches collection for viewing if collection is open or public, or session user is an owner or collaborator
*/

export const selectViewableCollectionContents = async function ( collectionId: string, sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {
        const collectionInfo = await trx
        .selectFrom('collections_info')
        .innerJoin('profiles as profile', 'profile.id', 'collections_info.owner_id')
        .select([
            'collections_info.collection_id as collection_id', 
            'collections_info.created_at as created_at', 
            'collections_info.updated_at as updated_at', 
            'collections_info.owner_id as owner_id', 
            'collections_info.status as status', 
            'collections_info.created_by as created_by', 
            'collections_info.title as title', 
            'collections_info.type as type', 
            'collections_info.description_text as description_text',
            'profile.username as username',
            'profile.display_name as display_name',
            'profile.avatar_url as avatar_url'
        ])
        .where(({eb, and, or, exists, selectFrom, not}) => and([
            eb('collections_info.collection_id', '=', collectionId),
            or([
                eb('status', '=', 'open'),
                eb('status', '=', 'public'),
                exists(
                    selectFrom('collections_social')
                    .whereRef('collections_info.collection_id', '=', 'collections_social.collection_id')
                    .where(({eb, and}) => and([
                        eb('collections_social.user_role', '=', 'owner')
                        .or('collections_social.user_role', '=', 'collaborator'),
                        eb('collections_social.user_id', '=', sessionUserId)
                    ]) 
                    )
                    .selectAll('collections_social')
                ),
            ]),
            not(
                eb('collections_info.status', '=', 'deleted')
            )
        ]))
        .executeTakeFirst()

        const type = collectionInfo?.type ?? null

        const editPermission = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .where(({eb, and, or}) => and([
                eb('collections_social.collection_id', '=', collectionId),
                eb('collections_social.user_id', '=', sessionUserId),
                or([
                    eb('collections_social.user_role', '=', 'owner'),
                    eb('collections_social.user_role', '=', 'collaborator'),
                    eb('info.status', '=', 'open')
                ])
            ]))
            .select([
                'collections_social.user_id as user_id', 
                'collections_social.collection_id as collection_id', 
                'collections_social.user_role as user_role'
            ])
            .executeTakeFirst()

        const followData = await trx
            .selectFrom('collections_social')
            .select([
                'id', 
                'collection_id', 
                'user_id', 
                'follows_now', 
                'user_role', 
                'updated_at'
            ])
            .where(({and, eb}) => and([
                eb('user_id', '=', sessionUserId),
                eb('collection_id', '=', collectionId),
                eb('follows_now', '=', true)
            ]))
            .executeTakeFirst()

        if ( type == 'artists') {
            const collectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .select([
                'contents.id as id',
                'contents.collection_id as collection_id',
                'contents.item_position as item_position',
                'contents.artist_mbid as artist_mbid',
                'artists.artist_name as artist_name'
            ])
            .where('contents.collection_id', '=', collectionId)
            .orderBy('item_position')
            .execute()

            return {collectionInfo, collectionContents, viewPermission: true, editPermission, followData}
        }
        else if( type == 'release_groups') {
            const collectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .select([
                'contents.id as id',
                'contents.collection_id as collection_id',
                'contents.item_position as item_position',
                'contents.artist_mbid as artist_mbid',
                'artists.artist_name as artist_name',
                'release_groups.release_group_name as release_group_name',
                'release_groups.release_group_mbid as release_group_mbid',
                'release_groups.img_url as img_url'
            ])
            .where('contents.collection_id', '=', collectionId)
            .orderBy('item_position')
            .execute()

            return {collectionInfo, collectionContents, viewPermission: true, editPermission, followData}
        }
        else if (type == 'recordings') {
            const collectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .innerJoin('recordings', 'recordings.recording_mbid', 'contents.recording_mbid')
            .select([
                'contents.id as id',
                'contents.collection_id as collection_id',
                'contents.item_position as item_position',
                'contents.artist_mbid as artist_mbid',
                'artists.artist_name as artist_name',
                'release_groups.release_group_name as release_group_name',
                'release_groups.release_group_mbid as release_group_mbid',
                'release_groups.img_url as img_url',
                'recordings.recording_name as recording_name',
                'recordings.recording_mbid as recording_mbid'
            ])
            .where('contents.collection_id', '=', collectionId)
            .orderBy('item_position')
            .execute()

            return {collectionInfo, collectionContents, viewPermission: true, editPermission, followData}
        }
        else if ( !type ) {
            return { collectionInfo: null, collectionContents: null, viewPermission: false, editPermission: false, followData: null}
        }
    })

    const collection =  await selectCollection
    const collectionInfo = collection?.collectionInfo
    const collectionContents = collection?.collectionContents
    const viewPermission = collection?.viewPermission ?? false
    const editPermission = collection?.editPermission ?? false
    const followData = collection?.followData ?? null
    return {collectionInfo, collectionContents, viewPermission, editPermission, followData}
}

/*
Fetches collection for editing if session user is owner or collaborator
*/

export const selectEditableCollectionContents = async function ( collectionId: string, collectionType: string, sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {
        
        const selectCollectionInfo = await trx
        .selectFrom('collections_info as info')
        .innerJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
        .select([
            'info.collection_id as collection_id',
            'info.title as title',
            'info.type as type',
            'info.status as status',
            'info.owner_id as owner_id',
            'info.created_at as created_at',
            'info.created_by as created_by',
            'info.updated_at as updated_at',
            'info.description_text as description_text'
        ])
        .where(({eb, and, or}) => and([
            eb('info.collection_id', '=', collectionId),
            eb('info.status', '!=', 'deleted'),
            and([
                eb('social.user_id', '=', sessionUserId),
                or([
                    eb('social.user_role', '=', 'owner'),
                    eb('social.user_role', '=', 'collaborator')
                ])
            ])
        ]))
        .executeTakeFirst()

        let selectCollectionContents
        if ( collectionType == 'artists' ) {
            selectCollectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .select([
                'contents.collection_id as collection_id',
                'contents.inserted_at as inserted_at',
                'contents.artist_mbid as artist_mbid',
                'contents.release_group_mbid as release_group_mbid',
                'contents.recording_mbid as recordings_mbid',
                'contents.item_position as item_position',
                'artists.artist_name as artist_name',
            ])
            .where('contents.collection_id', '=', collectionId)
            .where('contents.item_position', 'is not', null)
            .execute()
        }
        else if ( collectionType == 'release_groups' ) {
            selectCollectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .select([
                'contents.collection_id as collection_id',
                'contents.inserted_at as inserted_at',
                'contents.artist_mbid as artist_mbid',
                'contents.release_group_mbid as release_group_mbid',
                'contents.recording_mbid as recordings_mbid',
                'contents.item_position as item_position',
                'artists.artist_name as artist_name',
                'release_groups.release_group_name as release_group_name',
                'release_groups.img_url as img_url',
            ])
            .where('contents.collection_id', '=', collectionId)
            .where('contents.item_position', 'is not', null)
            .execute()
        }
        else if ( collectionType == 'recordings' ) {
            selectCollectionContents = await trx
            .selectFrom('collections_contents as contents')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .innerJoin('recordings', 'recordings.recording_mbid', 'contents.recording_mbid')
            .select([
                'contents.collection_id as collection_id',
                'contents.inserted_at as inserted_at',
                'contents.artist_mbid as artist_mbid',
                'contents.release_group_mbid as release_group_mbid',
                'contents.recording_mbid as recordings_mbid',
                'contents.item_position as item_position',
                'artists.artist_name as artist_name',
                'release_groups.release_group_name as release_group_name',
                'release_groups.img_url as img_url',
                'recordings.recording_name as recording_name',
            ])
            .where('contents.collection_id', '=', collectionId)
            .where('contents.item_position', 'is not', null)
            .execute()
        }


        const selectDeletedCollectionContents = await trx
        .selectFrom('collections_contents as contents')
        .select([
            'contents.collection_id as collection_id',
            'contents.inserted_at as inserted_at',
            'contents.item_position as item_position',
        ])
        .where('contents.collection_id', '=', collectionId)
        .where('contents.item_position', 'is', null)
        .execute()

        const info = selectCollectionInfo
        const collectionContents = selectCollectionContents
        const deletedCollectionContents = selectDeletedCollectionContents

        return { info, collectionContents, deletedCollectionContents }
    })

    const collection =  await selectCollection
    return collection
}

/* Select top albums collection for session user editing */

export const selectEditableTopAlbumsCollection = async function ( sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {

        try {
            const selectCollectionId = await trx
            .selectFrom('profiles')
            .select(['top_albums_collection_id'])
            .where('id', '=', sessionUserId)
            .executeTakeFirst()

            const collectionId = selectCollectionId?.top_albums_collection_id as string

            const selectCollection = await trx
            .selectFrom('collections_info as info')
            .innerJoin('collections_contents as contents', 'contents.collection_id', 'info.collection_id')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .innerJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .select([
                'info.collection_id as collection_id',
                'contents.item_position',
                'contents.release_group_mbid',
                'contents.artist_mbid',
                'release_groups.release_group_name',
                'release_groups.img_url',
                'artists.artist_name'
            ])
            .where('info.collection_id', '=', collectionId)
            .executeTakeFirstOrThrow()

            const collection = selectCollection
            return collection
        }
        catch( error ) {
            return { collection: null }
        }
    })
    const collection = await selectCollection
    return collection
}

/*
Insert collection with transaciton that does the following:
    - inserts and returns  collections_info row 
    - inserts metadata for items in collection
    - inserts new collections_contents rows and updates existing ones
*/

export const insertCollection = async function ( sessionUserId: string, collectionInfo: App.RowData, collectionItems: App.RowData ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const collectionType = collectionInfo['type']

    const { artistsMetadata, releaseGroupsMetadata, recordingsMetadata } =  await prepareMusicMetadataInsert(collectionItems, collectionType)

    const insert = await db.transaction().execute(async (trx) => {

        const insertCollectionInfo = await trx
            .insertInto('collections_info')
            .values({
                owner_id: sessionUserId,
                created_by: sessionUserId,
                created_at: timestampISO,
                updated_at: timestampISO,
                updated_by: sessionUserId,
                title: collectionInfo?.title,
                status: collectionInfo?.status,
                type: collectionInfo?. type,
                description_text: collectionInfo?.description_text,
                changelog: collectionInfo?.changelog
            })
            .returning('collection_id')
            .executeTakeFirstOrThrow()

        const newCollectionInfo = await insertCollectionInfo

        const collectionId = newCollectionInfo?.collection_id as string

        const socialChangelog: App.Changelog = {}
        socialChangelog[timestampISOString] = {
            'follows_now': true,
            'user_role': 'owner'
        }
        
        await trx
        .insertInto('collections_social')
        .values({
            collection_id: collectionId,
            user_id: sessionUserId,
            follows_now: true,
            updated_at: timestampISO,
            user_role: 'owner',
            changelog: socialChangelog
        })
        .executeTakeFirst()

        await trx
        .insertInto('collections_updates')
        .values({
            collection_id: collectionId,
            updated_at: timestampISO,
            updated_by: sessionUserId
        })
        .executeTakeFirst()

        const collectionContents = await populateCollectionContents(collectionItems, collectionId) 

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
        const collectionInsert = await insert
        const { collection_id } = collectionInsert[0]
        return collection_id
}

/*
Update collection with transaciton that does the following:
    - updates collection_info row
    - inserts metadata for items in collection
    - inserts new collections_contents rows and updates existing ones
*/

export const updateCollection = async function ( collectionInfo: App.RowData, collectionItems: App.RowData ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const collectionId = collectionInfo['collection_id']
    const collectionType = collectionInfo['type']

    const { artistsMetadata, releaseGroupsMetadata, recordingsMetadata } =  await prepareMusicMetadataInsert(collectionItems, collectionType)

    const collectionContents = await populateCollectionContents(collectionItems, collectionId) 

    const update = await db.transaction().execute(async (trx) => {

        const selectInfoChangelog = await trx
        .selectFrom('collections_info')
        .select('changelog')
        .where('collection_id', '=', collectionId)
        .executeTakeFirst()

        const infoChangelog = await selectInfoChangelog as App.Changelog

        infoChangelog[timestampISOString] = {
            'updated_by': collectionInfo['updated_by'],
            'status': collectionInfo['status'],
            'title': collectionInfo['title'],
            'description_text': collectionInfo['description_text']
        }

        await trx
            .updateTable('collections_info')
            .set({
                updated_at: timestampISO,
                updated_by: collectionInfo['updated_by'],
                status: collectionInfo['status'],
                title: collectionInfo['title'],
                description_text: collectionInfo['description_text'],
                changelog: infoChangelog
            })
            .where('collection_id', '=', collectionInfo["collection_id"])
            .returningAll()
            .executeTakeFirstOrThrow()
            
        await trx
            .insertInto('collections_updates')
            .values({
                collection_id: collectionInfo['collection_id'],
                updated_at: collectionInfo['updated_at'],
                updated_by: collectionInfo['updated_by']
            })
            .executeTakeFirst()

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
        const collectionUpdate = await update
        return collectionUpdate
}

export const insertUpdateTopAlbumsCollection = async function ( sessionUserId: string, collectionItems: App.RowData ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const collectionType = 'release_groups'

    const { artistsMetadata, releaseGroupsMetadata } =  await prepareMusicMetadataInsert(collectionItems, collectionType)

    const insertUpdateCollection = await db.transaction().execute(async (trx) => {
        try {
            const selectInfo = await trx
            .selectFrom('collections_info as info')
            .innerJoin('profiles as profile', 'profile.top_albums_collection_id', 'info.collection_id')
            .select([
                'info.collection_id as collection_id',
                'info.title as title',
                'info.status as status',
                'info.description_text as text',
                'info.changelog as changelog',
                'profile.username as username'
            ])
            .where('profile.id', '=', sessionUserId)
            .executeTakeFirstOrThrow()

            const collectionId = selectInfo?.collection_id as string
            const status = selectInfo?.status as string
            const title = selectInfo?.title as string
            const text = selectInfo?.text as string
            const changelog = selectInfo?.changelog as App.Changelog
            const username = selectInfo?.username as string

            changelog[timestampISOString] = {
                'updated_by': sessionUserId,
                'status': status,
                'title': title,
                'description_text': text
            }

            await trx
            .updateTable('collections_info')
            .set({
                updated_at: timestampISO,
                updated_by: sessionUserId,
                changelog: changelog
            })
            .where('collection_id', '=', collectionId)
            .executeTakeFirst()
            
            await trx
                .insertInto('collections_updates')
                .values({
                    collection_id: collectionId,
                    updated_at: timestampISO,
                    updated_by: sessionUserId
                })
                .executeTakeFirst()

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
            
            const collectionContents = await populateCollectionContents(collectionItems, collectionId) 
            
            await trx
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

            return { collectionId , username }
        }
        catch ( error ) {
            const selectUsername = await trx
            .selectFrom('profiles')
            .select('username')
            .where('id', '=', sessionUserId)
            .executeTakeFirst()

            const username = selectUsername?.username as string
            const title = `${username}'s top albums collection`

            const changelog = {} as App.Changelog

            changelog[timestampISOString] = {
                'updated_by': sessionUserId,
                'status': 'public',
                'title': title,
                'description_text': null
            }

            const insertCollectionInfo = await trx
            .insertInto('collections_info')
            .values({
                owner_id: sessionUserId,
                created_by: sessionUserId,
                created_at: timestampISO,
                updated_at: timestampISO,
                updated_by: sessionUserId,
                title: title,
                status: 'public',
                type: 'release_groups',
                changelog: changelog
            })
            .returning('collection_id')
            .executeTakeFirst()

            const collectionId = insertCollectionInfo?.collection_id as string

            await trx
                .insertInto('collections_updates')
                .values({
                    collection_id: collectionId,
                    updated_at: timestampISO,
                    updated_by: sessionUserId
                })
                .executeTakeFirst()

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

            const collectionContents = await populateCollectionContents(collectionItems, collectionId) 
            
            await trx
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
            .execute()

            return { collectionId, username }
        }
    })
    const collectionInfo = insertUpdateCollection
    return collectionInfo

}

export const selectCollectionUserFollowData = async function ( sessionUserId: string, collectionId: string ) {
    const selectCollectionFollowData = await db.transaction().execute(async (trx) => {
        let followData
        try {
            followData = await trx
            .selectFrom('collections_social')
            .select([
                'id', 
                'collection_id', 
                'user_id', 
                'follows_now', 
                'user_role', 
                'updated_at'
            ])
            .where(({and, eb}) => and([
                eb('user_id', '=', sessionUserId),
                eb('collection_id', '=', collectionId),
                eb('follows_now', '=', true)
            ]))
            .executeTakeFirst()

            return followData
        }
        catch( error ) {
            return followData = null
        }
    })

    const followData = await selectCollectionFollowData
    return followData
}
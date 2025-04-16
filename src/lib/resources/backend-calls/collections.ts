import { db } from 'src/database.ts'
import { parseISO } from "date-fns"
import { prepareMusicMetadataInsert, populateCollectionContents } from '$lib/resources/parseData'
import { checkDuplicate } from '$lib/resources/musicbrainz'

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
        .where('is_top_albums', '=', false)
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
            'profile.avatar_url as avatar_url',
            'profile.top_albums_collection_id'
        ])
        .where(({eb, or}) => or([
                eb('collections_info.status', '=', 'open'),
                eb('collections_info.status', '=', 'public')
            ]))
        .where('is_top_albums', '=', false)
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

export const selectListViewableCollections = async function ( username: string ) {
    const selectCollections = await db.transaction().execute(async (trx) => {

        const selectProfile = await trx
        .selectFrom('profiles')
        .select(['id', 'username'])
        .where('username', '=', username)
        .executeTakeFirst()

        const profileUserId = selectProfile?.id as string

        const selectInfo = await trx
        .selectFrom('collections_info as info')
        .innerJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
        .innerJoin('profiles', 'profiles.id', 'social.user_id')
        .select([
            'info.collection_id as id',
            'info.title as title',
            'info.updated_at as updated_at',
            'profiles.display_name as display_name'
        ])
        .where(({eb, and, or}) => and([
            eb('social.user_id', '=', profileUserId),
            or([
                eb('info.status', '=', 'public'),
                eb('info.status', '=', 'open')
            ]),
            or([
                eb('social.user_role', '=', 'owner'),
                eb('social.user_role', '=', 'collaborator')
            ])
        ]))
        .execute()

        const info = selectInfo
        return info
    })

    const collections = await selectCollections
    return collections
}


export const selectListProfileUserViewableCollections = async function ( sessionUserId: string, username: string ) {
    const selectCollections = await db.transaction().execute(async (trx) => {

        const selectProfile = await trx
        .selectFrom('profiles')
        .select(['id', 'username'])
        .where('username', '=', username)
        .executeTakeFirst()

        const profileUserId = selectProfile?.id as string

        let selectInfo

        if ( sessionUserId == profileUserId ) {
            selectInfo = await trx
            .selectFrom('collections_info as info')
            .innerJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
            .innerJoin('profiles', 'profiles.id', 'social.user_id')
            .select([
                'info.collection_id as id',
                'info.title as title',
                'info.updated_at as updated_at',
                'profiles.display_name as display_name'
            ])
            .where(({eb, and, or}) => and([
                eb('social.user_id', '=', profileUserId),
                or([
                    eb('info.status', '=', 'public'),
                    eb('info.status', '=', 'open'),
                    eb('info.status', '=', 'private')
                ]),
                or([
                    eb('social.user_role', '=', 'owner'),
                    eb('social.user_role', '=', 'collaborator')
                ])
            ]))
            .orderBy('info.created_at desc')
            .execute()
        }
        else if ( sessionUserId != profileUserId ) {
            selectInfo = await trx
            .selectFrom('collections_info as info')
            .innerJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
            .innerJoin('profiles', 'profiles.id', 'social.user_id')
            .select([
                'info.collection_id as id',
                'info.title as title',
                'info.updated_at as updated_at',
                'profiles.display_name as display_name'
            ])
            .where(({eb, and, or}) => and([
                eb('social.user_id', '=', profileUserId),
                or([
                    eb('info.status', '=', 'public'),
                    eb('info.status', '=', 'open')
                ]),
                or([
                    eb('social.user_role', '=', 'owner'),
                    eb('social.user_role', '=', 'collaborator')
                ])
            ]))
            .orderBy('info.created_at desc')
            .execute()
        }

        const info = selectInfo
        return info
    })

    const collections = await selectCollections
    return collections
}

export const selectListProfileUserFollowingCollections = async function ( username: string ) {
    const selectCollections = await db.transaction().execute(async (trx) => {

        const selectProfile = await trx
        .selectFrom('profiles')
        .select(['id', 'username'])
        .where('username', '=', username)
        .executeTakeFirst()

        const profileUserId = selectProfile?.id as string

        const selectCollectionsList = await trx
        .selectFrom('profile_display_dev')
        .select('viewable_collection_follows')
        .where('user_id', '=', profileUserId)
        .executeTakeFirst()

        const collectionList = await selectCollectionsList?.viewable_collection_follows

        const selectCollections = await trx
        .selectFrom('collections_info as info')
        .leftJoin('profiles', 'profiles.id', 'info.owner_id')
        .select([
            'info.collection_id as collection_id', 
            'info.title as title', 
            'info.updated_at as updated_at',
            'profiles.username as username',
            'profiles.display_name as display_name'
        ])
        .where('info.collection_id', 'in', collectionList)
        .orderBy('info.updated_at desc')
        .execute()

        const info = selectCollections
        return info
    })

    const collections = await selectCollections
    return collections
}

export const selectListSessionUserCollections =  async function ( sessionUserId: string ) {
    const selectCollections = await db
        .selectFrom('collections_info as info')
        .innerJoin('profiles as profile', 'profile.id', 'info.owner_id')
        .select(['info.collection_id', 'info.title'])
        .where('info.owner_id', '=', sessionUserId)
        .where('info.status', '!=', 'deleted')
        .whereRef('info.collection_id', '!=', 'profile.top_albums_collection_id')
        .orderBy('info.updated_at desc')
        .execute()

    const collections = selectCollections as App.RowData[]
    return collections
}

/*
Fetches collection for viewing if collection is open or public, or session user is an owner or collaborator
*/

export const selectViewableCollectionContents = async function ( collectionId: string, sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {
        const collectionInfo = await trx
        .selectFrom('collections_info')
        .innerJoin('profiles as profile', 'profile.id', 'collections_info.owner_id')
        .leftJoin('release_groups', 'profile.avatar_mbid', 'release_groups.release_group_mbid')
        .select([
            'collections_info.collection_id as collection_id', 
            'collections_info.created_at as created_at', 
            'collections_info.updated_at as updated_at', 
            'collections_info.owner_id as owner_id', 
            'collections_info.status as status', 
            'collections_info.created_by as created_by', 
            'collections_info.title as title', 
            'collections_info.type as type', 
            'collections_info.default_view_sort as default_view_sort',
            'collections_info.description_text as description_text',
            'profile.username as username',
            'profile.display_name as display_name',
            'profile.avatar_url as avatar_url',
            'release_groups.last_fm_img_url as last_fm_img_url'
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

        const editPermission = await trx
            .selectFrom('collections_info as info')
            .innerJoin('collections_social', 'info.collection_id', 'collections_social.collection_id')
            .where(({eb, and, or}) => or([
                eb('info.status', '=', 'open'),
                and([
                    eb('collections_social.collection_id', '=', collectionId),
                    eb('collections_social.user_id', '=', sessionUserId),
                    or([
                        eb('collections_social.user_role', '=', 'owner'),
                        eb('collections_social.user_role', '=', 'collaborator'),
                        
                    ])
                ]),
            ]))
            .where('info.collection_id', '=', collectionId)
            .select([
                'info.collection_id as collection_id',
                'info.status as status',
                'collections_social.user_id as user_id', 
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
                eb('collection_id', '=', collectionId)
            ]))
            .executeTakeFirst()

        const collectionContents = await trx
        .selectFrom('collections_contents as contents')
        .leftJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
        .leftJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
        .leftJoin('recordings', 'recordings.recording_mbid', 'contents.recording_mbid')
        .leftJoin('user_added_metadata', 'user_added_metadata.id', 'contents.user_added_metadata_id')
        .leftJoin('profiles as insert_profile', 'contents.inserted_by', 'insert_profile.id')
        .leftJoin('profiles as update_user', 'contents.updated_by', 'update_user.id')
        .select([
            'contents.id as id',
            'contents.collection_id as collection_id',
            'contents.item_position as item_position',
            'contents.artist_mbid as artist_mbid',
            'contents.item_type as item_type',
            'artists.artist_name as artist_name',
            'release_groups.release_group_name as release_group_name',
            'release_groups.release_group_mbid as release_group_mbid',
            'release_groups.img_url as img_url',
            'release_groups.last_fm_img_url as last_fm_img_url',
            'recordings.recording_name as recording_name',
            'recordings.recording_mbid as recording_mbid',
            'user_added_metadata.artist_name as user_added_artist_name',
            'user_added_metadata.release_group_name as user_added_release_group_name',
            'user_added_metadata.recording_name as user_added_recording_name',
            'user_added_metadata.episode_title as user_added_episode_title',
            'user_added_metadata.show_title as user_added_show_title',
            'user_added_metadata.listen_url as user_added_listen_url',
            'insert_profile.username as inserted_by_username',
            'insert_profile.display_name as inserted_by_display_name',
            'update_user.username as updated_by_username',
            'update_user.display_name as updated_by_display_name'
        ])
        .where('contents.collection_id', '=', collectionId)
        .where('contents.item_position', 'is not', null)
        .orderBy('item_position')
        .execute()

        return {collectionInfo, collectionContents, viewPermission: true, editPermission, followData}
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

export const selectEditableCollectionContents = async function ( collectionId: string, sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {
        
        const selectCollectionInfo = await trx
        .selectFrom('collections_info as info')
        .leftJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
        .select([
            'info.collection_id as collection_id',
            'info.title as title',
            'info.type as type',
            'info.status as status',
            'info.default_view_sort',
            'info.owner_id as owner_id',
            'info.created_at as created_at',
            'info.created_by as created_by',
            'info.updated_at as updated_at',
            'info.description_text as description_text'
        ])
        .where(({eb, and, or}) => and([
            eb('info.collection_id', '=', collectionId),
            eb('info.status', '!=', 'deleted'),
            or([
                eb('info.owner_id', '=', sessionUserId),
                eb('social.user_role', '=', 'owner'),
                eb('social.user_role', '=', 'collaborator'),
                eb('info.status', '=', 'open')
            ])
        ]))
        .executeTakeFirst()

        const selectCollectionContents = await trx
            .selectFrom('collections_contents as contents')
            .leftJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .leftJoin('recordings', 'recordings.recording_mbid', 'contents.recording_mbid')
            .leftJoin('user_added_metadata', 'user_added_metadata.id', 'contents.user_added_metadata_id')
            .leftJoin('profiles as insert_profile', 'contents.inserted_by', 'insert_profile.id')
            .leftJoin('profiles as update_user', 'contents.updated_by', 'update_user.id')
            .select([
                'contents.id as original_id',
                'contents.collection_id as collection_id',
                'contents.inserted_at as inserted_at',
                'contents.artist_mbid as artist_mbid',
                'contents.item_position as item_position',
                'contents.item_type as item_type',
                'contents.episode_url as episode_url',
                'artists.artist_name as artist_name',
                'release_groups.release_group_mbid as release_group_mbid',
                'release_groups.release_group_name as release_group_name',
                'release_groups.img_url as img_url',
                'release_groups.last_fm_img_url as last_fm_img_url',
                'release_groups.release_date as release_date',
                'recordings.recording_mbid as recording_mbid',
                'recordings.recording_name as recording_name',
                'recordings.remixer_artist_mbid as remixer_artist_mbid',
                'user_added_metadata.artist_name as user_added_artist_name',
                'user_added_metadata.release_group_name as user_added_release_group_name',
                'user_added_metadata.recording_name as user_added_recording_name',
                'user_added_metadata.episode_title as user_added_episode_title',
                'user_added_metadata.show_title as user_added_show_title',
                'insert_profile.username as inserted_by_username',
                'insert_profile.display_name as inserted_by_display_name',
                'update_user.username as updated_by_username',
                'update_user.display_name as updated_by_display_name'
            ])
            .where('contents.collection_id', '=', collectionId)
            .execute()

        const info = selectCollectionInfo
        let collectionContents = selectCollectionContents as App.RowData[]

        // create an array of deleted items and remove all items where 'item_position is null' from collectionContents
        let deletedCollectionContents = [] as App.RowData[]
        let filteredContents = collectionContents

        for ( const item of collectionContents ) {
            if (item.item_position == null) {
                deletedCollectionContents = [...deletedCollectionContents, item]
                filteredContents = filteredContents.filter((element) => element != item)
            }
        }

        filteredContents.sort(( a, b ) => a.item_position - b.item_position )
        collectionContents = filteredContents

        // create ID for each item for svelte-dnd component in colleciton editor
        let counter = 0
        for ( const item of collectionContents) {
            item['id'] = counter
            counter += 1
        }
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
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'contents.release_group_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'contents.artist_mbid')
            .leftJoin('user_added_metadata', 'user_added_metadata.id', 'contents.user_added_metadata_id')
            .select([
                'info.collection_id as collection_id',
                'contents.id as original_id',
                'contents.item_position',
                'contents.inserted_at',
                'contents.release_group_mbid',
                'contents.artist_mbid',
                'contents.item_type as item_type',
                'release_groups.release_group_name',
                'release_groups.img_url',
                'release_groups.last_fm_img_url as last_fm_img_url',
                'artists.artist_name',
                'user_added_metadata.artist_name as user_added_artist_name',
                'user_added_metadata.release_group_name as user_added_release_group_name',
            ])
            .where('info.collection_id', '=', collectionId)
            .execute()

            let collectionContents = selectCollection as App.RowData[]

            // create an array of deleted items and remove all items where 'item_position is null' from collectionContents
            let deletedCollectionContents = [] as App.RowData[]
            let filteredContents = collectionContents
            for ( const item of collectionContents ) {
                if (item.item_position == null) {
                    deletedCollectionContents = [...deletedCollectionContents, item]
                    filteredContents = filteredContents.filter((element) => element != item)
                }
            }
            filteredContents.sort(( a, b ) => a.item_position - b.item_position )
            collectionContents = filteredContents

            // create ID for each item for svelte-dnd component in colleciton editor
            let counter = 0
            for ( const item of collectionContents) {
                item['id'] = counter
                counter += 1
            }

            return { collectionContents, deletedCollectionContents }
        }
        catch( error ) {
            return { collectionContents: null, deletedCollectionContents: null }
        }
    })
    const { collectionContents, deletedCollectionContents } = await selectCollection
    return { collectionContents, deletedCollectionContents } 
}

/*
Insert collection with transaciton that does the following:
    - inserts and returns  collections_info row 
    - inserts metadata for items in collection
    - inserts new collections_contents rows and updates existing ones
*/

export const insertCollection = async function ( sessionUserId: string, collectionInfo: App.RowData, collectionItems: App.RowData[] ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const { artistsMetadata, releaseGroupsMetadata, recordingsMetadata } =  await prepareMusicMetadataInsert(collectionItems)

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
                default_view_sort: collectionInfo?.default_view_sort,
                type: collectionInfo?. type,
                description_text: collectionInfo?.description_text,
                changelog: collectionInfo?.changelog
            })
            .returning('collection_id')
            .executeTakeFirstOrThrow()

        const newCollectionInfo = await insertCollectionInfo

        const collectionId = newCollectionInfo?.collection_id as string

        const newUserAddedItems = []
        for ( const item of collectionItems ) {
            if (!item["artist_mbid"]) {
                newUserAddedItems.push({
                    'artist_name': item['artist_name'],
                    'release_group_name': item['release_group_name'],
                    'recording_name': item['recording_name'],
                    'episode_title': item['episode_title'],
                    'show_title': item['show_title'],
                    'added_by': sessionUserId,
                    'added_at': timestampISO,
                    'listen_url': item['listen_url'],
                    'collection_id': collectionId
                })
            }
        }

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

        if ( artistsMetadata.length > 0 ) {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }
        if ( releaseGroupsMetadata.length > 0 ) {
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
        }
        if ( recordingsMetadata.length > 0 ) {
            await trx
                .insertInto('recordings')
                .values(recordingsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }

        let userAddedMetadataRows = [] as App.RowData[]
        if ( newUserAddedItems.length > 0 ) {
            userAddedMetadataRows = await trx
                .insertInto('user_added_metadata')
                .values(newUserAddedItems)
                .returningAll()
                .execute() as App.RowData[]
        }

        for ( const row of userAddedMetadataRows ) {
            const artistName = row['artist_name']
            const releaseGroupName = row['release_group_name']
            const recordingName = row['recording_name']
            const episodeTitle = row['episode_title']
            const showName = row['show_title']

            const collectionItemIndex = collectionItems.findIndex((item) => (
                item['artist_name'] == artistName &&
                item['release_group_name'] == releaseGroupName &&
                item['recording_name'] == recordingName &&
                item['episode_title'] == episodeTitle &&
                item['show_title'] == showName
            ))

            collectionItems[collectionItemIndex]['user_added_metadata_id'] = row['id']
        }

        const collectionContents = await populateCollectionContents(sessionUserId, collectionItems, collectionId) 

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

export const updateCollection = async function ( sessionUserId: string, collectionInfo: App.RowData, collectionItems: App.RowData[] ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const collectionId = collectionInfo['collection_id']

    const { artistsMetadata, releaseGroupsMetadata, recordingsMetadata } =  await prepareMusicMetadataInsert(collectionItems)

    const newUserAddedItems = [] as any
    for ( const item of collectionItems ) {
        if (!item["artist_mbid"] && !item["original_id"]) {
            newUserAddedItems.push({
                'artist_name': item['artist_name'],
                'release_group_name': item['release_group_name'],
                'recording_name': item['recording_name'],
                'episode_title': item['episode_title'],
                'show_title': item['show_title'],
                'added_by': sessionUserId,
                'added_at': timestampISO,
                'listen_url': item['listen_url'],
                'collection_id': collectionId
            })
        }
    }
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
                default_view_sort: collectionInfo['default_view_sort'],
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

        if ( artistsMetadata.length > 0 ) {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }
        if ( releaseGroupsMetadata.length > 0 ) {
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
        }
        if ( recordingsMetadata.length > 0 ) {
            await trx
                .insertInto('recordings')
                .values(recordingsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }

        let userAddedMetadataRows = [] as App.RowData[]
        if ( newUserAddedItems.length > 0 ) {
            userAddedMetadataRows = await trx
                .insertInto('user_added_metadata')
                .values(newUserAddedItems)
                .returningAll()
                .execute() as App.RowData[]
        }

        for ( const row of userAddedMetadataRows ) {
            const artistName = row['artist_name']
            const releaseGroupName = row['release_group_name']
            const recordingName = row['recording_name']
            const episodeTitle = row['episode_title']
            const showName = row['show_title']

            const collectionItemIndex = collectionItems.findIndex((item) => (
                item['artist_name'] == artistName &&
                item['release_group_name'] == releaseGroupName &&
                item['recording_name'] == recordingName &&
                item['episode_title'] == episodeTitle &&
                item['show_title'] == showName
            ))

            collectionItems[collectionItemIndex]['user_added_metadata_id'] = row['id']
        }

        const collectionContents = await populateCollectionContents(sessionUserId, collectionItems, collectionId) 
        
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

export const insertUpdateTopAlbumsCollection = async function ( sessionUserId: string, collectionItems: App.RowData[] ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const { artistsMetadata, releaseGroupsMetadata } =  await prepareMusicMetadataInsert(collectionItems)

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

            if ( artistsMetadata.length > 0 ) {
                await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
            }

            if ( releaseGroupsMetadata.length > 0 ) {
                await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
            }
            
            const collectionContents = await populateCollectionContents(sessionUserId, collectionItems, collectionId) 
            
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
                is_top_albums: true,
                changelog: changelog
            })
            .returning('collection_id')
            .executeTakeFirst()

            const collectionId = insertCollectionInfo?.collection_id as string

            await trx
                .updateTable('profiles')
                .set({
                    top_albums_collection_id: collectionId,
                })
                .where('id', '=', sessionUserId)
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

            const collectionContents = await populateCollectionContents(sessionUserId, collectionItems, collectionId) 
            
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

export const deleteCollection = async function ( sessionUserId: string, collectionId: string ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const update = await db.transaction().execute(async (trx) => {
        try {
            const selectCollection = await trx
            .selectFrom('collections_info')
            .select([
                'collection_id',
                'status',
                'changelog'
            ])
            .where('collection_id', '=', collectionId)
            .where('owner_id', '=', sessionUserId)
            .executeTakeFirstOrThrow()

            const changelog = selectCollection.changelog as App.Changelog

            changelog[timestampISOString] = {
                'updated_by': sessionUserId,
                'status': 'deleted',
                'updated_at': timestampISO
            }

            const updateCollection = await trx
            .updateTable('collections_info')
            .set({
                'status': 'deleted',
                'changelog': changelog
            })
            .where('collection_id', '=', collectionId)
            .execute()

            const insertCollectionUpdate = await trx
            .insertInto('collections_updates')
            .values({
                collection_id: collectionId,
                updated_at: timestampISO,
                updated_by: sessionUserId
            })
            .execute()

            if ( updateCollection && insertCollectionUpdate ) {
                return { success: true}
            }
            else {
                return { success: false }
            }

        }
        catch ( error ) {
            return { success: false }
        }
    })

    const { success } = await update
    return { success }
    
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

export const saveItemToCollection = async function ( sessionUserId: string, itemId: string, collectionId: string ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const update = await db.transaction().execute(async (trx) => {
        try {
            const collectionInfo = await trx
            .selectFrom('collections_info as info')
            .leftJoin('collections_social as social', 'social.collection_id', 'info.collection_id')
            .leftJoin('collections_contents as contents', 'contents.collection_id', 'info.collection_id')
            .select([
                'info.collection_id as id',
                'info.changelog as changelog',
            ])
            .where(({eb, and, or}) => and([
                eb('info.collection_id', '=', collectionId),
                or([
                    eb('info.owner_id', '=', sessionUserId),
                    and([
                        eb('social.user_id', '=', sessionUserId),
                        eb('social.user_role', '=', 'collaborator')
                    ])
                ])
            ]))
            .executeTakeFirstOrThrow()

            const collectionContents = await trx
            .selectFrom('collections_contents as contents')
            .select([
                'contents.id', 
                'contents.item_position',
                'contents.artist_mbid',
                'contents.release_group_mbid',
                'contents.recording_mbid',
                'contents.item_type',
                'contents.changelog as item_changelog',
                'contents.user_added_metadata_id as user_added_metadata_id'
            ])
            .where('collection_id', '=', collectionId)
            .execute()

            const activeItems = [] as App.RowData[]
            const deletedItems = [] as App.RowData[]

            for ( const item of collectionContents ) {
                if ( item.item_position == null ) {
                    deletedItems.push(item)
                }
                else if (item.item_position != null ) {
                    activeItems.push(item)
                }
            }

            const post = await trx
                .selectFrom('posts')
                .selectAll()
                .where('id', '=', itemId)
                .executeTakeFirst()

            const item = post as App.RowData

            const itemType = item["item_type"]
            const itemMbidCategory = itemType.concat('_mbid')
            
            const { isDuplicate, duplicateItem } = checkDuplicate(item[itemMbidCategory] ?? item["user_added_metadata_id"], activeItems, deletedItems, itemMbidCategory)

            const contentsCount = await trx
                .selectFrom('collections_contents')
                .select((eb) => eb.fn.count<number>('id').as('count'))
                .where('collection_id', '=', collectionId)
                .where('item_position', 'is not', null)
                .execute()

            const itemPosition = contentsCount[0]['count']
            
            const infoChangelog = collectionInfo.changelog as App.Changelog

            let itemChangelog = {} as App.Changelog

            if ( !isDuplicate ) {
                itemChangelog[timestampISOString] = {
                    "updated_at": timestampISO,
                    "item_position": itemPosition,
                }
    
                const newItem = {            
                    collection_id: collectionId,
                    inserted_at: timestampISO,
                    inserted_by: sessionUserId,
                    updated_at: timestampISO,
                    updated_by: sessionUserId,
                    artist_mbid: item["artist_mbid"] ?? null,
                    release_group_mbid: item["release_group_mbid"] ?? null,
                    recording_mbid: item["recording_mbid"] ?? null,
                    item_type: item["item_type"],
                    item_position: itemPosition,
                    from_post: item["from_post_id"] ?? null,
                    from_collection: item["from_collection_id"] ?? null,
                    user_added_metadata_id: item["user_added_metadata_id"] ?? null, 
                    changelog: itemChangelog
                }
    
                await trx
                    .insertInto( 'collections_contents' )
                    .values( newItem )
                    .returningAll()
                    .execute()
            }
            else if ( isDuplicate ) {
                const itemId = duplicateItem.id
                itemChangelog = duplicateItem.item_changelog

                itemChangelog[timestampISOString] = {
                    "updated_at": timestampISO,
                    "item_position": itemPosition,
                }

                await trx
                .updateTable('collections_contents')
                .set({
                    item_position: itemPosition,
                    updated_at: timestampISO,
                    updated_by: sessionUserId,
                    changelog: infoChangelog
                })
                .where('id', '=', itemId)
                .execute()
            }

            await trx
                .updateTable('collections_info')
                .set({
                    updated_at: timestampISO,
                    updated_by: sessionUserId,
                    changelog: infoChangelog
                })
                .where('collection_id', '=', collectionId)
                .execute()
                
            await trx
                .insertInto('collections_updates')
                .values({
                    collection_id: collectionId,
                    updated_at: timestampISO,
                    updated_by: sessionUserId
                })
                .execute()
            
            return { success: true }
        }
        catch ( error ) {
            return { success: false }
        }
    })
    const updateSuccess = await update.success
    return updateSuccess
}
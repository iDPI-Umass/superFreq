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

export const selectRecentOpenPublicCollections = async function ( batchSize: number, batchIterator: number ) {
    const selectCollections = await db.transaction().execute(async (trx) => {
        const selectCollectionsMetadata = await trx
        .selectFrom('collection_metadata')
        .select([
            'collection_id',
            'title',
            'username',
            'display_name',
            'updated_at'
        ])
        .orderBy('updated_at desc')
        .limit(batchSize)
        .offset(batchIterator)
        .execute()

        const collections = selectCollectionsMetadata as App.RowData[]

        for ( const collection of collections ) {
            const collectionId = collection.collection_id
            const collectionImages = await trx
            .selectFrom('collections')
            .select([
                'original_id',
                'img_url',
                'last_fm_img_url',
                'artist_name',
                'release_group_name'
            ])
            .where('collection_id', '=', collectionId)
            .limit(3)
            .execute()

            collection.image_trio = collectionImages
        }

        return { collections }
    })

    const { collections } = selectCollections
    return { collections }
}

export const selectSpotlightCollections = async function ( spotlightCollectionId: string, batchSize: number ) {
    const selectCollections = await db.transaction().execute(async (trx) => {


        console.log(spotlightCollectionId, batchSize)
        const selectCollectionsMetadata = await trx
        .selectFrom('collections')
        .select([
            'connected_collection_id as collection_id',
            'connected_collection_title as title',
            'connected_collection_owner_username as username',
            'connected_collection_owner_display_name as display_name',
            'connected_collection_created_at as created_at',
            'connected_collection_description_text as description'
        ])
        .where(({eb, and}) => and([
            eb('collection_id', '=', spotlightCollectionId),
            eb('item_type', '=', 'collection'),
            eb('item_position', 'is not', null)
        ]))
        .where('collection_id', '=', spotlightCollectionId)
        .orderBy('item_position desc')
        .limit(batchSize)
        .execute()

        const collections = selectCollectionsMetadata as App.RowData[]

        console.log(selectCollectionsMetadata)
        for ( const collection of collections ) {
            const collectionId = collection.collection_id
            const collectionImages = await trx
            .selectFrom('collections')
            .select([
                'original_id',
                'img_url',
                'last_fm_img_url',
                'artist_name',
                'release_group_name'
            ])
            .where('collection_id', '=', collectionId)
            .limit(3)
            .execute()

            collection.image_trio = collectionImages
        }

        return { collections }
    })

    const { collections } = selectCollections
    return { collections }
    
}

export const selectFollowedUsersOpenPublicCollections = async function ( sessionUserId: string, batchSize: number, batchIterator: number ) {
    const selectCollections = await db.transaction().execute(async (trx) => {
        const selectFollowing = await trx
        .selectFrom('profile_display')
        .select('users_following')
        .where('user_id', '=', sessionUserId)
        .executeTakeFirst()

        const following = selectFollowing?.users_following as string[]

        const selectFollowingUsersCollections = await trx
        .selectFrom('collection_metadata')
        .select([
            'collection_id',
            'title',
            'username',
            'display_name',
            'updated_at'
        ])
        .where('owner_id', 'in', following)
        .limit(batchSize)
        .offset(batchIterator)
        .orderBy('updated_at desc')
        .execute()

        const collections = selectFollowingUsersCollections as App.RowData[]

        for ( const collection of collections ) {
            const collectionId = collection.collection_id
            const collectionImages = await trx
            .selectFrom('collections')
            .select([
                'original_id',
                'img_url',
                'last_fm_img_url',
                'artist_name',
                'release_group_name'
            ])
            .where('collection_id', '=', collectionId)
            .limit(3)
            .execute()

            collection.image_trio = collectionImages
        }

        return { collections }
    })

    const { collections } = selectCollections

    return { collections }
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
            .innerJoin('social_graph as social', 'social.collection_id', 'info.collection_id')
            .innerJoin('profiles', 'profiles.id', 'social.user_id')
            .select([
                'info.collection_id as id',
                'info.title as title',
                'info.updated_at as updated_at',
                'profiles.display_name as display_name'
            ])
            .where(({eb, and, or}) => and([
                eb('social.user_id', '=', profileUserId),
                eb('social.collection_id', 'is not', null),
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
            .innerJoin('social_graph as social', 'social.collection_id', 'info.collection_id')
            .innerJoin('profiles', 'profiles.id', 'social.user_id')
            .select([
                'info.collection_id as id',
                'info.title as title',
                'info.updated_at as updated_at',
                'profiles.display_name as display_name'
            ])
            .where(({eb, and, or}) => and([
                eb('social.user_id', '=', profileUserId),
                eb('social.collection_id', 'is not', null),
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
        .selectFrom('profile_display')
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
        try {
            const follows = await trx
            .selectFrom('collection_follows')
            .select(['collection_id', 'status', 'owner_id', 'collaborators', 'followers'])
            .where('collection_id', '=', collectionId)
            .where('status', '!=', 'deleted')
            .executeTakeFirstOrThrow()

            const { status, owner_id, collaborators } = follows

            if (
                ( status == 'private' && ! ( owner_id == sessionUserId || collaborators.includes(sessionUserId)))
            )
            { throw new Error( 'no view permission' )}

            const collectionMetadata = await trx
            .selectFrom('collection_metadata')
            .selectAll()
            .where('collection_id', '=', collectionId)
            .executeTakeFirst()

            const collectionContents = await trx
            .selectFrom('collections')
            .selectAll()
            .where('collection_id', '=', collectionId)
            .where('item_position', 'is not', null)
            .execute() as App.RowData[]

            for ( const collection of collectionContents ) {
                if ( collection.item_type == 'collection' ) {
                    const connectedCollection = collection.connected_collection_id

                    const collectionImageTrio = await trx
                    .selectFrom('collections')
                    .select([
                        'img_url',
                        'last_fm_img_url',
                        'artist_name',
                        'release_group_name'
                    ])
                    .where('collection_id', '=', connectedCollection)
                    .where('item_position', 'is not', null)
                    .where('last_fm_img_url', 'is not', null)
                    // .where('img_url', '!=', null)
                    .limit(3)
                    .execute()

                    collection.image_trio = collectionImageTrio
                }
            }


            const collectionComments = [] as App.RowData[]
            if ( collectionMetadata.comment_count > 0 ) {
                const selectComments = await trx
                .selectFrom('posts_and_engagement as reply')
                .select([
                    'id',
                    'user_id',
                    'username',
                    'display_name',
                    'avatar_url',
                    'last_fm_avatar_url',
                    'avatar_release_group_name',
                    'reply.avatar_artist_name',
                    'created_at',
                    'updated_at',
                    'text',
                    'status',
                    'reaction_count',
                    'reaction_user_ids',
                    'type',
                    'parent_post_id',
                    'parent_post_created_at',
                    'parent_post_username',
                    'parent_collection_id',
                    'reply_to',
                    'reply_to_user_id',
                    'reply_to_username',
                    'reply_to_display_name',
                    'reply_to_created_at'
                ])
                .where('parent_collection_id', '=', collectionId)
                .orderBy('created_at asc')
                .execute()

                collectionComments.push(...selectComments)
            }

            return { viewPermission: true, follows, collectionContents, collectionMetadata, collectionComments }
        }
        catch ( error ) {
            return { viewPermission: false, follows: null, collectionContents: null, collectionMetadata: null, collectionComments: null }
        }
    })

    const { viewPermission, follows, collectionContents, collectionMetadata, collectionComments } = selectCollection

    if ( !viewPermission ) {
        return { viewPermission: false, editPermission: false, followsNow: false, collection: null, collectionMetadata: null, collectionComments: null}
    }

    const { status, owner_id, collaborators, followers } = follows
    const followsNow = ( followers.includes(sessionUserId) ) ? true : false
    const editPermission = (
        status == 'open' ||
        owner_id == sessionUserId ||
        collaborators.includes(sessionUserId)
    ) ? true : false

    return { viewPermission, editPermission, followsNow, collectionContents, collectionMetadata, collectionComments }
}

/*
Fetches collection for editing if session user is owner or collaborator
*/

export const selectEditableCollectionContents = async function ( collectionId: string, sessionUserId: string ) {

    const selectCollection = await db.transaction().execute(async (trx) => {
        try {
            const follows = await trx
            .selectFrom('collection_follows')
            .select(['collection_id', 'status', 'owner_id', 'collaborators'])
            .where('collection_id', '=', collectionId)
            .where('status', '!=', 'deleted')
            .executeTakeFirstOrThrow()

            const { status, owner_id, collaborators } = follows

            if ( 
                (( status == 'public' || status == 'private ' ) && owner_id != sessionUserId  )
             ) {
                throw new Error('no edit permission')
             }

            const collectionMetadata = await trx
            .selectFrom('collection_metadata')
            .selectAll()
            .where('collection_id', '=', collectionId)
            .executeTakeFirst()

            const collectionContents = await trx
            .selectFrom('collections')
            .selectAll()
            .where('collection_id', '=', collectionId)
            .execute()

            return { editPermission: true, collectionContents, collectionMetadata }
        }
        catch ( error ) {
            return { editPermission: false, collectionContents: null, collectionMetadata: null }
        }
    })


    const { editPermission, collectionMetadata } = selectCollection
    let { collectionContents } = selectCollection

    if ( !editPermission ) { 
        return { editPermission, collectionMetadata: null, collectionContents: null, deletedCollectionContents: null }
    }

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

    return { editPermission, collectionContents, collectionMetadata, deletedCollectionContents}
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
        .insertInto('social_graph')
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

        const infoChangelog = await selectInfoChangelog?.changelog as App.Changelog

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

export const saveItemToCollection = async function ( sessionUserId: string, itemId: string, collectionId: string ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const update = await db.transaction().execute(async (trx) => {
        try {
            const collectionInfo = await trx
            .selectFrom('collections_info as info')
            .leftJoin('social_graph as social', 'social.collection_id', 'info.collection_id')
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
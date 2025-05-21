import { sql } from 'kysely'
import { db } from 'src/database.ts'

/* 
Selects batches of data to populate session user's feed in batches within a particular date range. Also returns 'batchSize' to ensure consistent subsequent querying and 'totalRowCount' to tell UI if there is more data to load.

'options' specifices what type of data shows up in feed, expects an object formatted as {'options': [values]} containing any of the following values: ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits'] 
*/

export const selectFeedData = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup = {'items': ['now_playing_post', 'social_follow', 'comment', 'reaction', 'collection_follow', 'collection_edit']} ) {

    const offset = batchSize * batchIterator

    const itemTypes = options.items as string[]

    const select = await db.transaction().execute(async (trx) => {
        const selectFollowingList = await trx
        .selectFrom('profile_display')
        .select('users_following')
        .where('user_id', '=', sessionUserId)
        .executeTakeFirst()

        const following = selectFollowingList?.users_following as string[]
        following.push(sessionUserId)

        const feedData = await trx
        .selectFrom('feed_items')
        .selectAll()
        .where(({eb, or, and, not}) => and([
            or([
                eb('user_id', 'in', following),
                eb('parent_post_user_id', '=', sessionUserId),
                eb('reaction_post_user_id', '=', sessionUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('collection_owner_id', '=', sessionUserId)
            ]),
            not(and([
                eb('item_type', '=', 'social_follow'),
                eb('user_id', '=', sessionUserId)
            ])),
            not(and([
                eb('item_type', '=', 'social_follow'),
                eb('target_user_id', '!=', sessionUserId)
            ])),
            not(and([
                eb('item_type', '=', 'reaction'),
                eb('reaction_post_user_id', '!=', sessionUserId),
            ])),
            eb('item_type', 'in', itemTypes)
        ]))
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .limit(batchSize)
        .orderBy('timestamp', 'desc')
        .offset(offset)
        .execute()

        const totalFeedItemsRows = await trx
        .selectFrom('feed_items')
        .select((eb) => eb.fn.count('timestamp').as('feed_rows_count'))
        .where('user_id', 'in', following)
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .execute()
        return { feedData, totalFeedItemsRows }
    })

    const { feedData, totalFeedItemsRows } = await select

    const totalRowCount = totalFeedItemsRows[0]['feed_rows_count'] as number

    return { feedData, totalRowCount }
}

// Variation on selectFeedData() for data about users session user follows
export const selectFollowingFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup = {'items': ['now_playing_post', 'social_follow', 'comment', 'reaction', 'collection_follow', 'collection_edit']} ) {

    const offset = batchSize * batchIterator

    const itemTypes = options.items

    const select = await db.transaction().execute(async (trx) => {
        const selectFollowingList = await trx
        .selectFrom('profile_display')
        .select('users_following')
        .where('user_id', '=', sessionUserId)
        .executeTakeFirst()

        const following = selectFollowingList?.users_following as string[]
        following.push(sessionUserId)

        const feedData = await trx
        .selectFrom('feed_items')
        .selectAll()
        .where(({eb, and}) => and([
            eb('user_id', 'in', following),
            eb('item_type', 'in', itemTypes),
            eb('item_type', '!=', 'social_follow'),
            eb('item_type', '!=', 'reaction')
        ]))
        .where('user_id', 'in', following)
        .where('item_type', 'in', itemTypes)
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .limit(batchSize)
        .orderBy('timestamp', 'desc')
        .offset(offset)
        .execute()

        const totalFeedItemsRows = await trx
        .selectFrom('feed_items')
        .select((eb) => eb.fn.count('timestamp').as('feed_rows_count'))
        .where(({eb, and}) => and([
            eb('user_id', 'in', following),
            eb('item_type', 'in', itemTypes),
            eb('item_type', '!=', 'social_follow'),
            eb('item_type', '!=', 'reaction')
        ]))
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .execute()
        return { feedData, totalFeedItemsRows }
    })

    const { feedData, totalFeedItemsRows } = await select

    const totalRowCount = totalFeedItemsRows[0]['feed_rows_count'] as number

    return { feedData, totalRowCount }
}

// Vartion on selectFeedData() for public data
export const selectFirehoseFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date ) {

    const offset = batchSize * batchIterator

    const select = await db.transaction().execute(async (trx) => {
        const selectFollowingList = await trx
        .selectFrom('profiles')
        .select('id')
        .where(({not, exists, selectFrom}) => not(
            exists(
                selectFrom('user_moderation_actions')
                .selectAll()
                .whereRef('user_moderation_actions.user_id', '=', 'profiles.id')
                .where('user_moderation_actions.target_user_id', '=', sessionUserId )
                .where('type', '=', 'block')
                .where('active', '=', true)
        )))
        .execute()

        const following = [] as string[]

        for ( const profile of selectFollowingList ) {
            following.push(profile.id)
        }

        following.push(sessionUserId)
        
        const feedData = await trx
        .selectFrom('feed_items')
        .selectAll()
        .where('user_id', 'in', following)
        .where(({eb, and}) => and([
            eb('item_type', '!=', 'reaction'),
            eb('item_type', '!=', 'comment'),
            eb('item_type', '!=', 'social_follow'),
            eb('item_type', '!=', 'collection_follow')
        ]))
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .limit(batchSize)
        .orderBy('timestamp', 'desc')
        .offset(offset)
        .execute()

        const totalFeedItemsRows = await trx
        .selectFrom('feed_items')
        .select((eb) => eb.fn.count('timestamp').as('feed_rows_count'))
        .where('user_id', 'in', following)
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .execute()
        return { feedData, totalFeedItemsRows }
    })

    const { feedData, totalFeedItemsRows } = await select

    const totalRowCount = totalFeedItemsRows[0]['feed_rows_count'] as number

    return { feedData, totalRowCount }
}

// Vartion on selectFeedData() for only items targetting session user
export const selectNotificationsFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup = {'items': ['now_playing_post', 'social_follow', 'comment', 'reaction', 'collection_follow', 'collection_edit']} ) {

    const offset = batchSize * batchIterator

    const itemTypes = options.items as string[]

    const select = await db.transaction().execute(async (trx) => {
        const feedData = await trx
        .selectFrom('feed_items')
        .selectAll()
        .where(({eb, or, and}) => and([
            or([
                eb('parent_post_user_id', '=', sessionUserId),
                eb('reaction_post_user_id', '=', sessionUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('collection_owner_id', '=', sessionUserId),
            ]),
            eb('item_type', 'in', itemTypes)
        ]))
        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .limit(batchSize)
        .orderBy('timestamp', 'desc')
        .offset(offset)
        .execute()

        const totalFeedItemsRows = await trx
        .selectFrom('feed_items')
        .select((eb) => eb.fn.count('timestamp').as('feed_rows_count'))
        .where(({eb, or, and}) => and([
            or([
                eb('parent_post_user_id', '=', sessionUserId),
                eb('reaction_post_user_id', '=', sessionUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('collection_owner_id', '=', sessionUserId)
            ]),
            eb('item_type', 'in', itemTypes)
        ]))        .where((eb) => eb.between('timestamp', timestampStart, timestampEnd))
        .execute()
        return { feedData, totalFeedItemsRows }
    })

    const { feedData, totalFeedItemsRows } = await select

    const totalRowCount = totalFeedItemsRows[0]['feed_rows_count'] as number

    return { feedData, totalRowCount }
}

export const oldSelectFirehoseFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, feedItemCount: number, timestampStart: Date, timestampEnd: Date ) {

    const offset = batchSize * batchIterator

    const select = await db.transaction().execute(async (trx) => {
        /* fetch data for all users that don't block session user */
        const selectUsers = await trx
        .selectFrom('profiles')
        .select('id')
        .where(({not, exists, selectFrom}) => not(
            exists(
                selectFrom('user_moderation_actions')
                .selectAll()
                .whereRef('user_moderation_actions.user_id', '=', 'profiles.id')
                .where('user_moderation_actions.target_user_id', '=', sessionUserId )
                .where('active', '=', true)
        )))
        .execute()

        /* get list of those users' IDs */
        const userIds: string[] = []

        for( const user of selectUsers ) {
            const id = user.id as string
            userIds.push(id)
        }

        /* count and fetch recent Now Playing posts */
        let postsTotal = 0
        let posts: App.RowData = []

        const countPosts = await trx
        .selectFrom('posts')
        .select((eb) => eb.fn.count<number>('id').as('posts_count'))
        .where('user_id', 'in', userIds)
        .where('posts.type', '=', 'now_playing')
        .where('posts.status', '!=', 'deleted')
        .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
        .execute()

        postsTotal = countPosts[0]['posts_count']

        const selectPosts = await trx
        .selectFrom('posts as post')
        .innerJoin('profiles as profile', 'post.user_id', 'profile.id')
        .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
        .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
        .leftJoin(
            'post_reactions as reaction',
            (join) => join
            .onRef('reaction.post_id', '=', 'post.id')
            .on((eb) => eb('reaction.user_id', '=', sessionUserId))
        )
        .leftJoin('post_reactions as all_reactions',
            (join) => join
            .onRef('all_reactions.post_id', '=', 'post.id')
            .on('all_reactions.active', '=', true)
        )
        .select([
            'post.id as now_playing_post_id', 
            'post.user_id as user_id', 
            'profile.display_name as display_name', 
            'profile.username as username', 
            'release_groups.img_url as avatar_url', 
            'release_groups.last_fm_img_url as avatar_last_fm_img_url',
            'release_groups.release_group_name as avatar_release_group_name',
            'artists.artist_name as avatar_artist_name',
            'post.text as text', 
            'post.item_type as item_type', 
            'post.artist_name as artist_name', 
            'post.release_group_name as release_group_name', 
            'post.recording_name as recording_name', 
            'post.episode_title as episode_title', 
            'post.show_title as show_title', 
            'post.listen_url as listen_url', 
            'post.created_at as feed_item_timestamp',
            'post.embed_id as embed_id',
            'post.embed_source as embed_source',
            'post.embed_account as embed_account',
            'post.listen_url as listen_url',
            'post.user_added_metadata_id as user_added_metadata_id',
            'reaction.active as reaction_active',
            (eb) => eb.fn.count('all_reactions.id').as('reaction_count')
        ])
        .where('post.user_id', 'in', userIds)
        .where('post.type', '=', 'now_playing')
        .where('post.status', '!=', 'deleted')
        .where((eb) => eb.between('post.created_at', timestampStart, timestampEnd))
        .groupBy([
            'post.id',
            'profile.display_name',
            'profile.username',
            'profile.avatar_url',
            'reaction.active',
            'artists.artist_name',
            'release_groups.img_url',
            'release_groups.last_fm_img_url',
            'release_groups.release_group_name'
        ])
        .limit(batchSize)
        .offset(offset)
        .orderBy('feed_item_timestamp', 'desc')
        .execute()

        posts = selectPosts

        /* count and fetch collection edits */
        let collectionEditsTotal = 0
        let collectionEdits: App.RowData = []
        
        /* count collection edits by all users */
        const countCollectionsEdits = await trx
        .selectFrom('collections_updates')
        .innerJoin('collections_info as info', 'info.collection_id', 'collections_updates.collection_id')
        .select((eb) => eb.fn.count<number>('collections_updates.collection_id').as('collection_edits_count'))
        .where('collections_updates.updated_by', 'in', userIds)
        .where('info.status', '!=', 'deleted')
        .where((eb) => eb.between('collections_updates.updated_at', timestampStart, timestampEnd))
        .execute()

        collectionEditsTotal = countCollectionsEdits[0]['collection_edits_count']

        /* get info about those edits */
        const selectCollectionsEdits = await trx
        .selectFrom('collections_updates')
        .innerJoin('collections_info as info', 'info.collection_id', 'collections_updates.collection_id')
        .innerJoin('profiles as profile', 'profile.id', 'collections_updates.updated_by')
        .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
        .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
        .select([
            'collections_updates.id as collection_edit_id', 
            'collections_updates.collection_id as collection_id', 
            'collections_updates.updated_at as feed_item_timestamp', 
            'collections_updates.updated_by as updated_by',
            'info.title as title',  
            'info.is_top_albums as is_top_albums',
            'profile.username as username',
            'profile.display_name as display_name', 
            'release_groups.img_url as avatar_url',
            'release_groups.last_fm_img_url as avatar_last_fm_img_url',
            'release_groups.release_group_name as avatar_release_group_name',
            'artists.artist_name as avatar_artist_name'
        ])
        .where('info.status', '!=', 'deleted')
        .where('collections_updates.updated_by', 'in', userIds)
        .where((eb) => eb.between('collections_updates.updated_at', timestampStart, timestampEnd))
        .limit(batchSize)
        .offset(offset)
        .orderBy('feed_item_timestamp desc')
        .execute()

        collectionEdits = selectCollectionsEdits

        const totalRowCount = Number(postsTotal) + Number (collectionEditsTotal)

        return { postsTotal, posts, collectionEditsTotal, collectionEdits, totalRowCount }
    })

    const data = await select
    
    let feedData = [] as App.RowData[]

    feedData = feedData.concat(data.posts, data.collectionEdits)

    feedData.sort(( a: App.RowData, b: App.RowData ) => b.feed_item_timestamp - a.feed_item_timestamp)

    const { totalRowCount } = data
    const remainingCount = totalRowCount - (feedItemCount + feedData.length)
    return { feedData, totalRowCount, remainingCount }
}
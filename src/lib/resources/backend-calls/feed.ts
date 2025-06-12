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
export const selectFollowingFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup = {'items': ['now_playing_post', 'social_follow', 'comment', 'reply_to_reply', 'reaction', 'collection_follow', 'collection_edit']} ) {

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
            eb('item_type', '!=', 'reply_to_reply'),
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
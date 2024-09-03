import { db } from 'src/database.ts'
import { parseISO } from "date-fns"

/* 
Selects first batch of data to populate session user's feed in batches within a particular date range. Also returns 'batchSize' to ensure consistent querying with selectMoreFeedData() function and 'totalRowCount' to tell UI if there is more data to load.

'options' specifices what type of data shows up in feed, expects an object formatted as {'options': [values]} containing any of the following values: ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits'] 
*/

export const selectFeedData = async function ( sessionUserId: string, batchSize: number,  timestampStart: Date, timestampEnd: Date, options: App.Lookup) {

    const feedOptions = options.options as string[]

    const select = await db.transaction().execute(async (trx) => {

        /* fetch data for all users that Session User follows that aren't blocking Session User */
        const selectFollowingUsers = await trx
        .selectFrom('social_graph')
        .select('target_user_id')
        .where(({eb, and, not, exists, selectFrom}) => and([
            eb('user_id', '=', sessionUserId),
            eb('follows_now', '=', true),
            not(
                exists(
                    selectFrom('user_moderation_actions')
                    .selectAll()
                    .whereRef('user_moderation_actions.user_id', '=', 'social_graph.target_user_id')
                    .whereRef('user_moderation_actions.target_user_id', '=', 'social_graph.user_id')
                    .where('active', '=', true)
                )
            )
        ]))
        .execute()

        /* get list of those users' IDs */
        const followingUserIds: string[] = []
        for( const user of selectFollowingUsers ) {
            const id = user.target_user_id
            followingUserIds.push(id)
        }

        /* count and fetch recent Now Playing posts by followed users */
        let postsTotal = 0
        let posts: App.RowData = []

        if ( feedOptions.includes('nowPlayingPosts')) {
            const countFollowingUsersPosts = await trx
            .selectFrom('posts')
            .select((eb) => eb.fn.count<number>('id').as('posts_count'))
            .where('user_id', 'in', followingUserIds)
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            postsTotal = countFollowingUsersPosts[0]['posts_count']

            
            const selectFollowingPosts = await trx
            .selectFrom('posts as post')
            .innerJoin('profiles as profile', 'user_id', 'profile.id')
            .select([
                'post.id as now_playing_post_id', 
                'post.user_id as user_id', 
                'profile.display_name as display_name', 
                'profile.username as username', 
                'profile.avatar_url as avatar_url', 
                'post.text as text', 
                'post.item_type as item_type', 
                'post.artist_name as artist_name', 
                'post.release_group_name as release_group_name', 
                'post.recording_name as recording_name', 
                'post.episode_title as episode_title', 
                'post.show_title as show_title', 
                'post.listen_url as listen_url', 
                'post.created_at as feed_item_timestamp'
            ])
            .where('user_id', 'in', followingUserIds)
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('post.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            posts = selectFollowingPosts
        }
        
        /* count and fetch recent comments from one followed user on another followed user's post */
        let commentsTotal = 0
        let comments: App.RowData = []

        if ( feedOptions.includes('comments')) {

            const countFollowingComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .select((eb) => eb.fn.count<number>('comments.id').as('comments_count'))
            .where('comments.user_id', 'in', followingUserIds)
            .where('original_post.user_id', 'in', followingUserIds)
            .where('comments.parent_post_id', 'is not', null)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            commentsTotal = countFollowingComments[0]['comments_count']

            const selectFollowingComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            // .innerJoin(
            //     (eb) => eb
            //         .selectFrom('profiles as original_poster_profile')
            //         .select(['id', 'display_name', 'username'])
            //         .whereRef('original_poster_profile.id', '=', 'original_post.user_id')
            //         .as('original_poster'),
            //     (join) => join
            //         .onRef('original_poster.id', '=', 'original_post.user_id')
            // )
            .select([
                'comments.id as comment_id', 
                'comments.user_id', 
                'commenter.display_name as display_name', 
                'commenter.avatar_url as avatar_url', 
                'comments.text as comment_text', 'comments.parent_post_id', 
                'original_post.user_id as original_poster_user_id', 
                // 'original_poster.display_name as original_poster_display_name', 
                // 'original_poster.username as original_poster_username', 
                'comments.created_at as feed_item_timestamp'
            ])
            .where('comments.user_id', 'in', followingUserIds)
            .where('original_post.user_id', 'in', followingUserIds)
            .where('comments.parent_post_id', 'is not', null)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            comments = selectFollowingComments
        }
        

        /* count and fetch recent reactions by followed users */
        let reactionsTotal = 0
        let reactions: App.RowData = []

        if ( feedOptions.includes('reactions')) {

            const countFollowingReactions = await trx
            .selectFrom('post_reactions')
            .select((eb) => eb.fn.count<number>('id').as('reactions_count'))
            .where('user_id', 'in', followingUserIds)
            .where('active', '=', true)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsTotal = countFollowingReactions[0]['reactions_count']

            const selectFollowingReactions = await trx
            .selectFrom('post_reactions as reaction')
            .innerJoin('posts as original_post', 'original_post.id', 'reaction.post_id')
            .innerJoin('profiles as react_user', 'react_user.id', 'reaction.user_id')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            .select([
                'reaction.id as reaction_id', 
                'reaction.user_id as react_user_id', 
                'reaction.post_id as post_id', 
                'reacton.reaction as reaction', 
                'reaction.updated_at as feed_item_timestamp', 
                'react_user.display_name as display_name', 
                'react_user.avatar_url as avatar_url', 
                'original_post.user_id as original_post_id', 
                'original_poster.display_name as original_poster_display_name', 
                'original_poster.username as original_poster_username'
            ])
            .where('reaction.user_id', 'in', followingUserIds)
            .where('active', '=', true)
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('reaction.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            reactions = selectFollowingReactions
        }

        /* count and fetch collection follows by followed users */
        let collectionsSocialTotal = 0
        let collectionFollows: App.RowData = []

        if ( feedOptions.includes('collectionFollows')) {

            const countFollowingCollectionsSocial = await trx
            .selectFrom('collections_social')
            .select((eb) => eb.fn.count<number>('id').as('collection_follows_count'))
            .where(({eb, and}) => and ([
                eb('user_id', 'in', followingUserIds),
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true)
            ]))
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            collectionsSocialTotal = countFollowingCollectionsSocial[0]['collection_follows_count']

            const selectFollowingCollectionsSocial = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .innerJoin('profiles as profile', 'collections_social.user_id', 'profile.id')
            .select([
                'collections_social.id as collection_follow_id', 
                'collections_social.collection_id as collection_id', 
                'collections_social.user_id as user_id', 
                'collections_social.updated_at as feed_item_timestamp', 
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url', 
                'info.title as title'
            ])
            .where(({eb, and}) => and ([
                eb('user_id', 'in', followingUserIds),
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true)
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            collectionFollows = selectFollowingCollectionsSocial
        }

        /* count and fetch collection edits by followed users */
        let collectionEditsTotal = 0
        let collectionEdits: App.RowData = []

        if (feedOptions.includes('collectionEdits')) {
            

            const countFollowingCollectionsEdits = await trx
            .selectFrom('collections_info')
            .select((eb) => eb.fn.count<number>('collection_id').as('collection_edits_count'))
            .where('updated_by', 'in', followingUserIds)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            collectionEditsTotal = countFollowingCollectionsEdits[0]['collection_edits_count']

            const selectFollowingCollectionsEdits = await trx
            .selectFrom('collections_updates')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_updates.collection_id')
            .innerJoin('profiles as profile', 'profile.id', 'collections_updates.updated_by')
            .select([
                'collections_updates.id as collection_edit_id', 
                'collections_updates.collection_id as collection_id', 
                'collections_updates.updated_at as feed_item_timestamp', 
                'collections_updates.updated_by as updated_by',
                'info.title as title',  
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url'
            ])
            .where('collections_updates.updated_by', 'in', followingUserIds)
            .where((eb) => eb.between('collections_updates.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .orderBy('feed_item_timestamp desc')
            .execute()

            collectionEdits = selectFollowingCollectionsEdits
        }

        const totalRowCount = postsTotal + commentsTotal + reactionsTotal + collectionsSocialTotal + collectionEditsTotal

        return ({posts, comments, reactions, collectionFollows, collectionEdits, totalRowCount})
    })

    const data = await select

    let feedData: object[] = []
    feedData = feedData.concat(data.posts, data.comments, data.reactions, data.collectionFollows, data.collectionEdits)

    feedData.sort(( a: App.RowData, b: App.RowData ) => b.feed_item_timestamp - a.feed_item_timestamp)
    const { totalRowCount } = data
    return { feedData, totalRowCount, batchSize }
}

/* 
Selects subsequent batches of data to populate session user's feed in batches within a particular date range. Also returns 'batchSize' and 'batchIterator' to ensure consistent subsequent queries.

'options' specifices what type of data shows up in feed, expects an array containing any of the following strings: ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits'] 
*/

export const selectMoreFeedData = async function ( sessionUserId: string, batchSize: number, batchIterator: number,  timestampStart: Date, timestampEnd: Date, options: App.Lookup) {

    const feedOptions = options.options as string[]
    const offset = batchSize * batchIterator

    const select = await db.transaction().execute(async (trx) => {

        /* fetch data for all users that Session User follows that aren't blocking Session User */
        const selectFollowingUsers = await trx
        .selectFrom('social_graph')
        .select('target_user_id')
        .where(({eb, and, not, exists, selectFrom}) => and([
            eb('user_id', '=', sessionUserId),
            eb('follows_now', '=', true),
            not(
                exists(
                    selectFrom('user_moderation_actions')
                    .selectAll()
                    .whereRef('user_moderation_actions.user_id', '=', 'social_graph.target_user_id')
                    .whereRef('user_moderation_actions.target_user_id', '=', 'social_graph.user_id')
                    .where('active', '=', true)
                )
            )
        ]))
        .execute()

        /* get list of those users' IDs */
        const followingUserIds: string[] = []
        for( const user of selectFollowingUsers ) {
            const id = user.target_user_id
            followingUserIds.push(id)
        }

        /* fetch recent Now Playing posts by followed users */
        let posts: App.RowData = []

        if ( feedOptions.includes('nowPlayingPosts')) {
            const selectFollowingPosts = await trx
            .selectFrom('posts')
            .innerJoin('profiles as profile', 'user_id', 'profile.id')
            .select([
                'posts.id as id', 
                'posts.user_id as user_id', 
                'posts.text as text', 
                'posts.item_type as item_type', 
                'posts.artist_name as artist_name', 
                'posts.release_group_name as release_group_name', 
                'posts.recording_name as recording_name', 
                'posts.episode_title as episode_title', 
                'posts.show_title as show_title', 
                'posts.listen_url as listen_url', 
                'posts.created_at as feed_item_timestamp',
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url'
            ])
            .where('user_id', 'in', followingUserIds)
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            posts = selectFollowingPosts
        }
        
        /* fetch recent comments from one followed user on another followed user's post */
        let comments: App.RowData = []

        if ( feedOptions.includes('comments')) {
            const selectFollowingComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .innerJoin('profiles as commenter', 'commenter.id', 'user_id')
            .innerJoin(
                (eb) => eb
                    .selectFrom('profiles')
                    .select(['id', 'display_name'])
                    .whereRef('id', '=', 'original_post.user_id')
                    .as('original_poster'),
                (join) => join
                    .onRef('original_poster.id', '=', 'original_post.user_id')
            )
            .select([
                'comments.id as id', 
                'comments.user_id as user_id', 
                'commenter.display_name as display_name', 
                'commenter.avatar_url as avatar_url', 
                'comments.text as text', 
                'comments.parent_post_id as parent_post_id', 
                'original_post.user_id as parent_post_user_id', 
                'original_poster.display_name as original_poster_display_name', 
                'original_post.created_at as feed_item_timestamp'
            ])
            .where('user_id', 'in', followingUserIds)
            .where('original_post.user_id', 'in', followingUserIds)
            .where('parent_post_id', 'is not', null)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            comments = selectFollowingComments
        }
        
        /* fetch recent reactions by followed users */
        let reactions: App.RowData = []

        if ( feedOptions.includes('reactions')) {
            const selectFollowingReactions = await trx
            .selectFrom('post_reactions')
            .innerJoin('posts as post', 'post.id', 'post_id')
            .innerJoin('profiles as react_user', 'react_user.id', 'user_id')
            .innerJoin('profiles as original_poster', 'post.user_id', 'user_id')
            .select([
                'post_reactions.id as id', 
                'post_reactions.user_id as user_id', 
                'post_reactions.post_id as post_id', 
                'post_reactions.reaction as reaction', 
                'updated_at as feed_item_timestamp',
                'react_user.id as react_user_id', 
                'react_user.display_name as react_user_display_name', 
                'react_user.avatar_url as react_user_avatar_url', 
                'post.user_id as original_poster_user_id', 
                'original_poster.display_name as original_poster_display_name'
            ])
            .where('user_id', 'in', followingUserIds)
            .where('active', '=', true)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp desc')
            .execute()

            reactions = selectFollowingReactions
        }

        /* fetch collection follows by followed users */
        let collectionFollows: App.RowData = []

        if ( feedOptions.includes('collectionFollows')) {
            const selectFollowingCollectionsSocial = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collection_id')
            .innerJoin('profiles as profile', 'user_id', 'id')
            .select([
                'collections_social.id as id', 
                'collections_social.collection_id as collection_id', 
                'collections_social.user_id as user_id', 
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url', 
                'collections_social.updated_at as feed_item_timestamp', 
                'info.title as title', 
            ])
            .where(({eb, and}) => and ([
                eb('user_id', 'in', followingUserIds),
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true)
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp desc')
            .execute()

            collectionFollows = selectFollowingCollectionsSocial
        }

        /* fetch collection edits by followed users */
        let collectionEdits: App.RowData = []

        if (feedOptions.includes('collectionEdits')) {
            const selectFollowingCollectionsEdits = await trx
            .selectFrom('collections_updates')
            .innerJoin('collections_info as info', 'info.collection_id', 'collection_id')
            .innerJoin('profiles as profile', 'profile.id', 'updated_by')
            .select([
                'collections_updates.id as collection_edit_id', 
                'collections_updates.collection_id as collection_id', 
                'collections_updates.updated_at as feed_item_timestamp', 
                'collections_updates.updated_by as updated_by', 
                'info.title as title', 
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url'
            ])
            .where('updated_by', 'in', followingUserIds)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp desc')
            .execute()

            collectionEdits = selectFollowingCollectionsEdits
        }

        return ({posts, comments, reactions, collectionFollows, collectionEdits})
    })

    const data = await select

    let moreFeedData: object[] = []
    moreFeedData = moreFeedData.concat(data.posts, data.comments, data.reactions, data.collectionFollows, data.collectionEdits)

    moreFeedData.sort(( a: App.RowData, b: App.RowData ) => b.feed_item_timestamp - a.feed_item_timestamp)
    return { moreFeedData, batchSize, batchIterator }
}
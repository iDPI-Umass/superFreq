import { sql } from 'kysely'
import { db } from 'src/database.ts'

/* 
Selects batches of data to populate session user's feed in batches within a particular date range. Also returns 'batchSize' to ensure consistent subsequent querying and 'totalRowCount' to tell UI if there is more data to load.

'options' specifices what type of data shows up in feed, expects an object formatted as {'options': [values]} containing any of the following values: ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits'] 
*/

export const selectFeedData = async function ( sessionUserId: string, batchSize: number, batchIterator: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup ) {

    const offset = batchSize * batchIterator

    const feedOptions = options.options as string[]

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
        .where('user_id', 'in', following)
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

export const oldFeed = async function ( sessionUserId: string, batchSize: number, batchIterator: number, feedItemCount: number, timestampStart: Date, timestampEnd: Date, options: App.Lookup ) {

    const offset = batchSize * batchIterator

    const feedOptions = options.options as string[]

    const select = await db.transaction().execute(async (trx) => {

        /* get list of session user's recent post IDs */

        const selectPostsList = await trx
            .selectFrom('posts')
            .select('id')
            .where('user_id', '=', sessionUserId)
            .where('parent_post_id', 'is', null)
            .execute()

        const postList = await selectPostsList

        const postIdList = []

        let sessionUserPostsTotal = 0
        let sessionUserPosts: App.RowData = []
        let sessionUserCommentsTotal = 0
        let sessionUserComments: App.RowData = []
        let commentsSessionUserPostTotal = 0
        let commentsSessionUserPost: App.RowData = []
        let reactionsSessionUserPostTotal = 0
        let reactionsSessionUserPost: App.RowData = [] 

        if ( postList.length > 0 ) {
            for ( const post of postList ) {
                postIdList.push(post.id)
            }

            /* count session user's recent posts */
            const countSessionUserPosts = await trx
            .selectFrom('posts')
            .select((eb) => eb.fn.count<number>('posts.id').as('session_user_posts_count'))
            .where('posts.type', '=', 'now_playing')
            .where('posts.user_id', '=', sessionUserId)
            .where('posts.status', '!=', 'deleted')
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            sessionUserPostsTotal = countSessionUserPosts[0]['session_user_posts_count']

            /* get data about those posts */
            
            const selectSessionUserPosts = await trx
            .selectFrom('posts as post')
            .innerJoin('profiles as profile', 'profile.id', 'post.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .leftJoin('post_reactions as reaction',
                (join) => join
                .onRef('reaction.post_id', '=', 'post.id')
                .on('reaction.active', '=', true)
                .on('reaction.user_id', '=', sessionUserId)
            )
            .leftJoin('post_reactions as all_reactions',
                (join) => join
                .onRef('all_reactions.post_id', '=', 'post.id')
                .on('all_reactions.active', '=', true)
            )
            .select([
                'post.id as now_playing_post_id', 
                'post.user_id as user_id', 
                'post.text as text', 
                'post.item_type as item_type', 
                'post.artist_mbid as artist_mbid',
                'post.release_group_mbid as release_group_mbid',
                'post.recording_mbid as recording_mbid',
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
                'profile.username as username',
                'profile.display_name as display_name',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'reaction.active as reaction_active',
                (eb) => eb.fn.count('all_reactions.id').as('reaction_count')
            ])
            .where('post.user_id', '=', sessionUserId)
            .where('post.type', '=', 'now_playing')
            .where('post.status', '!=', 'deleted')
            .where((eb) => eb.between('post.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .groupBy([
                'post.id', 
                'profile.display_name',
                'profile.username',
                'profile.avatar_url',
                'artists.artist_name',
                'release_groups.img_url',
                'release_groups.last_fm_img_url',
                'release_groups.release_group_name',
                'reaction.active'
            ])
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserPosts = selectSessionUserPosts

            /* count session user's recent comments */
            const countSessionUserComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'original_post.id', 'comments.parent_post_id')
            .select((eb) => eb.fn.count<number>('comments.id').as('session_user_comments_count'))
            .where('comments.type', '=', 'reply')
            .where('comments.status', '!=', 'deleted')
            .where('comments.user_id', '=', sessionUserId)
            .where('original_post.user_id', '!=', sessionUserId)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            sessionUserCommentsTotal = countSessionUserComments[0]['session_user_comments_count']

            /* get data about those comments */

            const selectSessionUserComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as profile', 'profile.id', 'comments.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .innerJoin('posts as original_post', 'original_post.id', 'comments.parent_post_id')
            .innerJoin('profiles as original_poster', 'original_poster.id', 'original_post.user_id')
            .select([
                'comments.id as session_user_comment_id', 
                'comments.user_id as user_id', 
                'comments.text as text', 
                'comments.item_type as item_type', 
                'comments.artist_name as artist_name', 
                'comments.release_group_name as release_group_name', 
                'comments.recording_name as recording_name', 
                'comments.episode_title as episode_title', 
                'comments.show_title as show_title', 
                'comments.listen_url as listen_url', 
                'comments.created_at as feed_item_timestamp',
                'comments.embed_id as embed_id',
                'comments.embed_source as embed_source',
                'comments.embed_account as embed_account',
                'comments.listen_url as listen_url',
                'profile.username as username',
                'profile.display_name as display_name',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'original_poster.username as original_poster_username',
                'original_poster.display_name as original_poster_display_name','original_post.created_at as original_post_created_at'
            ])
            .where('comments.user_id', '=', sessionUserId)
            .where('original_post.user_id', '!=', sessionUserId)
            .where('comments.type', '=', 'reply')
            .where('comments.status', '!=', 'deleted')
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserComments = selectSessionUserComments

            /* count comments on a post session user made */
            const countCommentsSessionUserPost = await trx
            .selectFrom('posts as comments')
            .select((eb) => eb.fn.count<number>('comments.id').as('comments_count'))
            .where('comments.parent_post_id', 'in', postIdList)
            .where('comments.status','!=', 'deleted')
            .where('comments.user_id', '!=', sessionUserId)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            commentsSessionUserPostTotal = countCommentsSessionUserPost[0]['comments_count']

            /* get data about those comments */
            const selectCommentsSessionUserPost = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'commenter.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .innerJoin('posts as user_posts', 'user_posts.id', 'comments.parent_post_id')
            .innerJoin('profiles as user', 'user.id', 'user_posts.user_id')
            .select([
                'commenter.id as session_user_post_commenter_id', 
                'commenter.display_name as session_user_post_commenter_display_name', 
                'commenter.username as username',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'comments.created_at as feed_item_timestamp',
                'user_posts.id as post_id',
                'user_posts.created_at as original_post_created_at',
                'user.username as original_poster_username'
            ])
            .where('comments.parent_post_id', 'in', postIdList)
            .where('comments.status','!=', 'deleted')
            .where('comments.user_id', '!=', sessionUserId)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            commentsSessionUserPost = selectCommentsSessionUserPost

            /* count reactions to a post session user made */
            const countReactionsSessionUserPost = await trx
            .selectFrom('post_reactions')
            .select((eb) => eb.fn.count<number>('post_reactions.id').as('reactions_count'))
            .where('post_reactions.post_id', 'in', postIdList)
            .where('post_reactions.active', '=', true)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsSessionUserPostTotal = countReactionsSessionUserPost[0]['reactions_count']

            /* get data about those reactions */
            const selectReactionsSessionUserPost = await trx
            .selectFrom('post_reactions')
            .innerJoin('profiles as react_user', 'react_user.id', 'post_reactions.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'react_user.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .innerJoin('posts as user_posts', 'user_posts.id', 'post_reactions.post_id')
            .innerJoin('profiles as user', 'user.id', 'user_posts.user_id')
            .select([
                'react_user.id as session_user_post_react_user_id', 
                'react_user.display_name as session_user_post_react_user_display_name', 
                'react_user.username as session_user_post_react_user_username',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'post_reactions.updated_at as feed_item_timestamp',
                'user_posts.id as post_id',
                'user_posts.created_at as post_created_at',
                'user.username as original_poster_username'
            ])
            .where('post_reactions.post_id', 'in', postIdList)
            .where('post_reactions.active', '=', true)
            .where((eb) => eb.between('post_reactions.updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsSessionUserPost = selectReactionsSessionUserPost
        }

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

        if ( feedOptions.includes('nowPlayingPosts') && followingUserIds.length > 0) {
            const countFollowingUsersPosts = await trx
            .selectFrom('posts')
            .select((eb) => eb.fn.count<number>('id').as('posts_count'))
            .where('user_id', 'in', followingUserIds)
            .where('posts.type', '=', 'now_playing')
            .where('posts.status', '!=', 'deleted')
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            postsTotal = countFollowingUsersPosts[0]['posts_count']

            const selectFollowingPosts = await trx
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
                'post.artist_mbid as artist_mbid',
                'post.release_group_mbid as release_group_mbid',
                'post.recording_mbid as recording_mbid',
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
            .where('post.user_id', 'in', followingUserIds)
            .where('post.type', '=', 'now_playing')
            .where('post.status', '!=', 'deleted')
            .where((eb) => eb.between('post.created_at', timestampStart, timestampEnd))
            .groupBy([
                'post.id',
                'profile.display_name',
                'profile.username',
                'release_groups.img_url',
                'release_groups.last_fm_img_url',
                'reaction.active',
                'artists.artist_name',
                'release_groups.last_fm_img_url',
                'release_groups.release_group_name'
            ])
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            posts = selectFollowingPosts
        }
        // random comment
        /* count and fetch recent comments from one followed user on another followed user's post */
        let commentsTotal = 0
        let comments: App.RowData = []

        if ( feedOptions.includes('comments') && followingUserIds.length > 0) {

            /* count comments by one user session user follows on another's post */
            const countFollowingComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .select((eb) => eb.fn.count<number>('comments.id').as('comments_count'))
            .where('comments.user_id', 'in', followingUserIds)
            .where('comments.type', '=', 'reply')
            .where('comments.status', '!=', 'deleted')
            .where('original_post.user_id', 'in', followingUserIds)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            commentsTotal = countFollowingComments[0]['comments_count']

            /* get data about those comments */
            const selectFollowingComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'commenter.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            .select([
                'comments.id as followed_user_comment_id', 
                'comments.user_id as user_id', 
                'commenter.username as username',
                'commenter.display_name as display_name', 
                'release_groups.img_url as avatar_url', 
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'comments.text as comment_text', 'comments.parent_post_id', 
                'original_post.user_id as original_poster_user_id', 
                'original_poster.display_name as original_poster_display_name', 
                'original_poster.username as original_poster_username', 
                'original_post.created_at as original_post_created_at',
                'comments.created_at as feed_item_timestamp'
            ])
            .where('comments.user_id', 'in', followingUserIds)
            .where('comments.type', '=', 'reply')
            .where('comments.status', '!=', 'deleted')
            .where('original_post.user_id', 'in', followingUserIds)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            comments = selectFollowingComments
        }
        

        /* count and fetch recent reactions by followed users */
        let sessionUserPostsReactionsTotal = 0
        let reactionsTotal = 0
        let reactions: App.RowData = []

        if ( feedOptions.includes('reactions') && followingUserIds.length > 0) {

            /* count reactions to session user's posts */
            const countSessionUserPostsReactions = await trx
            .selectFrom('post_reactions')
            .innerJoin('posts', 'posts.id', 'post_reactions.post_id')
            .select((eb) => eb.fn.count<number>('post_reactions.id').as('reactions_count'))
            .where('posts.user_id', '=', sessionUserId)
            .where('post_reactions.active', '=', true)
            .where((eb) => eb.between('post_reactions.updated_at', timestampStart, timestampEnd))
            .execute()

            sessionUserPostsReactionsTotal = countSessionUserPostsReactions[0]['reactions_count']

            /* count reactions by users sesssion user follows on other users' posts */
            const countFollowingReactions = await trx
            .selectFrom('post_reactions')
            .innerJoin('posts', 'posts.id', 'post_reactions.post_id')
            .select((eb) => eb.fn.count<number>('post_reactions.id').as('reactions_count'))
            .where('post_reactions.user_id', 'in', followingUserIds)
            .where('post_reactions.active', '=', true)
            .where('posts.user_id', '!=', sessionUserId)
            .where((eb) => eb.between('post_reactions.updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsTotal = countFollowingReactions[0]['reactions_count']

            /* Select followed users reactions to other users' posts */
            const selectFollowingReactions = await trx
            .selectFrom('post_reactions as reaction')
            .innerJoin('posts as original_post', 'original_post.id', 'reaction.post_id')
            .innerJoin('profiles as react_user', 'react_user.id', 'reaction.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'react_user.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            .select([
                'reaction.id as reaction_id', 
                'reaction.user_id as react_user_id', 
                'reaction.post_id as post_id', 
                'reaction.reaction as reaction', 
                'reaction.updated_at as feed_item_timestamp', 
                'react_user.display_name as display_name', 
                'release_groups.img_url as avatar_url', 
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'original_post.user_id as original_post_id', 
                'original_post.created_at as original_post_created_at', 
                'original_poster.display_name as original_poster_display_name', 
                'original_poster.username as original_poster_username'
            ])
            .where('reaction.user_id', 'in', followingUserIds)
            .where('active', '=', true)
            .where('parent_post_id', 'is', null)
            .where('original_post.user_id', '!=', sessionUserId)
            .where((eb) => eb.between('reaction.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            reactions = selectFollowingReactions
        }

        /* count and fetch collection follows */
        let sessionUserCollectionsSocialTotal = 0
        let collectionsSocialTotal = 0
        let sessionUserCollectionFollows: App.RowData = []
        let collectionFollows: App.RowData = []

        if ( feedOptions.includes('collectionFollows') && followingUserIds.length > 0) {

            /* count collections session user follows */
            const countSessionUserCollectionsSocialTotal = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .select((eb) => eb.fn.count<number>('id').as('collection_follows_count'))
            .where(({eb, and}) => and ([
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.owner_id', '=', sessionUserId),
                eb('info.status', '!=', 'deleted')
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .execute()

            sessionUserCollectionsSocialTotal = countSessionUserCollectionsSocialTotal[0]['collection_follows_count']

            /* count other users' collections that followed users follow */
            const countFollowingCollectionsSocial = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .select((eb) => eb.fn.count<number>('id').as('collection_follows_count'))
            .where(({eb, and}) => and ([
                eb('user_id', 'in', followingUserIds),
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.status', '!=', 'deleted')
            ]))
            .where('info.owner_id', '!=', sessionUserId)
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .execute()

            collectionsSocialTotal = countFollowingCollectionsSocial[0]['collection_follows_count']

            /* get data about recent follows on session user's collection */
            const selectSessionUserCollectionFollows = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .innerJoin('profiles as profile', 'collections_social.user_id', 'profile.id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .select([
                'collections_social.id as session_user_owned_collection_follow_id', 
                'collections_social.collection_id as collection_id', 
                'collections_social.user_id as user_id', 
                'collections_social.updated_at as feed_item_timestamp', 
                'profile.display_name as display_name', 
                'release_groups.img_url as avatar_url', 
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'info.title as title'
            ])
            .where(({eb, and}) => and ([
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.owner_id', '=', sessionUserId),
                eb('info.status', '!=', 'deleted')
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserCollectionFollows = selectSessionUserCollectionFollows

            /* select collection follows by followed users but exclude session user's collections */
            const selectFollowingCollectionsSocial = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .innerJoin('profiles as profile', 'collections_social.user_id', 'profile.id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .select([
                'collections_social.id as followed_user_collection_follow_id', 
                'collections_social.collection_id as collection_id', 
                'collections_social.user_id as user_id', 
                'collections_social.updated_at as feed_item_timestamp', 
                'profile.display_name as display_name', 
                'release_groups.img_url as avatar_url', 
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'info.title as title'
            ])
            .where(({eb, and}) => and ([
                eb('user_id', 'in', followingUserIds),
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.status', '!=', 'deleted'),
                eb('info.owner_id', '!=', sessionUserId)
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            collectionFollows = selectFollowingCollectionsSocial
        }

        /* count and fetch collection edits by followed users */
        let collectionEditsTotal = 0
        let collectionEdits: App.RowData = []

        if (feedOptions.includes('collectionEdits') && followingUserIds.length > 0) {
            
            /* count collection edits by followed users */
            const countFollowingCollectionsEdits = await trx
            .selectFrom('collections_updates')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_updates.collection_id')
            .select((eb) => eb.fn.count<number>('collections_updates.collection_id').as('collection_edits_count'))
            .where('collections_updates.updated_by', 'in', followingUserIds)
            .where(({eb, and}) => and([
                eb('info.status', '!=', 'deleted'),
                eb('info.status', '!=', 'private')
            ]))
            .where((eb) => eb.between('collections_updates.updated_at', timestampStart, timestampEnd))
            .execute()

            collectionEditsTotal = countFollowingCollectionsEdits[0]['collection_edits_count']

            /* get info about those edits */
            const selectFollowingCollectionsEdits = await trx
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
                'profile.display_name as display_name', 
                'profile.username as username',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name'
            ])
            .where(({eb, and}) => and([
                eb('info.status', '!=', 'deleted'),
                eb('info.status', '!=', 'private')
            ]))
            .where('collections_updates.updated_by', 'in', followingUserIds)
            .where((eb) => eb.between('collections_updates.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp desc')
            .execute()

            collectionEdits = selectFollowingCollectionsEdits
        }

        /* count and fetch other users following session user */
        let newFollowsTotal = 0
        let newFollows: App.RowData = []

        const countNewFollows = await trx
        .selectFrom('social_graph')
        .select((eb) => eb.fn.count<number>('id').as('follows_count'))
        .where(({eb, and}) => and ([
            eb('target_user_id', '=', sessionUserId),
            eb('follows_now', '=', true),
        ]))
        .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
        .execute()

        newFollowsTotal = countNewFollows[0]['follows_count']

        const selectNewFollows = await trx
        .selectFrom('social_graph')
        .innerJoin('profiles as follower', 'follower.id', 'social_graph.user_id')
        .leftJoin('release_groups', 'release_groups.release_group_mbid', 'follower.avatar_mbid')
        .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
        .select([
            'social_graph.id as new_follow_id',
            'social_graph.updated_at as feed_item_timestamp',
            'follower.username as username',
            'follower.display_name as display_name',
            'release_groups.img_url as avatar_url',
            'release_groups.last_fm_img_url as avatar_last_fm_img_url',
            'release_groups.release_group_name as avatar_release_group_name',
            'artists.artist_name as avatar_artist_name'
        ])
        .where('target_user_id', '=', sessionUserId)
        .where('follows_now', '=', true)
        .where((eb) => eb.between('social_graph.updated_at', timestampStart, timestampEnd))
        .limit(batchSize)
        .offset(offset)
        .orderBy('feed_item_timestamp desc')
        .execute()

        newFollows = selectNewFollows

        const totalRowCount = Number(sessionUserPostsTotal) + Number(sessionUserCommentsTotal) + Number(commentsSessionUserPostTotal) + Number(reactionsSessionUserPostTotal) + Number(postsTotal) + Number(commentsTotal) + Number(sessionUserPostsReactionsTotal) + Number(reactionsTotal) + Number(sessionUserCollectionsSocialTotal) + Number(collectionsSocialTotal) + Number(collectionEditsTotal) + Number(newFollowsTotal)

        return { sessionUserPostsTotal, sessionUserCommentsTotal, commentsSessionUserPostTotal, reactionsSessionUserPostTotal, sessionUserPosts, sessionUserComments, commentsSessionUserPost, reactionsSessionUserPost, posts, comments, reactions, sessionUserCollectionFollows, collectionFollows, collectionEdits, newFollows, totalRowCount }
    })

    const data = await select

    let feedData = [] as App.RowData[]
    
    feedData = feedData.concat(data.sessionUserPosts, data.sessionUserComments, data.commentsSessionUserPost, data.reactionsSessionUserPost, data.posts, data.comments, data.reactions, data.sessionUserCollectionFollows, data.collectionFollows, data.collectionEdits, data.newFollows)

    feedData.sort(( a: App.RowData, b: App.RowData ) => b.feed_item_timestamp - a.feed_item_timestamp)

    const { totalRowCount } = data
    const remainingCount = totalRowCount - (feedItemCount + feedData.length)
    return { feedData, totalRowCount, remainingCount }
}

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

        const feedData = await trx
        .selectFrom('feed_items')
        .selectAll()
        .where('user_id', 'in', following)
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
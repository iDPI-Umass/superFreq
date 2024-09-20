import { db } from 'src/database.ts'
import { parseISO } from "date-fns"

/* 
Selects first batch of data to populate session user's feed in batches within a particular date range. Also returns 'batchSize' to ensure consistent querying with selectMoreFeedData() function and 'totalRowCount' to tell UI if there is more data to load.

'options' specifices what type of data shows up in feed, expects an object formatted as {'options': [values]} containing any of the following values: ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits'] 
*/

export const selectFeedData = async function ( sessionUserId: string, batchSize: number, batchIterator: number,  timestampStart: Date, timestampEnd: Date, options: App.Lookup) {

    let offset = batchSize * batchIterator

    const feedOptions = options.options as string[]

    const select = await db.transaction().execute(async (trx) => {

        /* get list of session user's recent post IDs */

        const selectPosts = await trx
            .selectFrom('posts')
            .select('id')
            .where('user_id', '=', sessionUserId)
            .where('parent_post_id', 'is', null)
            .execute()

        const postList = await selectPosts

        const postIdList = []

        let commentsSessionUserPostTotal = 0
        let commentsSessionuserPost: App.RowData = []
        let reactionsSessionUserPostTotal = 0
        let reactionsSessionUserPost: App.RowData = []

        if ( postList.length > 0 ) {
            for ( const post of postList ) {
                postIdList.push(post.id)
            }

            /* count comments on a post session user made */
            const countCommentsSessionUserPost = await trx
            .selectFrom('posts as comments')
            .select((eb) => eb.fn.count<number>('comments.id').as('comments_count'))
            .where('comments.parent_post_id', 'in', postIdList)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            commentsSessionUserPostTotal = countCommentsSessionUserPost[0]['comments_count']

            /* get data about those comments */
            const selectCommentsSessionUserPost = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .innerJoin('posts as user_posts', 'user_posts.id', 'comments.parent_post_id')
            .innerJoin('profiles as user', 'user.id', 'user_posts.user_id')
            .select([
                'commenter.id as session_user_post_commenter_id', 
                'commenter.display_name as session_user_post_commenter_display_name', 
                'commenter.username as session_user_post_commenter_username',
                'commenter.avatar_url as session_user_post_commenter_avatar_url',
                'comments.created_at as feed_item_timestamp',
                'user_posts.id as post_id',
                'user_posts.created_at as post_created_at',
                'user.username as username'
            ])
            .where('comments.parent_post_id', 'in', postIdList)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            commentsSessionuserPost = selectCommentsSessionUserPost

            /* count reactions to a post session user made */
            const countReactionsSessionUserPost = await trx
            .selectFrom('post_reactions')
            .select((eb) => eb.fn.count<number>('post_reactions.id').as('reactions_count'))
            .where('post_reactions.post_id', 'in', postIdList)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsSessionUserPostTotal = countReactionsSessionUserPost[0]['reactions_count']

            /* get data about those reactions */
            const selectReactionsSessionUserPost = await trx
            .selectFrom('post_reactions')
            .innerJoin('profiles as react_user', 'react_user.id', 'post_reactions.user_id')
            .innerJoin('posts as user_posts', 'user_posts.id', 'post_reactions.post_id')
            .innerJoin('profiles as user', 'user.id', 'user_posts.user_id')
            .select([
                'react_user.id as session_user_post_react_user_id', 
                'react_user.display_name as session_user_post_react_user_display_name', 
                'react_user.username as session_user_post_react_user_username',
                'react_user.avatar_url as session_user_post_react_user_avatar_url',
                'post_reactions.updated_at as feed_item_timestamp',
                'user_posts.id as post_id',
                'user_posts.created_at as post_created_at',
                'user.username as username'
            ])
            .where('post_reactions.post_id', 'in', postIdList)
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
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('created_at', timestampStart, timestampEnd))
            .execute()

            postsTotal = countFollowingUsersPosts[0]['posts_count']

            const selectFollowingPosts = await trx
            .selectFrom('posts as post')
            .innerJoin('profiles as profile', 'post.user_id', 'profile.id')
            .innerJoin(
                'post_reactions as reaction',
                (join) => join
                .onRef('reaction.post_id', '=', 'post.id')
                .on((eb) => eb('reaction.user_id', '=', sessionUserId))
            )
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
                'post.created_at as feed_item_timestamp',
                'post.embed_id as embed_id',
                'post.embed_source as embed_source',
                'post.embed_account as embed_account',
                'reaction.reaction as reaction',
                'reaction.active as active'
            ])
            .where('post.user_id', 'in', followingUserIds)
            .where('parent_post_id', 'is', null)
            .where((eb) => eb.between('post.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            posts = selectFollowingPosts
        }
        
        /* count and fetch recent comments from one followed user on another followed user's post */
        let sessionUserPostsCommentsTotal = 0
        let commentsTotal = 0
        let sessionUserPostsComments: App.RowData = []
        let comments: App.RowData = []

        if ( feedOptions.includes('comments') && followingUserIds.length > 0) {

            const countSessionUserPostComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .select((eb) => eb.fn.count<number>('comments.id').as('comments_count'))
            .where('comments.parent_post_id', 'is not', null)
            .where('original_post.user_id', '=', sessionUserId)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .execute()

            sessionUserPostsCommentsTotal = countSessionUserPostComments[0]['comments_count']

            const selectSessionUserPostComments = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .select([
                'comments.id as comment_id', 
                'comments.user_id as user_id', 
                'commenter.display_name as display_name', 
                'commenter.avatar_url as avatar_url', 
                'comments.text as comment_text', 'comments.parent_post_id', 
                'comments.created_at as feed_item_timestamp'
            ])
            .where('comments.parent_post_id', 'is not', null)
            .where('original_post.user_id', '=', sessionUserId)
            .where((eb) => eb.between('comments.created_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserPostsComments = selectSessionUserPostComments

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
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            .select([
                'comments.id as comment_id', 
                'comments.user_id as user_id', 
                'commenter.display_name as display_name', 
                'commenter.avatar_url as avatar_url', 
                'comments.text as comment_text', 'comments.parent_post_id', 
                'original_post.user_id as original_poster_user_id', 
                'original_poster.display_name as original_poster_display_name', 
                'original_poster.username as original_poster_username', 
                'comments.created_at as feed_item_timestamp'
            ])
            .where('comments.user_id', 'in', followingUserIds)
            .where('original_post.user_id', 'in', followingUserIds)
            .where('comments.parent_post_id', 'is not', null)
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
        let sessionUserPostsReactions: App.RowData = []
        let reactions: App.RowData = []

        if ( feedOptions.includes('reactions') && followingUserIds.length > 0) {

            const countSessionUserPostsReactions = await trx
            .selectFrom('post_reactions')
            .innerJoin('posts', 'posts.id', 'post_reactions.post_id')
            .select((eb) => eb.fn.count<number>('post_reactions.id').as('reactions_count'))
            .where('posts.user_id', '=', sessionUserId)
            .where('post_reactions.active', '=', true)
            .where((eb) => eb.between('post_reactions.updated_at', timestampStart, timestampEnd))
            .execute()

            sessionUserPostsReactionsTotal = countSessionUserPostsReactions[0]['reactions_count']

            const countFollowingReactions = await trx
            .selectFrom('post_reactions')
            .select((eb) => eb.fn.count<number>('id').as('reactions_count'))
            .where('user_id', 'in', followingUserIds)
            .where('active', '=', true)
            .where((eb) => eb.between('updated_at', timestampStart, timestampEnd))
            .execute()

            reactionsTotal = countFollowingReactions[0]['reactions_count']

            const selectSessionUserPostsReactions = await trx
            .selectFrom('post_reactions as reaction')
            .innerJoin('posts as original_post', 'original_post.id', 'reaction.post_id')
            .innerJoin('profiles as react_user', 'react_user.id', 'reaction.user_id')
            .select([
                'reaction.id as reaction_id', 
                'reaction.user_id as react_user_id', 
                'reaction.post_id as post_id', 
                'reaction.reaction as reaction', 
                'original_post.user_id as original_poster_user_id',
                'reaction.updated_at as feed_item_timestamp', 
                'react_user.display_name as display_name', 
                'react_user.avatar_url as avatar_url', 
            ])
            .where('reaction.active', '=', true)
            .where('original_post.parent_post_id', 'is', null)
            .where('original_post.user_id', '=', sessionUserId)
            .where((eb) => eb.between('reaction.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserPostsReactions = selectSessionUserPostsReactions

            const selectFollowingReactions = await trx
            .selectFrom('post_reactions as reaction')
            .innerJoin('posts as original_post', 'original_post.id', 'reaction.post_id')
            .innerJoin('profiles as react_user', 'react_user.id', 'reaction.user_id')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            .select([
                'reaction.id as reaction_id', 
                'reaction.user_id as react_user_id', 
                'reaction.post_id as post_id', 
                'reaction.reaction as reaction', 
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

            const countSessionUserCollectionsSocialTotal = await trx
            .selectFrom('collections_social')
            .innerJoin('collections_info as info', 'info.collection_id', 'collections_social.collection_id')
            .select((eb) => eb.fn.count<number>('id').as('collection_follows_count'))
            .where(({eb, and}) => and ([
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.owner_id', '=', sessionUserId)
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .execute()

            sessionUserCollectionsSocialTotal = countSessionUserCollectionsSocialTotal[0]['collection_follows_count']

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

            const selectSessionUserCollectionFollows = await trx
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
                eb('user_role', '=', 'follower'),
                eb('follows_now', '=', true),
                eb('info.owner_id', '=', sessionUserId)
            ]))
            .where((eb) => eb.between('collections_social.updated_at', timestampStart, timestampEnd))
            .limit(batchSize)
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            sessionUserCollectionFollows = selectSessionUserCollectionFollows

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
            .offset(offset)
            .orderBy('feed_item_timestamp', 'desc')
            .execute()

            collectionFollows = selectFollowingCollectionsSocial
        }

        /* count and fetch collection edits by followed users */
        let collectionEditsTotal = 0
        let collectionEdits: App.RowData = []

        if (feedOptions.includes('collectionEdits') && followingUserIds.length > 0) {
            

            const countFollowingCollectionsEdits = await trx
            .selectFrom('collections_updates')
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
            .offset(offset)
            .orderBy('feed_item_timestamp desc')
            .execute()

            collectionEdits = selectFollowingCollectionsEdits
        }

        const totalRowCount = Number(commentsSessionUserPostTotal) + Number(reactionsSessionUserPostTotal) + Number(postsTotal) + Number(sessionUserPostsCommentsTotal) + Number(commentsTotal) + Number(sessionUserPostsReactionsTotal) + Number(reactionsTotal) + Number(sessionUserCollectionsSocialTotal) + Number(collectionsSocialTotal) + Number(collectionEditsTotal)

        return { commentsSessionUserPostTotal, reactionsSessionUserPostTotal, commentsSessionuserPost, reactionsSessionUserPost, posts, sessionUserPostsComments, comments, sessionUserPostsReactions, reactions, sessionUserCollectionFollows, collectionFollows, collectionEdits, totalRowCount }
    })

    const data = await select

    let feedData: object[] = []
    feedData = feedData.concat(data.posts, data.comments, data.reactions, data.collectionFollows, data.collectionEdits)

    feedData.sort(( a: App.RowData, b: App.RowData ) => b.feed_item_timestamp - a.feed_item_timestamp)
    const { totalRowCount } = data
    batchIterator ++
    offset = batchSize * batchIterator
    const remainingCount = totalRowCount - offset
    return { feedData, totalRowCount, remainingCount }
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
                'post_reactions.updated_at as feed_item_timestamp',
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
import { sql } from 'kysely'
import { db } from 'src/database.ts'
import { parseISO } from 'date-fns'
import { dateToISODate } from '$lib/resources/parseData'

/* Insert a new post. 

postData template for new Now Playing posts:  
    {
        user_id: sessionUserId,
        type: "now_playing",
        status: "new",
        listen_url: listenUrl,
        item_type: mbidType,
        mbid: mbid,
        artist_name: artistName,
        release_group_name: albumName,
        recording_name: recordingName,
        episode_title: episode,
        show_title: show,
        text: postText,
        created_at: timestampISO,
        updated_at: timestampISO,
    }

postData template for new comments:  
    {
        user_id: sessionUserId,
        type: "reply",
        status: "new",
        text: replyText,
        created_at: timestampISO,
        updated_at: timestampISO,
    }
*/

export const insertPost = async function ( postData: any ) {

    const insertPost = await db
    .insertInto('posts')
    .values(postData)
    .returning('created_at')
    .executeTakeFirst()

    const post = await insertPost
    return post
}

/* Update post */

export const updatePost = async function ( sessionUserId: string, postData: App.RowData, editedText: string) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)
    
    const updatePost = await db.transaction().execute(async(trx) => {
        
        //validates that post belongs to session user and returns changelog
        const selectPostData = await trx
        .selectFrom('posts')
        .select(['user_id', 'changelog'])
        .where('id', '=', postData.id)
        .where('user_id', '=', sessionUserId)
        .executeTakeFirstOrThrow()

        const changelog = selectPostData?.changelog as App.Changelog
        changelog[timestampISOString] = {
            text: editedText,
            mbid: postData.mbid,
            artist_name: postData.artistName,
            release_group_name: postData.releaseGroupName,
            recording_name: postData.recordingName,
            status: "edited",
            listen_url: postData.listenUrl,
            episode_title: postData.episodeTitle,
            show_title: postData.showTitle,
        }

        //submit update
        const update = await trx
        .updateTable('posts')
        .set({
            text: editedText,
            mbid: postData.mbid,
            artist_name: postData.artistName,
            release_group_name: postData.releaseGroupName,
            recording_name: postData.recordingName,
            status: "edited",
            updated_at: timestampISO,
            listen_url: postData.listenUrl,
            episode_title: postData.episodeTitle,
            show_title: postData.showTitle,
            changelog: changelog,
        })
        .where('id','=', postData.id)
        .returning([
            'text', 
            'mbid', 
            'artist_name', 
            'release_group_name', 
            'recording_name', 
            'episode_title', 
            'show_title', 
            'listen_url'
        ])
        .executeTakeFirstOrThrow()

        const post = await update
        return post
    })
    return updatePost
}

/* Delete a post */

export const deletePost = async function ( sessionUserId: string, postId: string) {
    
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const deletePost = await db.transaction().execute(async(trx) => {
        
        //validates that post belongs to session user and returns post id
        const post = await trx
        .selectFrom('posts')
        .selectAll()
        .where('id', '=', postId)
        .where('user_id', '=', sessionUserId)
        .executeTakeFirstOrThrow()

        const changelog = post?.changelog as App.Changelog

        changelog[timestampISOString] = {
            text: post?.text,
            mbid: post?.mbid,
            item_type: post?.item_type,
            artist_name: post?.artist_name,
            release_group_name: post?.release_group_name,
            recording_name: post?.recording_name,
            status: 'deleted',
            listen_url: post?.listen_url,
            episode_title: post?.episode_title,
            show_title: post?.show_title,
        }

        const updatePost = await trx
        .updateTable('posts')
        .set({
            status: 'deleted',
            updated_at: timestampISO,
            changelog: changelog
        })
        .where('id','=', postId)
        .returning(['id', 'status'])
        .executeTakeFirst()

        const update = await updatePost
        return update
    })
    return deletePost
}

/* Select a post */

export const selectPost = async function ( sessionUserId: string, username: string, timestampString: string, postType: string ) {

    const select = await db.transaction().execute(async(trx) => {
        try {
            const selectPostUserId = await trx
            .selectFrom('profiles')
            .select('id')
            .where('username', '=', username)
            .executeTakeFirst()

            const postUserId = selectPostUserId?.id as string

            await trx
            .selectFrom('user_moderation_actions')
            .selectAll()
            .where(({eb}) => eb.and({
                user_id: postUserId,
                target_user_id: sessionUserId
            }))
            .executeTakeFirstOrThrow

            return { permission: false }
        }
        catch ( error ) {
            const post = await trx
            .selectFrom('posts')
            .innerJoin('profiles as profile', 'profile.id', 'posts.user_id')
            .innerJoin((eb) =>  eb
                .selectFrom('post_reactions')
                .select(['post_id', (eb) => eb.fn.count<number>('id').as('reaction_count')])
                .whereRef('post_id', '=', 'posts.id')
                .as('reactions'),
                (join) => join
                .onRef('reactions.post_id', '=', 'posts.id')
            )
            .select([
                'posts.id as id', 
                'posts.text as text', 
                'posts.user_id as user_id', 
                'posts.type as type', 
                'posts.mbid as mbid', 
                'posts.artist_name as artist_name', 
                'posts.release_group_name as release_group_name', 
                'posts.recording_name as recording_name', 
                'posts.episode_title as episode_title', 
                'posts.show_title as show_title', 
                'posts.item_type as item_type', 
                'posts.status as status', 
                'posts.created_at as created_at', 
                'posts.updated_at as updated_at', 
                'posts.listen_url as listen_url', 
                'profile.username as username', 
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url', 
                'reactions.reaction_count as reaction_count'
            ])
            .where(({ eb }) => eb.and({
                user_id: eb.selectFrom('profiles')
                    .select('id')
                    .where('username', '=', username)
                    .limit(1),
                type: postType,
                created_at: dateToISODate(timestampString),
            }))
            .executeTakeFirst()

            return { post, permission: true}
        }
    })

    const post = await select
    return post
}

/* Select all replies to a post from users that don't block sesssion user */

export const selectPostReplies = async function ( sessionUserId: string, postId: string ) {

    const getReplies = await db
    .selectFrom('posts as comments')
    .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
    .innerJoin('posts as parent_post', 'parent_post.id', 'parent_post_id')
    .innerJoin((eb) => eb
        .selectFrom('profiles as original_poster')
        .select(['id', 'username'])
        .where('id', '=', 'parent_post.user_id')
        .as('original_poster'),
        (join) => join
        .onRef('parent_post.user_id', '=', 'original_poster.id')
    )
    .innerJoin((eb) =>  eb
        .selectFrom('post_reactions')
        .select(['post_id', (eb) => eb.fn.count<number>('id').as('reaction_count')])
        .whereRef('post_id', '=', 'comments.id')
        .as('reactions'),
        (join) => join
        .onRef('reactions.post_id', '=', 'comments.id')
    )
    .select([
        'comments.id as id', 
        'comments.text as text', 
        'comments.user_id as user_id', 
        'comments.status as status', 
        'comments.created_at as created_at', 
        'comments.parent_post_id as parent_post_id', 
        'commenter.username as username', 
        'commenter.display_name as display_name', 
        'commenter.avatar_url as avatar_url', 
        'parent_post.created_at as parent_post_date', 
        'parent_post.user_id as parent_post_user_id', 
        'original_poster.username as parent_post_username', 
        'reactions.reaction_count as reaction_count'
    ])
    .where(({eb, and, not, exists, selectFrom}) => and([
        eb( 'parent_post_id', '=', postId ),
        eb( 'status', '!=', 'deleted' ),
        not(
            exists(
                selectFrom('user_moderation_actions')
                .select('id')
                .whereRef('user_moderation_actions.user_id', '=', 'parent_post.user_id')
                .where('user_moderation_actions.target_user_id', '=', sessionUserId)
            )
        )
    ]))
    .orderBy('comments.id asc')
    .execute()

    const replies = await getReplies
    return replies
}

/* Select post and replies session user has permission to see */

export const selectPostAndReplies = async function( sessionUserId: string, username: string, timestampString: string, postType: string ) {

    const select = await db.transaction().execute(async(trx) => {
        console.log(username)
        try {
            const selectPostUserId = await trx
            .selectFrom('profiles')
            .select('id')
            .where('username', '=', username)
            .executeTakeFirst()

            const postUserId = selectPostUserId?.id as string

            await trx
            .selectFrom('user_moderation_actions')
            .select(['id'])
            .where(({eb}) => eb.and({
                user_id: postUserId,
                target_user_id: sessionUserId,
                type: 'block',
                active: true
            }))
            .executeTakeFirstOrThrow()


            return { post: null, replies: null, permission: false, postReactionActive: null, reactionCount: null }
        }
        catch ( error ) {
            const post = await trx
            .selectFrom('posts')
            .innerJoin('profiles as profile', 'profile.id', 'posts.user_id')
            .select([
                'posts.id as id', 
                'posts.text as text', 
                'posts.user_id as user_id', 
                'posts.type as type', 
                'posts.mbid as mbid', 
                'posts.artist_name as artist_name', 
                'posts.release_group_name as release_group_name', 
                'posts.recording_name as recording_name', 
                'posts.episode_title as episode_title', 
                'posts.show_title as show_title', 
                'posts.item_type as item_type', 
                'posts.status as status', 
                'posts.created_at as created_at', 
                'posts.updated_at as updated_at', 
                'posts.listen_url as listen_url', 
                'profile.username as username', 
                'profile.display_name as display_name', 
                'profile.avatar_url as avatar_url', 
            ])
            .where(({ eb, and }) => and([
                eb('posts.user_id', '=', eb
                    .selectFrom('profiles')
                    .select('id')
                    .where('username', '=', username)
                    .limit(1),
                ),
                eb('posts.type', '=', postType),
                eb('posts.created_at', '=', parseISO(timestampString))
            ]))
            .executeTakeFirst()

            const postId = post?.id as string

            const postReactionActive = await trx
            .selectFrom('post_reactions')
            .select('active')
            .where('post_id', '=', postId)
            .where('user_id', '=', sessionUserId)
            .executeTakeFirst()

            const postReactionsCount = await trx
                .selectFrom('post_reactions')
                .select((eb) => eb.fn.count<number>('id').as('reaction_count'))
                .where(({ eb }) => eb.and({
                    post_id: postId,
                    active: true
                }))
                .execute()

            const replies = await trx
            .selectFrom('posts as comments')
            .innerJoin('profiles as commenter', 'commenter.id', 'comments.user_id')
            .innerJoin('posts as original_post', 'comments.parent_post_id', 'original_post.id')
            .innerJoin('profiles as original_poster', 'original_post.user_id', 'original_poster.id')
            // .innerJoin(
            //     (eb) => eb
            //         .selectFrom('post_reactions')
            //         .select(['post_id', (eb) => eb.fn.count<number>('id').as('reaction_count')])
            //         .groupBy('post_reactions.post_id')
            //         .as('reactions'),
            //     (join) => join
            //         .onRef('reactions.post_id', '=', 'comments.id')
            // )
            .select([
                'comments.id as id', 
                'comments.text as text', 
                'comments.user_id as user_id', 
                'comments.status as status', 
                'comments.created_at as created_at', 
                'comments.parent_post_id as parent_post_id', 
                'commenter.username as username', 
                'commenter.display_name as display_name', 
                'commenter.avatar_url as avatar_url', 
                'original_post.created_at as original_post_date', 
                'original_post.user_id as original_poster_user_id', 
                'original_poster.username as original_poster_username', 
                // 'reactions.reaction_count as reaction_count'
            ])
            .where(({eb, and, not, exists, selectFrom}) => and([
                eb( 'comments.parent_post_id', '=', postId ),
                eb( 'comments.status', '!=', 'deleted' ),
                not(
                    exists(
                        selectFrom('user_moderation_actions')
                        .select('id')
                        .whereRef('user_moderation_actions.user_id', '=', 'comments.user_id')
                        .where('user_moderation_actions.target_user_id', '=', sessionUserId)
                    )
                )
            ]))
            .orderBy('id', 'asc')
            .execute()

            const reactionCount = postReactionsCount[0].reaction_count

            return { post, postReactionActive, reactionCount, replies, permission: true}
        }
    })

    const post = await select
    return post
}

/* Select random posts without user data */

export const selectRandomPosts = async function ( postCount: number ) {

    const selectPosts = await db
    .selectFrom('posts')
    .select(['text', 'artist_name', 'release_group_name', 'recording_name', 'item_type', 'created_at'])
    .where('status', '!=', 'deleted')
    .where('parent_post_id', 'is', null)
    .orderBy(sql`random()`)
    .limit(postCount)
    .execute()

    return selectPosts
}

/* Select a user's posts */

export const selectUserPosts = async function ( sessionUserId: string, username: string ) {
    const selectPosts = await db.transaction().execute(async(trx) => {

        const userProfile = await trx
        .selectFrom('profiles')
        .select('id')
        .where('username', '=', username)
        .executeTakeFirst()

        const profileUserId = userProfile?.id as string

        try {
            const blockInfo = await trx
            .selectFrom('user_moderation_actions')
            .select(['id', 'type', 'active'])
            .where(({eb, and}) => and([
                eb('user_id', '=', profileUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('type', '=', 'block'),
                eb('active', '=', true)
            ]))
            .executeTakeFirstOrThrow()

            if ( blockInfo ) {
                return { permission: false, posts: null }
            }
        }
        catch ( error ) {
            const selectPosts = await trx
            .selectFrom('posts')
            .innerJoin('profiles', 'profiles.id', 'posts.user_id')
            .select([
                'posts.id as id',
                'posts.text as text',
                'posts.mbid as mbid',
                'posts.artist_name as artist_name',
                'posts.release_group_name as release_group_name',
                'posts.recording_name as recording_name',
                'posts.created_at as created_at',
                'posts.updated_at as updated_at',
                'posts.episode_title as episode_title',
                'posts.show_title as show_title',
                'posts.listen_url as listen_url',
                'profiles.id as user_id',
                'profiles.username as username',
                'profiles.display_name as display_name',
                'profiles.avatar_url as avatar_url'
            ])
            .where('profiles.id', '=', profileUserId)
            .orderBy('posts.created_at desc')
            .execute()

            const posts = selectPosts
            return { permission: true, posts }
        }
    })
    const posts = await selectPosts
    return posts
}

/* Select a user's posts sample */

export const selectUserPostsSample = async function ( sessionUserId: string, username: string, batchSize: number ) {
    const selectPosts = await db.transaction().execute(async(trx) => {

        const userProfile = await trx
        .selectFrom('profiles')
        .select('id')
        .where('username', '=', username)
        .executeTakeFirst()

        const profileUserId = userProfile?.id as string

        try {
            const blockInfo = await trx
            .selectFrom('user_moderation_actions')
            .select(['id', 'type', 'active'])
            .where(({eb, and}) => and([
                eb('user_id', '=', profileUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('type', '=', 'block'),
                eb('active', '=', true)
            ]))
            .executeTakeFirstOrThrow()

            if ( blockInfo ) {
                return { posts: null }
            }
        }
        catch ( error ) {
            const selectPosts = await trx
            .selectFrom('posts')
            .innerJoin('profiles', 'profiles.id', 'posts.user_id')
            .select([
                'posts.id as id',
                'posts.text as text',
                'posts.mbid as mbid',
                'posts.artist_name as artist_name',
                'posts.release_group_name as release_group_name',
                'posts.recording_name as recording_name',
                'posts.created_at as created_at',
                'posts.updated_at as updated_at',
                'posts.episode_title as episode_title',
                'posts.show_title as show_title',
                'posts.listen_url as listen_url',
                'profiles.id as user_id',
                'profiles.username as username',
                'profiles.display_name as display_name',
                'profiles.avatar_url as avatar_url'
            ])
            .where('profiles.id', '=', profileUserId)
            .orderBy('posts.created_at desc')
            .limit(batchSize)
            .execute()

            const posts = selectPosts
            return { posts }
        }
    })
    const posts = await selectPosts
    return posts
}

/* Inserts a reaction to a post, or updates reaction row if sesssion user has already submitted that reaction */

export const insertUpdateReaction = async function ( sessionUserId: string, postId: string, reactionType: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const insertUpdateReaction = await db.transaction().execute(async (trx) => {
        try {
            const selectReaction = await trx
            .selectFrom('post_reactions')
            .select(['id', 'active', 'changelog'])
            .where(({eb}) => eb.and({
                post_id: postId,
                user_id: sessionUserId,
                reaction: reactionType
            }))
            .executeTakeFirstOrThrow()

            const changelog = selectReaction?.changelog as App.Changelog
            const active = selectReaction?.active as boolean
            changelog[timestampISOString] = {
                active: !active
            }

            return await trx
            .updateTable('post_reactions')
            .set({
                active: !active,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', postId)
            .returning(['id', 'reaction', 'active'])
            .executeTakeFirst()
        }
        catch (error) {
            const changelog: App.Changelog = {}
            changelog[timestampISOString] = {
                active: true
            }
        
            return await trx
            .insertInto('post_reactions')
            .values({
                post_id: postId,
                user_id: sessionUserId,
                reaction: reactionType,
                updated_at: timestampISO,
                active: true,
                changelog: changelog
            })
            .returning(['id', 'reaction', 'active'])
            .executeTakeFirst()
        }
    })

    const reaction =  await insertUpdateReaction
    return reaction 
}

/* Get reaction count session user's reaction data for a post */

export const getReactionData = async function ( post_id: string, user_id: string ) {

    const getReactionData = await db
    .with('permissioned_collection', (db) => db
        .selectFrom('post_reactions')
        .selectAll()
        .where('post_id', '=', post_id)
        .where('active', '=', true)
    )
    .selectFrom('post_reactions as reactions')
    .select(({fn, eb}) => [
        fn.count<number>('reactions.id').as('reactions_count'),
        eb.selectFrom('reactions')
        .selectAll()
        .where('user_id', '=', user_id)
        .as('user_reaction')
    ])
    .execute()

    const reactionCount = await getReactionData
    return reactionCount
}
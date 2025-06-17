import { sql } from 'kysely'
import { db } from 'src/database.ts'
import { parseISO } from 'date-fns'
import { dateToISODate, prepareMusicMetadataInsert } from '$lib/resources/parseData'

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

    let artistsMetadata = []
    let releaseGroupsMetadata = []
    let recordingsMetadata = []

    const itemType = postData["item_type"]

    let metadata = [] as any
    if ( 
        ( itemType == "artist" && postData["artist_mbid"] ) ||
        ( itemType == "release_group" && postData["release_group_mbid"] ) ||
        ( itemType == "recording" && postData["recording_mbid"] ) 
    ) {
        metadata = [{
            "artist_mbid": postData["artist_mbid"],
            "artist_name": postData["artist_name"],
            "release_group_mbid": postData["release_group_mbid"],
            "release_group_name": postData["release_group_name"],
            "release_date": postData["release_date"],
            "label": postData["label_name"],
            "img_url": postData["img_url"],
            "last_fm_img_url": postData["last_fm_img_url"],
            "recording_mbid": postData["recording_mbid"],
            "recording_name": postData["recording_name"],
            "remixer_artist_mbid": postData["remixer_artist_mbid"],
            "item_type": postData["item_type"],
            "added_by": postData["user_id"]
        }] as App.RowData[]

        const preparedMetadata = await prepareMusicMetadataInsert(metadata)

        artistsMetadata = preparedMetadata.artistsMetadata
        releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata
        recordingsMetadata = preparedMetadata.recordingsMetadata
    }
    else {
        metadata = [{
            "artist_name": postData["artist_name"],
            "artist_mbid": postData["artist_mbid"],
            "release_group_name": postData["release_group_name"],
            "release_group_mbid": postData["release_group_mbid"],
            "recording_name": postData["recording_name"],
            "episode_title": postData["episode_title"],
            "show_title": postData["show_title"],
            "listen_url": postData["listen_url"],
            "added_by": postData["user_id"],
            "embed_source": postData["embed_source"],
            "embed_account": postData["embed_account"],
            "embed_id": postData["embed_id"],
            "img_url": postData["img_url"],
            "release_date": postData["release_date"],
            "tracklist": postData["tracklist"]

        }]
    }

    delete postData.label
    delete postData.release_date
    delete postData.remixer_artist_mbid
    delete postData.img_url
    delete postData.last_fm_img_url
    delete postData.tracklist

    const post = await db.transaction().execute(async(trx) => {
        if ( postData["artist_mbid"] ) {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }
        
        if ( postData["release_group_mbid"] ) {
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
        }

        if ( postData["recording_mbid"] ) {
            await trx
                .insertInto('recordings')
                .values(recordingsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .execute()
        }

        let userAdddedMetadataRow = {} as App.RowData
        if ( !postData["artist_mbid"] && postData["artist_name"] ) {
            userAdddedMetadataRow = await trx
                .insertInto('user_added_metadata')
                .values(metadata)
                .returning('id')
                .executeTakeFirst() as App.RowData
            
            postData["user_added_metadata_id"] = userAdddedMetadataRow.id
        }

        const insertPost = await trx
        .insertInto('posts')
        .values(postData)
        .returning('created_at')
        .executeTakeFirst()

        const selectProfile = await trx
        .selectFrom('profiles')
        .select('username')
        .where('id', '=', postData.user_id)
        .executeTakeFirst()

        return { insertPost, selectProfile }
    })

    const { insertPost, selectProfile } = await post
    const createdAt = insertPost?.created_at as Date
    const username = selectProfile?.username as string
    return { createdAt, username }
}

/* Update post */

export const updatePost = async function ( sessionUserId: string, postData: App.RowData, editedText: string) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)
    const postId = postData.id ?? postData.post_id

    const updatePost = await db.transaction().execute(async(trx) => {
        
        //validates that post belongs to session user and returns changelog
        const selectPostData = await trx
        .selectFrom('posts')
        .select(['user_id', 'changelog'])
        .where('id', '=', postId)
        .where('user_id', '=', sessionUserId)
        .executeTakeFirstOrThrow()

        const changelog = selectPostData?.changelog as App.Changelog
        if ( postData.item_type == 'comment' ) {
            changelog[timestampISOString] = {
                text: editedText,
                status: "edited",
            }
        }
        else {
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
        }


        //submit update
        const update = await trx
        .updateTable('posts')
        .set({
            text: editedText,
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
        .where('id','=', postId)
        .returning([
            'text', 
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
        .returning(['id', 'status', 'parent_post_id'])
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
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profile.avatar_mbid')
            .innerJoin((eb) =>  eb
                .selectFrom('reactions')
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
                'posts.artist_mbid as artist_mbid',
                'posts.release_group_mbid as release_group_mbid',
                'posts.recording_mbid as recording_mbid',
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
                'posts.item_type as item_type',
                'posts.user_added_metadata_id as user_added_metadata_id',
                'profile.username as username', 
                'profile.display_name as display_name', 
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
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

/* Select post and replies session user has permission to see */

export const selectPostAndReplies = async function( sessionUserId: string, username: string, timestampString: string ) {
    const select = await db.transaction().execute(async(trx) => {
        try {
            await trx
            .selectFrom('blocks')
            .innerJoin('profiles as post_user', 'post_user.id', 'blocks.user_id')
            .selectAll()
            .where(({eb, and}) => and([
                eb('blocks.username', '=', username),
                eb('blocks.target_user_id', '=', sessionUserId)
            ]))
            .executeTakeFirstOrThrow()

            return { permission: false, post: null, replies: null }
        }
        catch {
            const blocks = await trx
            .selectFrom('blocks')
            .select(sql<string[]>`array_agg(DISTINCT user_id)`.as('blocking_users'))
            .where('target_user_id', '=', sessionUserId)
            .execute()

            const blockingUsers = blocks[0]['blocking_users'] ?? [] as string[]

            const selectPost = await trx
            .selectFrom('posts_and_engagement as post')
            .select([
                'id',
                'user_id',
                'username',
                'display_name',
                'avatar_url',
                'last_fm_avatar_url',
                'avatar_release_group_name',
                'avatar_artist_name',
                'created_at',
                'updated_at',
                'text',
                'status',
                'reaction_count',
                'reaction_user_ids',
                'artist_mbid',
                'artist_name',
                'user_added_artist_name',
                'release_group_mbid',
                'release_group_name',
                'user_added_release_group_name',
                'recording_mbid',
                'recording_name',
                'user_added_recording_name',
                'episode_title',
                'show_title',
                'user_added_metadata_id',
                'embed_id',
                'embed_source',
                'item_type',
                'type',
                'replies'
            ])
            .where(({eb, and}) => and([
                eb('post.username', '=', username),
                eb('post.created_at', '=', parseISO(timestampString)),
            ]))
            .executeTakeFirst()

            const post = selectPost
            const postId = post?.id as string
            const postReplies = post?.replies as string[]
            
            if ( postReplies?.length > 0  && blockingUsers.length > 0 ) {
                const selectReplies = await trx
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
                    'reply_to',
                    'reply_to_user_id',
                    'reply_to_username',
                    'reply_to_display_name',
                    'reply_to_created_at'
                ])
                .where('parent_post_id', '=', postId)
                .where('user_id', 'not in', blockingUsers)
                .orderBy('created_at asc')
                .execute()

                const replies = selectReplies

                return { permission: true, post, replies}
            }
            else if ( postReplies?.length > 0 && blockingUsers.length == 0 ) {
                const selectReplies = await trx
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
                    'reply_to',
                    'reply_to_user_id',
                    'reply_to_username',
                    'reply_to_display_name',
                    'reply_to_created_at'
                ])
                .where('parent_post_id', '=', postId)
                .orderBy('created_at asc')
                .execute()

                const replies = selectReplies
                return { permission: true, post, replies}
            }
            else {
                return { permission: true, post, replies: null}
            }
            
        }
    })
    const { permission, post, replies } = await select
    return { permission, post, replies }
}

/* Select random posts without user data */

export const selectRandomPosts = async function ( postCount: number ) {

    const selectPosts = await db.transaction().execute(async(trx) => {
        const posts = await trx
        .selectFrom('posts')
        .select([
            'text', 
            'artist_name', 
            'release_group_name', 
            'recording_name', 
            'episode_title',
            'embed_id',
            'embed_source',
            'show_title',
            'item_type', 
            'created_at'
        ])
        .where('status', '!=', 'deleted')
        .where('parent_post_id', 'is', null) 
        .orderBy(sql`random()`)
        .limit(postCount)
        .execute()

        const randomAvatarImages = await trx
        .selectFrom('release_groups')
        .innerJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
        .select([
            'release_groups.img_url as avatar_url', 
            'release_groups.last_fm_img_url as avatar_last_fm_img_url', 
            'release_groups.release_group_mbid as release_group_mbid', 
            'release_groups.release_group_name as avatar_release_group_name',
            'artists.artist_name as avatar_artist_name'
        ])
        .orderBy(sql`random()`)
        .limit(postCount)
        .execute()

        return { posts, randomAvatarImages }
    })

    const { posts, randomAvatarImages } = await selectPosts

    for ( const post of posts ) {
        const index = posts.indexOf(post)
        const image = {
            'avatar_img_url': randomAvatarImages[index]['avatar_url'],
            'avatar_last_fm_img_url': randomAvatarImages[index]['avatar_last_fm_img_url'],
            'avatar_artist_name': randomAvatarImages[index]['avatar_artist_name'],
            'avatar_release_group_name': randomAvatarImages[index]['avatar_release_group_name'],
        }
        Object.assign(post, image)
    }

    return posts
}

/* Select a user's Now Playing posts */

export const selectUserNowPlayingPosts = async function ( sessionUserId: string, username: string ) {
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
                return { permission: false, posts: null, comments: null }
            }
        }
        catch ( error ) {
            const selectPosts = await trx
            .selectFrom('posts')
            .innerJoin('profiles', 'profiles.id', 'posts.user_id')
            .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
            .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
            .leftJoin('reactions',
                (join) => join
                .onRef('reaction.post_id', '=', 'posts.id')
                .on('reaction.active', '=', true)
                .on('reaction.user_id', '=', sessionUserId)
            )
            .select([
                'posts.id as id',
                'posts.text as text',
                'posts.created_at as created_at',
                'posts.updated_at as updated_at',
                'posts.type as type',
                'posts.status as status',
                'posts.artist_name as artist_name',
                'posts.artist_mbid',
                'posts.release_group_mbid',
                'posts.recording_mbid',
                'posts.release_group_name as release_group_name',
                'posts.recording_name as recording_name',
                'posts.episode_title as episode_title',
                'posts.show_title as show_title',
                'posts.listen_url as listen_url',
                'posts.embed_id as embed_id',
                'posts.embed_source as embed_source',
                'posts.embed_account as embed_account',
                'posts.item_type as item_type',
                'posts.user_added_metadata_id as user_added_metadata_id',
                'profiles.id as user_id',
                'profiles.username as username',
                'profiles.display_name as display_name',
                'release_groups.img_url as avatar_url',
                'release_groups.last_fm_img_url as avatar_last_fm_img_url',
                'release_groups.release_group_name as avatar_release_group_name',
                'artists.artist_name as avatar_artist_name',
                'reaction.active as reaction_active'
            ])
            .where('profiles.id', '=', profileUserId)
            .where('posts.parent_post_id', 'is', null)
            .where('posts.status', '!=', 'deleted')
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

export const selectUserPostsSample = async function ( sessionUserId: string, username: string, batchSize: number, batchIterator: number ) {

    const offset = batchSize * batchIterator

    const selectPosts = await db.transaction().execute(async(trx) => {
        try {
            await trx
            .selectFrom('blocks')
            .selectAll()
            .where(({eb, and}) => and([
                eb('target_user_id', '=', sessionUserId),
                eb('username', '=', username)
            ]))
            .executeTakeFirstOrThrow()

            return { permission: false, feedData: [], totalRowCount: 0 }
        }
        catch {
            const selectItems = await trx
            .selectFrom('feed_items')
            .selectAll()
            .where('username', '=', username)
            .where('item_type', '=', 'now_playing_post')
            .limit(batchSize)
            .orderBy('timestamp desc')
            .offset(offset)
            .execute()

            const totalItems = await trx
            .selectFrom('feed_items')
            .select((eb) => eb.fn.count('timestamp').as('feed_rows_count'))
            .where('username', '=', username)
            .where('item_type', '=', 'now_playing_post')
            .execute()

            const rowCount = totalItems[0].feed_rows_count as number

            return { permission: true, feedData: selectItems, totalRowCount: rowCount }
        }
    })

    const { permission, feedData, totalRowCount } = selectPosts
    return { permission, feedData, totalRowCount }
}

/* Inserts a reaction to a post, or updates reaction row if sesssion user has already submitted that reaction */

export const insertUpdateReaction = async function ( sessionUserId: string, postId: string, reactionType: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const insertUpdateReaction = await db.transaction().execute(async (trx) => {
        try {
            const selectReaction = await trx
            .selectFrom('reactions')
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

            const { id } = selectReaction

            const updateReaction = await trx
            .updateTable('reactions')
            .set({
                active: !active,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', id)
            .returning(['id', 'reaction', 'active', 'post_id'])
            .executeTakeFirst()

            const reaction = updateReaction as App.RowData

            return { reaction }
        }
        catch (error) {
            const changelog: App.Changelog = {}
            changelog[timestampISOString] = {
                active: true
            }
        
            const insertReaction = await trx
            .insertInto('reactions')
            .values({
                id: sql`default`,
                post_id: postId,
                user_id: sessionUserId,
                reaction: reactionType,
                updated_at: timestampISO,
                active: true,
                changelog: changelog
            })
            .returning(['id', 'reaction', 'active', 'post_id'])
            .executeTakeFirst()

            const reaction = insertReaction as App.RowData

            return { reaction }
        }
    })


    const reaction =  await insertUpdateReaction
    return reaction 
}

/* Get reaction count session user's reaction data for a post */

export const getReactionData = async function ( post_id: string, user_id: string ) {

    const getReactionData = await db
    .with('permissioned_collection', (db) => db
        .selectFrom('reactions')
        .selectAll()
        .where('post_id', '=', post_id)
        .where('active', '=', true)
    )
    .selectFrom('reactions')
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
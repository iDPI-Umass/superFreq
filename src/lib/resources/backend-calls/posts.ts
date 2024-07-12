import { db } from 'src/database.ts'
import type { Posts, Expression, Changelog } from './$types'
import { dateToISODate, timestampISO } from '$lib/resources/parseData'

import { expressionBuilder } from 'kysely'
import type { JsonObject } from 'kysely-codegen'

/* Insert a new post */

export const insertPost = async function ( postData: Posts) {
    
    const insertPost = await db
    .insertInto('posts')
    .values(postData)
    .returning('created_at')
    .executeTakeFirst()

    const post = await insertPost
    return post
}

/* Update post */

export const updatePost = async function ( postData: Posts, editedText: string) {

    const changelog: App.Changelog = postData.changelog as App.Changelog
    const updatedAt: Date = postData.updated_at as Date
    const updatedAtString: string = updatedAt.toString()
    changelog[updatedAtString] = {
        text: postData.text,
        mbid: postData.mbid,
        mbid_type: postData.mbidType,
        artist_name: postData.artistName,
        release_group_name: postData.releaseGroupName,
        status: postData.status,
        recording_name: postData.recordingName,
        listen_url: postData.listenUrl,
        episode_title: postData.episodeTitle,
        show_title: postData.showTitle,
    }
    
    const updatePost = await db
    .updateTable('posts')
    .set({
        text: editedText,
        mbid: postData.mbid,
        mbid_type: postData.mbidType,
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
    .returningAll()
    .executeTakeFirst()

    const post = await updatePost
    return post
}

/* Delete a post */

export const deletePost = async function ( postData: Posts) {
    
    const changelog: App.Changelog = postData.changelog as App.Changelog
    const updatedAt: Date = postData.updated_at as Date
    const updatedAtString: string = updatedAt.toString()
    changelog[updatedAtString] = {
        text: postData.text,
        mbid: postData.mbid,
        mbid_type: postData.mbidType,
        artist_name: postData.artistName,
        release_group_name: postData.releaseGroupName,
        recording_name: postData.recordingName,
        status: postData.status,
        listen_url: postData.listenUrl,
        episode_title: postData.episodeTitle,
        show_title: postData.showTitle,
    }

    const deletePost = await db
    .updateTable('posts')
    .set({
        status: "deleted",
        updated_at: timestampISO,
    })
    .where('id','=', postData.id)
    .returning(['id', 'status'])
    .executeTakeFirst()

    const post = await deletePost
    return post
}

/* Get a post */

export const selectPost = async function ( { username, timestampString, postType }: { username: string, timestampString: string, postType: string} ) {

    const getPost = await db
    .selectFrom('posts')
    .selectAll()
    .where(({ eb }) => eb.and({
        user_id: eb.selectFrom('profiles')
            .select('id')
            .where('username', '=', username)
            .limit(1),
        type: postType,
        created_at: dateToISODate(timestampString),
    }))
    .innerJoin(
        eb => eb
            .selectFrom('profiles')
            .select(['id as userId', 'display_name', 'avatar_url'])
            .where('username', '=', username)
            .as('userData'),
        (join) => join
        .onRef('userData.userId', '=', 'posts.user_id')
    )
    .execute()

    const post = await getPost
    return post[0]
}

/* Get replies to a post */

export const selectPostReplies = async function ( postId: string ) {

    const getReplies = await db
    .selectFrom('posts')
    .selectAll()
    .where( 'parent_post_id', '=', postId )
    .where('status', '!=', 'deleted')
    .orderBy('id', 'asc')
    .execute()

    const replies = await getReplies
    return replies
}

/* Insert reaction to a post */

export const insertReaction = async function ( reactionData: App.PostData ) {

    const postId = reactionData.postId as string
    const userId = reactionData.userId as string
    const reaction = reactionData.reaction as string

    const insertReaction = await db
    .insertInto('post_reactions')
    .values({
        post_id: postId,
        user_id: userId,
        reaction: reaction,
        updated_at: timestampISO,
    })
    .returning(['id', 'reaction', 'active'])
    .executeTakeFirst()

    const inserted = await insertReaction
    return inserted
}

/* Update reaction to a post */

export const updateReaction = async function ( reactionData: App.PostData ) {

    const postId = reactionData.postId as string
    const userId = reactionData.userId as string
    const reaction = reactionData.reaction as string
    const active = reactionData.active as boolean
    
    const changelog: App.Changelog = reactionData.changelog as App.Changelog
    const updatedAt: Date = reactionData.updated_at as Date
    const updatedAtString: string = updatedAt.toString()
    changelog[updatedAtString] = {
        post_id: reactionData.postId,
        user_id: reactionData.userId,
        reaction: reactionData.reaction,
        active: reactionData.active,
    }

    const updateReaction = await db
    .insertInto('post_reactions')
    .values({
        post_id: postId,
        user_id: userId,
        reaction: reaction,
        active: !active,
        updated_at: timestampISO,
        changelog: changelog,
    })
    .returning(['reaction', 'active'])
    .executeTakeFirst()

    const updated = await updateReaction
    return updated
}

/* Get reaction count session user's reaction data for a post */

export const getReactionData = async function ( post_id: string, user_id: string ) {

    const getReactionData = await db
    .with('reactions', (db) => db
        .selectFrom('post_reactions')
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
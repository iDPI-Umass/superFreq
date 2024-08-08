import { db } from 'src/database.ts'
import { timestampISO, timestampISOString } from '$lib/resources/parseData'

/* Select profile info for session user's account */

export const selectSessionProfile = async function ( sessionUserId: string ) {
    const selectProfile = await db
    .selectFrom('profiles')
    .selectAll()
    .where('id', '=', sessionUserId)
    .executeTakeFirst()

    const profile = await selectProfile
    return profile
}

/* Update profile for session user's account */

export const updateSessionProfile = async function ( sessionUserId: string, profileData: App.RowData ) {
    const update = await db.transaction().execute(async (trx) => {
        const selectChangelog = await trx
        .selectFrom('profiles')
        .select('changelog')
        .where('id', '=', sessionUserId)
        .executeTakeFirst()

        const changelog = selectChangelog as App.Changelog

        changelog[timestampISOString] = {
            display_name: profileData?.displayName,
            username: profileData?.username,
            website: profileData?.website,
            avatar_mbid: profileData?.avatarMbid,
            avatar_url: profileData?.avatarUrl,
            updated_at: timestampISO,
            about: profileData?.about,
        }

        const updateProfile = await trx
        .updateTable('profiles')
        .set({
            display_name: profileData?.displayName,
            username: profileData?.username,
            website: profileData?.website,
            avatar_mbid: profileData?.avatarMbid,
            avatar_url: profileData?.avatarUrl,
            updated_at: timestampISO,
            about: profileData?.about,
            changelog: changelog
        })
        .where('id', '=', sessionUserId)
        .returning(['id', 'updated_at'])
        .executeTakeFirst()

        return updateProfile
    })

    return update
}

/* Block a user */

export const insertUpdateBlock = async function ( blockInfo: App.RowData, profileUserId: string, sessionUserId: string ) {

    if ( blockInfo == null ) {
        const changelog: App.Changelog = {}

        changelog[timestampISOString] = {
            'user_id': sessionUserId,
            'target_user_id': profileUserId,
            'type': 'block',
            'active': true
        }

        const insertBlock = await db
        .insertInto('user_moderation_actions')
        .values({
            user_id: sessionUserId,
            target_user_id: profileUserId,
            type: 'block',
            updated_at: timestampISO,
            active: true,
            changelog: changelog
        })
        .executeTakeFirst()

        const block = await insertBlock
        return block
    }
    else {
        const blockId = blockInfo?.id
        const blockUpdate = !blockInfo?.active

        const updateBlock = await db.transaction().execute(async (trx) => {
            const selectChangelog = await trx
            .selectFrom('user_moderation_actions')
            .select('changelog')
            .where('id', '=', blockId)
            .executeTakeFirst()
 
            const { changelog } = selectChangelog as App.Changelog
            
            changelog[timestampISOString] = {
                'user_id': sessionUserId,
                'target_user_id': profileUserId,
                'type': 'block',
                'active': blockUpdate
            }

            return await trx
            .updateTable('user_moderation_actions')
            .set({ 
                active: blockUpdate,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', blockId)
            .executeTakeFirst()
        })

        const block =  await updateBlock
        return block
    }
} 

/* Flag a post */

export const insertPostFlag = async function ( sessionUserId: string, postId: string ) {

    const changelog: App.Changelog = {}
    changelog[timestampISOString] = {
        'user_id': sessionUserId,
        'target_post_id': postId,
        'type': 'flag',
        'active': true
    }

    const insertFlag = await db
        .insertInto('user_moderation_actions')
        .values({
            user_id: sessionUserId,
            target_post_id: postId,
            type: 'flag',
            updated_at: timestampISO,
            active: true,
            changelog: changelog
        })
        .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 

/* Flag a user */

export const insertUserFlag = async function ( sessionUserId: string, profileUserId: string ) {

    const changelog: App.Changelog = {}

    changelog[timestampISOString] = {
        user_id: sessionUserId,
        target_user_id: profileUserId,
        type: "flag",
        active: true,
    }

    const insertFlag = await db
    .insertInto('user_moderation_actions')
    .values({
        user_id: sessionUserId,
        target_user_id: profileUserId,
        type: "flag",
        active: true,
        updated_at: timestampISO,
        changelog: changelog
    })
    .returning(['user_id', 'target_user_id', 'type', 'active'])
    .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 

/* Follow or unfollow a collection */

export const insertUpdateCollectionFollow =  async function ( sessionUserId: string, collectionId: string ) {
    const follow = await db.transaction().execute(async (trx) => {

        try {
            const selectCollectionFollow = await trx
            .selectFrom('collections_social')
            .selectAll()
            .where(({ eb, and }) => and([
                eb('user_id', '=', sessionUserId),
                eb('collection_id', '=', collectionId)
            ]))
            .executeTakeFirst()

            const collectionFollow = await selectCollectionFollow

            const id = collectionFollow?.id as string
            const followsNow = collectionFollow?.follows_now as boolean
            const userRole = collectionFollow?.user_role as string
            const changelog = collectionFollow?.changelog as App.Changelog
            
            changelog[timestampISOString] = {
                follows_now: !followsNow,
                user_role: userRole
            }

            const updateCollectionFollow = await trx
            .updateTable('collections_social')
            .set({
                follows_now: !followsNow,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', id)
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return updateCollectionFollow
        }
        catch(error) {
            const changelog: App.Changelog = {}
            changelog[timestampISOString] = {
                follows_now: true,
                user_role: 'follower'
            }
            const insertCollectionFollow = await trx
            .insertInto('collections_social')
            .values({
                user_id: sessionUserId,
                collection_id: collectionId,
                updated_at: timestampISO,
                follows_now: true,
                changelog: changelog
            })
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return insertCollectionFollow
        }
    })

    return follow
}
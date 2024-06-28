import { db } from 'src/database.ts'
import { dateToISODate, timestampISO } from '$lib/resources/parseData'

/* Block a user */

export const insertBlock = async function ( blockData ) {

    const insertBlock = await db
    .insertInto('user_moderation_actions')
    .values({
        user_id: blockData.userId,
        target_user_id: blockData.targetUserId,
        type: "block",
        active: true,
        updated_at: timestampISO,
        needs_review: true
    })
    .returning(['user_id', 'target_user_id', 'type', 'active'])
    .executeTakeFirst()

    const block = await insertBlock
    return block
} 

/* Flag a post */

export const insertPostFlag = async function ( flagData ) {

    const insertFlag = await db
    .insertInto('user_moderation_actions')
    .values({
        user_id: flagData.userId,
        target_post_id: flagData.targetUserId,
        type: "flag",
        active: true,
        updated_at: timestampISO,
        needs_review: true
    })
    .returning(['user_id', 'target_post_id', 'type', 'active'])
    .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 

/* Flag a user */

export const insertUserFlag = async function ( flagData ) {

    const insertFlag = await db
    .insertInto('user_moderation_actions')
    .values({
        user_id: flagData.userId,
        target_user_id: flagData.targetUserId,
        type: "flag",
        active: true,
        updated_at: timestampISO,
        needs_review: true
    })
    .returning(['user_id', 'target_user_id', 'type', 'active'])
    .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 
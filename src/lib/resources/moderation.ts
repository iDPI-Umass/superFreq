import { db } from 'src/database.ts'

export const moderatorPermissions = async function ( sessionUserId: string, requestedRole: string ) {
    try {
        await db
        .selectFrom('moderation_permissions')
        .selectAll()
        .where('user_id', '=', sessionUserId)
        .where('role', '=', requestedRole)
        .where('active', '=', true)
        .executeTakeFirstOrThrow()

        return { permission: true }
    }
    catch ( error ) {
        return { permission: false }
    }
}

export const getModerationQueueItems = async function ( sessionUserId: string ) {

    const selectQueueItems = await db.transaction().execute(async(trx) => {
        try {
            await trx
            .selectFrom('moderation_permissions')
            .select(['id', 'active'])
            .where('user_id', '=', sessionUserId)
            .where('role', '=', 'site_admin')
            .where('active', '=', true)
            .executeTakeFirstOrThrow()

            const queueItems = await trx
            .selectFrom('user_moderation_actions as actions')
            .innerJoin('profiles as user_profile', 'actions.user_id', 'user_profile.id')
            .leftJoin('profiles as target_user_profile', 'actions.target_user_id', 'target_user_profile.id')
            .leftJoin('posts as target_post', 'actions.target_post_id', 'target_post.id')
            .leftJoin('profiles as target_post_user', 'target_post.user_id', 'target_post_user.id')
            .select([
                'actions.id as moderation_item_id',
                'actions.user_id as user_id',
                'user_profile.username as username',
                'actions.target_user_id as target_user_id',
                'target_user_profile.username as target_username',
                'actions.target_post_id as target_post_id',
                'target_post.created_at as target_post_timestamp',
                'target_post_user.username as target_post_username',
                'actions.type as type',
                'actions.updated_at as timestamp',
                'actions.notes as notes',
                'actions.moderation_log as moderation_log',
                'target_post.changelog as post_changelog'
            ])
            .where('actions.active', '=', true)
            .where('actions.needs_review', '=', true)
            .orderBy('actions.updated_at desc')
            .execute()

            return { queueItems, permission: true}
        }
        catch ( error ) {
            return { queueItems: null, permission: false }
        }
    })

    return selectQueueItems
}

export const updateModerationItem = async function ( sessionUserId: string, moderationItem: App.RowData ) {
    const timestampISOString: string = new Date().toISOString()

    const updateQueueItem = await db.transaction().execute(async(trx) => {
        try {
            await trx
            .selectFrom('moderation_permissions')
            .select(['id', 'active'])
            .where('user_id', '=', sessionUserId)
            .where('role', '=', 'site_admin')
            .where('active', '=', true)
            .executeTakeFirstOrThrow()

            const selectItem = await trx
            .selectFrom('user_moderation_actions')
            .select(['moderation_log', 'id', 'type'])
            .where('id', '=', moderationItem.id)
            .executeTakeFirst()

            const item = selectItem
            const itemId = item?.id as string
            const action = item?.type as string
            const log = item?.moderation_log as App.Changelog

            log[timestampISOString] = {
                'moderated_by': sessionUserId,
                'notes': moderationItem.notes,
                'needs_review': moderationItem.needs_review
            }
            
            await trx
            .updateTable('user_moderation_actions')
            .set({
                notes: moderationItem.notes,
                needs_review: moderationItem.needs_review,
                moderator_id: sessionUserId,
                moderator_reviewed_at: moderationItem.moderator_reviewed_at,
                moderation_log: log
            })
            .where('id', '=', moderationItem.id)
            .executeTakeFirstOrThrow()

            await trx
            .insertInto('moderation_updates')
            .values({
                moderator_id: sessionUserId,
                moderation_item_id: itemId,
                target_action: action,
                target_item_type: moderationItem.target_item_type,
                updated_at: moderationItem.moderator_reviewed_at
            })
            .executeTakeFirstOrThrow()

            return { success: true }
        }
        catch ( error ) {
            return { success: false }
        }
    })

    return updateQueueItem
}

export const reportBug = async ( sessionUserId: string, bugData: App.RowData ) => {
    if ( !sessionUserId ) {
        return { reportId: null }
    }

    const submit = await db
    .insertInto('bug_reports')
    .values({
        user_id: sessionUserId,
        type: bugData.type,
        path: bugData.path,
        description: bugData.description,
        email: bugData.email
    })
    .returning('id')
    .executeTakeFirstOrThrow()

    const reportId = submit.id

    return { reportId }
}

export const getBugReports = async function ( sessionUserId: string ) {

    const select = await db.transaction()
    .execute(async(trx) => {
        try {
            await trx
            .selectFrom('moderation_permissions')
            .select(['id', 'active'])
            .where('user_id', '=', sessionUserId)
            .where('role', '=', 'site_admin')
            .where('active', '=', true)
            .executeTakeFirstOrThrow()

            const reports = await trx
            .selectFrom('bug_reports')
            .leftJoin('profiles', 'bug_reports.user_id', 'profiles.id')
            .select([
                'bug_reports.id as id',
                'bug_reports.created_at as created_at',
                'bug_reports.type as type',
                'bug_reports.description as description',
                'bug_reports.path as path',
                'bug_reports.user_id as user_id',
                'bug_reports.dev_notes as dev_notes',
                'profiles.username as username',
                'profiles.display_name as display_name'
            ])
            .where('bug_reports.resolved', '=', false)
            .orderBy('bug_reports.created_at desc')
            .execute()

            return { reports, permission: true }
        }
        catch ( error ) {
            return { reports: null, permission: false}
        }
    })

    const { reports, permission } = await select
    return { reports, permission }
}

export const updateBugReport = async function ( sessionUserId: string, bugReportUpdate: App.RowData ) {
    const timestampISOString: string = new Date().toISOString()

    const updateQueueItem = await db.transaction().execute(async(trx) => {
        try {
            await trx
            .selectFrom('moderation_permissions')
            .select(['id', 'active'])
            .where('user_id', '=', sessionUserId)
            .where('role', '=', 'site_admin')
            .where('active', '=', true)
            .executeTakeFirstOrThrow()

            const selectItem = await trx
            .selectFrom('bug_reports')
            .select('dev_log')
            .where('id', '=', bugReportUpdate.id)
            .executeTakeFirst()

            const { dev_log } = selectItem as App.Changelog

            dev_log[timestampISOString] = {
                'dev_id': sessionUserId,
                'notes': bugReportUpdate.notes,
                'resolved': bugReportUpdate.resolved
            }
            
            await trx
            .updateTable('bug_reports')
            .set({
                dev_notes: bugReportUpdate.notes,
                resolved: bugReportUpdate.resolved,
                dev_log: dev_log,
            })
            .where('id', '=', bugReportUpdate.id)
            .executeTakeFirstOrThrow()

            return { success: true }
        }
        catch ( error ) {
            return { success: false }
        }
    })

    return updateQueueItem
}
import { d as db } from "./database.js";
const moderatorPermissions = async function(sessionUserId, requestedRole) {
  try {
    await db.selectFrom("moderation_permissions").selectAll().where("user_id", "=", sessionUserId).where("role", "=", requestedRole).where("active", "=", true).executeTakeFirstOrThrow();
    return { permission: true };
  } catch (error) {
    return { permission: false };
  }
};
const getModerationQueueItems = async function(sessionUserId) {
  const selectQueueItems = await db.transaction().execute(async (trx) => {
    try {
      await trx.selectFrom("moderation_permissions").select(["id", "active"]).where("user_id", "=", sessionUserId).where("role", "=", "site_admin").where("active", "=", true).executeTakeFirstOrThrow();
      const queueItems = await trx.selectFrom("user_moderation_actions as actions").innerJoin("profiles as user_profile", "actions.user_id", "user_profile.id").leftJoin("profiles as target_user_profile", "actions.target_user_id", "target_user_profile.id").leftJoin("posts as target_post", "actions.target_post_id", "target_post.id").leftJoin("profiles as target_post_user", "target_post.user_id", "target_post_user.id").select([
        "actions.id as moderation_item_id",
        "actions.user_id as user_id",
        "user_profile.username as username",
        "actions.target_user_id as target_user_id",
        "target_user_profile.username as target_username",
        "actions.target_post_id as target_post_id",
        "target_post.created_at as target_post_timestamp",
        "target_post_user.username as target_post_username",
        "actions.type as type",
        "actions.updated_at as timestamp",
        "actions.notes as notes",
        "actions.moderation_log as moderation_log",
        "target_post.changelog as post_changelog"
      ]).where("actions.active", "=", true).where("actions.needs_review", "=", true).orderBy("actions.updated_at desc").execute();
      return { queueItems, permission: true };
    } catch (error) {
      return { queueItems: null, permission: false };
    }
  });
  return selectQueueItems;
};
const updateModerationItem = async function(sessionUserId, moderationItem) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const updateQueueItem = await db.transaction().execute(async (trx) => {
    try {
      await trx.selectFrom("moderation_permissions").select(["id", "active"]).where("user_id", "=", sessionUserId).where("role", "=", "site_admin").where("active", "=", true).executeTakeFirstOrThrow();
      const selectItem = await trx.selectFrom("user_moderation_actions").select(["moderation_log", "id", "type"]).where("id", "=", moderationItem.id).executeTakeFirst();
      const item = selectItem;
      const itemId = item?.id;
      const action = item?.type;
      const log = item?.moderation_log;
      log[timestampISOString] = {
        "moderated_by": sessionUserId,
        "notes": moderationItem.notes,
        "needs_review": moderationItem.needs_review
      };
      await trx.updateTable("user_moderation_actions").set({
        notes: moderationItem.notes,
        needs_review: moderationItem.needs_review,
        moderator_id: sessionUserId,
        moderator_reviewed_at: moderationItem.moderator_reviewed_at,
        moderation_log: log
      }).where("id", "=", moderationItem.id).executeTakeFirstOrThrow();
      await trx.insertInto("moderation_updates").values({
        moderator_id: sessionUserId,
        moderation_item_id: itemId,
        target_action: action,
        target_item_type: moderationItem.target_item_type,
        updated_at: moderationItem.moderator_reviewed_at
      }).executeTakeFirstOrThrow();
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  });
  return updateQueueItem;
};
export {
  getModerationQueueItems as g,
  moderatorPermissions as m,
  updateModerationItem as u
};

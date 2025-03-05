import "../../../../chunks/index.js";
import { g as getModerationQueueItems, u as updateModerationItem } from "../../../../chunks/moderation.js";
import { t as timestampISO } from "../../../../chunks/parseData.js";
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  const sessionUserId = session?.user.id;
  const { queueItems, permission } = await getModerationQueueItems(sessionUserId);
  if (permission) {
    return { queueItems };
  }
};
const actions = {
  update: async ({ request, locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    const sessionUserId = session?.user.id;
    const data = await request.formData();
    const itemId = data.get("item-id");
    const notes = data.get("notes");
    const type = data.get("item-type");
    const resolved = data.get("resolved");
    const needsReview = resolved == "on" ? false : true;
    const moderationItem = {
      "id": itemId,
      "notes": notes,
      "needs_review": needsReview,
      "moderator_reviewed_at": timestampISO,
      "target_item_type": type
    };
    const { success } = await updateModerationItem(sessionUserId, moderationItem);
    return { success };
  }
};
export {
  actions,
  load
};

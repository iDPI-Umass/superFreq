import "../../../../../chunks/index.js";
import { a as updateUsername } from "../../../../../chunks/users.js";
import { p as profileStoresObject } from "../../../../../chunks/stores.js";
import { d as db } from "../../../../../chunks/database.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const selectProfile = await db.selectFrom("profiles").where("id", "=", sessionUserId).selectAll().executeTakeFirstOrThrow();
  const profile = await selectProfile;
  return profile;
};
const actions = {
  default: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const formData = await request.formData();
    const newUsername = formData.get("new-username");
    const { update, success } = await updateUsername(sessionUserId, newUsername);
    const { username, display_name, avatar_url } = update;
    if (success) {
      profileStoresObject.set({
        "username": username,
        "display_name": display_name,
        "avatar_url": avatar_url
      });
      return { success: false };
    } else {
      return { success: true };
    }
  }
};
export {
  actions,
  load
};

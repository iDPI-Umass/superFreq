import { m as moderatorPermissions } from "../../../chunks/moderation.js";
import { r as redirect } from "../../../chunks/index.js";
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  const sessionUserId = session?.user.id;
  const { permission } = await moderatorPermissions(sessionUserId, "site_admin");
  if (!permission) {
    throw redirect(303, "/");
  }
};
export {
  load
};

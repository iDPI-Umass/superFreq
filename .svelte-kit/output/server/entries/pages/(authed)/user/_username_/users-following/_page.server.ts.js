import { r as redirect } from "../../../../../../chunks/index.js";
import { g as selectListUserFollowing } from "../../../../../../chunks/users.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const username = params.username;
  const { profiles, permission, profileDisplayName } = await selectListUserFollowing(sessionUserId, username);
  if (profiles.length == 0 || !permission) {
    throw redirect(303, `/user/${username}`);
  }
  return { profiles, profileDisplayName, username };
};
export {
  load
};

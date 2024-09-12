import { r as redirect } from "../../../../chunks/index.js";
import { d as db } from "../../../../chunks/database.js";
import { p as profileStoresObject } from "../../../../chunks/stores.js";
const GET = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  console.log(session);
  const sessionUserId = session.user?.id;
  const select = await db.selectFrom("profiles").select(["username", "display_name", "avatar_url"]).where("id", "=", sessionUserId).executeTakeFirstOrThrow();
  const profile = await select;
  const { username, display_name, avatar_url } = profile;
  if (profile && username) {
    profileStoresObject.set({
      "username": username,
      "display_name": display_name,
      "avatar_url": avatar_url
    });
    return redirect(303, `/user/${username}`);
  } else if (profile && !username) {
    return redirect(303, "/account/create-profile");
  }
  return redirect(303, "/auth/error");
};
export {
  GET
};

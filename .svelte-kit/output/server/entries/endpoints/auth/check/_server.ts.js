import { r as redirect } from "../../../../chunks/index.js";
import { d as db } from "../../../../chunks/database.js";
import { p as profileStoresObject } from "../../../../chunks/stores.js";
const GET = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  let userId = null;
  let username = null;
  let display_name = null;
  let avatar_url = null;
  let select;
  try {
    select = await db.selectFrom("profiles").select(["id", "username", "display_name", "avatar_url"]).where("id", "=", sessionUserId).executeTakeFirstOrThrow();
    const profile = await select;
    userId = profile?.id;
    username = profile?.username;
    display_name = profile?.display_name;
    avatar_url = profile?.avatar_url;
  } catch (error) {
    select = null;
  }
  if (userId && username) {
    profileStoresObject.set({
      "username": username,
      "display_name": display_name,
      "avatar_url": avatar_url
    });
    return redirect(303, `/user/${username}`);
  } else if (userId && !username) {
    return redirect(303, "/create-profile");
  }
  const errorPath = new URL("/auth/error");
  errorPath.searchParams.set("redirectFrom", "check");
  return redirect(303, errorPath);
};
export {
  GET
};

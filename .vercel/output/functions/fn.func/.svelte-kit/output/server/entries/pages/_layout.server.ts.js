import { d as db } from "../../chunks/database.js";
import { l as logo } from "../../chunks/freq-logo-dark.js";
const load = async ({ locals: { safeGetSession }, cookies }) => {
  const { session, user } = await safeGetSession();
  if (session) {
    const select = await db.selectFrom("profiles").select(["username", "display_name", "website", "avatar_url"]).where("id", "=", user?.id).executeTakeFirst();
    const profile2 = await select;
    return { session, profile: profile2, cookies: cookies.getAll() };
  }
  const profile = {
    "username": "username",
    "display_name": "display name",
    "avatar_url": logo,
    "website": "https://freq.social"
  };
  return { session, profile, cookies: cookies.getAll() };
};
export {
  load
};

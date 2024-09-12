import { p as profileStoresObject } from "../../../../../chunks/stores.js";
import { n as newSessionProfile } from "../../../../../chunks/users.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const email = session.user?.email;
  return { email };
};
const actions = {
  create: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const formData = await request.formData();
    const username = formData.get("username");
    const displayName = formData.get("display-name");
    const about = formData.get("about");
    const website = formData.get("website");
    const avatarUrl = formData.get("avatar-url");
    const avatarMbid = formData.get("avatar-mbid");
    const profileData = {
      "username": username,
      "display_name": displayName,
      "website": website,
      "avatar_url": avatarUrl,
      "avatar_mbid": avatarMbid,
      "about": about
    };
    const update = await newSessionProfile(sessionUserId, profileData);
    profileStoresObject.set({
      "username": username,
      "display_name": displayName,
      "avatar_url": avatarUrl
    });
    const success = update.success;
    return { success };
  }
};
export {
  actions,
  load
};

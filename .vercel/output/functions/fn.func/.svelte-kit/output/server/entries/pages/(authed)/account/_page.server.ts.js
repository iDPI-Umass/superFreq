import { r as redirect } from "../../../../chunks/index.js";
import { s as selectSessionProfile, u as updateSessionProfile } from "../../../../chunks/users.js";
import { p as profileStoresObject } from "../../../../chunks/stores.js";
const load = async ({ locals: { safeGetSession } }) => {
  const { user } = await safeGetSession();
  const sessionUserId = user?.id;
  const profile = await selectSessionProfile(sessionUserId);
  console.log(profile?.avatar_url);
  return { user, sessionUserId, profile };
};
const actions = {
  update: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const formData = await request.formData();
    const displayName = formData.get("displayName");
    const username = formData.get("username");
    const website = formData.get("website");
    const avatarMbid = formData.get("avatarMbid");
    const newAvatarMbid = formData.get("newAvatarMbid");
    const avatarUrl = formData.get("avatarUrl");
    const newAvatarUrl = formData.get("newAvatarUrl");
    const about = formData.get("about");
    const avatar = newAvatarUrl ? newAvatarUrl : avatarUrl;
    const mbid = newAvatarMbid ? newAvatarMbid : avatarMbid;
    console.log("avatar " + avatar);
    console.log("old avatar " + avatarUrl);
    console.log("new avatar " + newAvatarUrl);
    profileStoresObject.set({
      "username": username,
      "display_name": displayName,
      "avatar_url": avatar,
      "website": website
    });
    const profileData = {
      id: session.user?.id,
      display_name: displayName,
      username,
      website,
      avatar_mbid: mbid,
      avatar_url: avatar,
      updated_at: /* @__PURE__ */ new Date(),
      about
    };
    const submitUpdate = await updateSessionProfile(sessionUserId, profileData);
    if (submitUpdate) {
      return { success: true };
    } else {
      return { success: false };
    }
  },
  signout: async () => {
    throw redirect(303, "/sign-out");
  }
};
export {
  actions,
  load
};

import { n as newSessionProfile } from "../../../chunks/users.js";
let sessionUserId;
let email;
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  sessionUserId = session?.user.id;
  email = session?.user.email;
  return { email };
};
const actions = {
  create: async ({ request }) => {
    const formData = await request.formData();
    const username = formData.get("username");
    const displayName = formData.get("display-name");
    const about = formData.get("about");
    const website = formData.get("website");
    const avatarItem = JSON.parse(formData.get("avatarItem"));
    const avatarUrl = formData.get("avatarUrl");
    const avatarMbid = formData.get("avatarMbid");
    const profileData = {
      "username": username,
      "display_name": displayName ?? username,
      "website": website,
      "avatar_url": avatarUrl ?? null,
      "avatar_mbid": avatarMbid ?? null,
      "about": about
    };
    const update = await newSessionProfile(sessionUserId, profileData, email, avatarItem);
    const success = update.success;
    return { success };
  }
};
export {
  actions,
  load
};

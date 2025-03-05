import { d as db } from "../../chunks/database.js";
import { w as wave } from "../../chunks/freq-wave.js";
const load = async ({ depends, locals: { safeGetSession }, cookies }) => {
  const { session } = await safeGetSession();
  if (session) {
    const sessionUserId = session?.user.id;
    const selectSessionProfile = await db.selectFrom("profiles").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
      "profiles.username as username",
      "profiles.display_name as display_name",
      "profiles.website as website",
      "profiles.avatar_url as avatar_url",
      "release_groups.last_fm_img_url as avatar_last_fm_img_url",
      "release_groups.release_group_name as avatar_release_group_name",
      "artists.artist_name as avatar_artist_name"
    ]).where("profiles.id", "=", sessionUserId).executeTakeFirst();
    const profile2 = await selectSessionProfile;
    depends("app:avatarImg");
    return { session, sessionUserId, profile: profile2, cookies: cookies.getAll() };
  }
  const profile = {
    "username": null,
    "display_name": null,
    "avatar_url": wave,
    "avatar_artist_name": null,
    "avatar_release_group_name": null,
    "website": "https://freq.social"
  };
  return { session, sessionUserId: null, profile, cookies: cookies.getAll() };
};
export {
  load
};

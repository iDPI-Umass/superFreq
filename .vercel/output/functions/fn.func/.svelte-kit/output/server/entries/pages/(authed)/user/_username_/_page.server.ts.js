import { r as redirect } from "../../../../../chunks/index.js";
import { b as selectProfilePageData, i as insertUpdateBlock, c as insertUserFlag, d as insertUpdateUserFollow } from "../../../../../chunks/users.js";
import { s as selectFeedData } from "../../../../../chunks/feed.js";
import { s as selectUserPostsSample } from "../../../../../chunks/posts2.js";
import { add } from "date-fns";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session?.user?.id;
  const profileUsername = params.username;
  const batchSize = 10;
  const batchIterator = 0;
  const timestampEnd = /* @__PURE__ */ new Date();
  const timestampStart = add(timestampEnd, { days: -300 });
  const options = { "options": ["nowPlayingPosts", "comments", "reactions", "collectionFollows", "collectionEdits"] };
  const profileData = await selectProfilePageData(sessionUserId, profileUsername);
  if (!profileData.profileUserData) {
    throw redirect(303, "/");
  }
  const feedItems = await selectFeedData(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options);
  const selectPosts = await selectUserPostsSample(sessionUserId, profileUsername, batchSize);
  const posts = selectPosts?.posts;
  return { sessionUserId, profileData, feedItems, profileUsername, posts };
};
const actions = {
  blockUser: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session?.user?.id;
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const block = await insertUpdateBlock(sessionUserId, profileUserId);
    const blockStatus = block?.active;
    if (block) {
      return { block, blockStatus, success: true };
    }
    return { block, blockStatus, success: false };
  },
  reportUser: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session?.user?.id;
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const flag = await insertUserFlag(sessionUserId, profileUserId);
    const flagStatus = flag?.active;
    if (flag) {
      return { flag, flagStatus, success: true };
    }
    return { flag, flagStatus, success: false };
  },
  followUser: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session?.user?.id;
    console.log(sessionUserId);
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const follow = await insertUpdateUserFollow(sessionUserId, profileUserId);
    const followStatus = follow?.follows_now;
    return { follow, followStatus };
  }
};
export {
  actions,
  load
};

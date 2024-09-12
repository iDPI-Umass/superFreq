import { r as redirect } from "../../../../../../chunks/index.js";
import { a as selectUserPosts } from "../../../../../../chunks/posts2.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const username = params.username;
  const selectPosts = await selectUserPosts(sessionUserId, username);
  const permission = selectPosts?.permission;
  const posts = selectPosts?.posts;
  if (posts.length == 0 || !permission) {
    throw redirect(303, `/user/${username}`);
  }
  return { posts, username, sessionUserId };
};
export {
  load
};

import { r as redirect } from "../../../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { c as selectPostAndReplies, i as insertPost, u as updatePost, d as deletePost, e as insertUpdateReaction } from "../../../../../../chunks/posts2.js";
import { g as insertPostFlag } from "../../../../../../chunks/users.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  if (!session.session) {
    throw redirect(303, "/");
  }
  const sessionUserId = session.user?.id;
  const username = params.username;
  const timestampString = params.timestamp;
  const postType = "now_playing";
  const select = await selectPostAndReplies(sessionUserId, username, timestampString, postType);
  const permission = select?.permission;
  if (!permission) {
    return { sessionUserId: null, post: null, postReactionActive: null, replies: null };
  }
  const post = select?.post;
  const postReactionActive = select?.postReactionActive?.active;
  const replies = select?.replies;
  return { sessionUserId, post, postReactionActive, replies };
};
const actions = {
  submitReply: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const replyText = data.get("reply-text");
    const postId = data.get("post-id");
    const postData = {
      user_id: sessionUserId,
      type: "reply",
      status: "new",
      text: replyText,
      created_at: timestampISO,
      updated_at: timestampISO,
      parent_post_id: postId
    };
    const insertReply = await insertPost(postData);
    if (insertReply) {
      return { success: true };
    } else {
      return { success: false };
    }
  },
  editPost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const editedText = data.get("edited-text");
    const postData = data.get("post-data");
    const submitEdit = await updatePost(sessionUserId, postData, editedText);
    if (submitEdit) {
      return { success: true, editState: false };
    } else {
      return { success: false, editState: true };
    }
  },
  deletePost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const submitDelete = await deletePost(sessionUserId, postId);
    if (submitDelete) {
      throw redirect(303, "/feed");
    } else {
      return { falied: true };
    }
  },
  flagPost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const flag = await insertPostFlag(sessionUserId, postId);
    return flag;
  },
  insertReaction: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const reactionType = data.get("reaction-type");
    const reaction = await insertUpdateReaction(sessionUserId, postId, reactionType);
    return reaction;
  }
};
export {
  actions,
  load
};

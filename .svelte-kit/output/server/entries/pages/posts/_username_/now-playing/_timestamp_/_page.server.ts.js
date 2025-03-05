import { r as redirect } from "../../../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { c as selectPostAndReplies, d as deletePost, u as updatePost, i as insertUpdateReaction, a as insertPost } from "../../../../../../chunks/posts.js";
import { i as insertPostFlag } from "../../../../../../chunks/users.js";
import { s as saveItemToCollection, a as selectListSessionUserCollections } from "../../../../../../chunks/collections.js";
import "../../../../../../chunks/parseData.js";
let sessionUserId;
let loadData = true;
let post = {};
let postId;
let postUsername;
let postCreatedAt;
let postTimestamp;
let postReplies;
let updateReaction;
let reactionActive;
let postReactionCount;
let editPost;
let editedText;
let saveItemPostId;
let collections = [];
const load = async ({ params, parent, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  const { profile } = await parent();
  let username = profile?.username ?? null;
  if (!session) {
    throw redirect(307, "/");
  } else if (session && !username) {
    throw redirect(307, "/create-profile");
  }
  sessionUserId = session?.user.id;
  username = params.username;
  const timestamp = parseInt(params.timestamp);
  const timestampString = new Date(timestamp).toISOString();
  const postType = "now_playing";
  let replies = [];
  let permission = true;
  if (loadData) {
    const select = await selectPostAndReplies(sessionUserId, username, timestampString, postType);
    post = select.post;
    replies = select.replies;
    permission = select.permission;
    if (!permission) {
      return { sessionUserId: null, post: null, postReactionActive: null, replies: null };
    }
    postId = post?.id;
    postUsername = post?.username;
    postCreatedAt = post?.created_at.toISOString();
    postTimestamp = Date.parse(postCreatedAt).toString();
    postReplies = replies;
  }
  if (updateReaction) {
    updateReaction = false;
    loadData = true;
    post.reaction_active = reactionActive;
    post.reaction_count = postReactionCount;
  }
  if (editPost) {
    editPost = false;
    loadData = true;
    post.text = editedText;
  }
  return { sessionUserId, post, postReplies, collections };
};
const actions = {
  submitReply: async ({ request }) => {
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const replyText = data.get("reply-text");
    const postData = {
      user_id: sessionUserId,
      type: "reply",
      status: "new",
      text: replyText,
      created_at: timestampISO,
      updated_at: timestampISO,
      parent_post_id: postId
    };
    const { username, createdAt } = await insertPost(postData);
    const commentTimestampSlug = createdAt.toString();
    const commentTimestamp = Date.parse(commentTimestampSlug).toString();
    const permalink = `/posts/${postUsername}/now-playing/${postTimestamp}#${username.concat(commentTimestamp)}`;
    if (createdAt) {
      throw redirect(303, permalink);
    } else {
      return { success: false };
    }
  },
  submitReaction: async ({ request }) => {
    const data = await request.formData();
    const reactionType = data.get("reaction-type");
    const { reaction, reactionCount } = await insertUpdateReaction(sessionUserId, postId, reactionType);
    reactionActive = reaction?.active;
    postReactionCount = reactionCount;
    const success = reaction ? true : false;
    updateReaction = success ? true : false;
    loadData = success ? false : true;
    return { success, reactionActive, reactionCount };
  },
  editPost: async ({ request }) => {
    const data = await request.formData();
    editedText = data.get("edited-text");
    const postData = JSON.parse(data.get("post-data"));
    const submitEdit = await updatePost(sessionUserId, postData, editedText);
    const success = submitEdit ? true : false;
    const editState = submitEdit ? false : true;
    editedText = success ? submitEdit.text : editedText;
    editPost = success ? true : false;
    loadData = success ? false : true;
    return { success, editState };
  },
  deletePost: async ({ request }) => {
    const data = await request.formData();
    const postId2 = data.get("post-reply-id") ?? data.get("post-id");
    const submitDelete = await deletePost(sessionUserId, postId2);
    const parentPostId = submitDelete?.parent_post_id;
    const permalink = parentPostId ? `/posts/${postUsername}/now-playing/${postTimestamp}` : "/";
    if (submitDelete) {
      throw redirect(303, permalink);
    } else {
      return { success: false };
    }
  },
  flagPost: async ({ request }) => {
    const data = await request.formData();
    const postId2 = data.get("post-reply-id") ?? data.get("post-id");
    const flag = await insertPostFlag(sessionUserId, postId2);
    const success = flag ? true : false;
    return { success };
  },
  getCollectionList: async ({ request }) => {
    const data = await request.formData();
    saveItemPostId = data.get("post-id");
    if (collections.length == 0) {
      collections = await selectListSessionUserCollections(sessionUserId);
    }
    return { showCollectionsModal: true };
  },
  saveToCollection: async ({ request }) => {
    const data = await request.formData();
    const collectionId = data.get("collection-id");
    const update = await saveItemToCollection(sessionUserId, saveItemPostId, collectionId);
    return { updateSuccess: update };
  }
};
export {
  actions,
  load
};

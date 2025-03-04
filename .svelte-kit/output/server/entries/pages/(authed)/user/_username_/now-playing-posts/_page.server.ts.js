import { r as redirect } from "../../../../../../chunks/index.js";
import { b as selectUserNowPlayingPosts, i as insertUpdateReaction, d as deletePost, u as updatePost } from "../../../../../../chunks/posts.js";
import { i as insertPostFlag } from "../../../../../../chunks/users.js";
import { v as validStringCheck } from "../../../../../../chunks/parseData.js";
import { s as saveItemToCollection, a as selectListSessionUserCollections } from "../../../../../../chunks/collections.js";
let sessionUserCollections = [];
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const username = params.username;
  const selectPosts = await selectUserNowPlayingPosts(sessionUserId, username);
  const permission = selectPosts?.permission;
  const posts = selectPosts?.posts;
  if (posts.length == 0 || !permission) {
    throw redirect(303, `/user/${username}`);
  }
  return { posts, username, sessionUserId, sessionUserCollections };
};
const actions = {
  editPost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const editedText = data.get("edited-text");
    const postData = JSON.parse(data.get("post-data"));
    const submitEdit = await updatePost(sessionUserId, postData, editedText);
    const success = submitEdit ? true : false;
    const editState = submitEdit ? false : true;
    return { success, editState };
  },
  deletePost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const submitDelete = await deletePost(sessionUserId, postId);
    const success = submitDelete ? true : false;
    return { success };
  },
  flagPost: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const flag = await insertPostFlag(sessionUserId, postId);
    const success = flag ? true : false;
    return { success };
  },
  submitReaction: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const postId = data.get("post-id");
    const reactionType = data.get("reaction-type");
    const reaction = await insertUpdateReaction(sessionUserId, postId, reactionType);
    const reactionSuccess = reaction ? true : false;
    return { reactionSuccess };
  },
  getCollectionList: async ({ locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    if (sessionUserCollections.length == 0) {
      sessionUserCollections = await selectListSessionUserCollections(sessionUserId);
    }
    return { showCollectionsModal: true };
  },
  saveToCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const collectionId = data.get("collection-id");
    const artistMbid = data.get("artist-mbid");
    const releaseGroupMbid = data.get("release-group-mbid");
    const recordingMbid = data.get("recording-mbid");
    const userAddedMetadataId = data.get("user-added-metadata-id");
    const itemType = data.get("item-type");
    const fromPostId = data.get("saved-from-post");
    const fromCollectionId = data.get("saved-from-collection");
    const item = {
      artist_mbid: validStringCheck(artistMbid),
      release_group_mbid: validStringCheck(releaseGroupMbid),
      recording_mbid: validStringCheck(recordingMbid),
      item_type: itemType,
      from_post_id: validStringCheck(fromPostId),
      from_collection_id: validStringCheck(fromCollectionId),
      user_added_metadata_id: validStringCheck(userAddedMetadataId)
    };
    const update = await saveItemToCollection(sessionUserId, item, collectionId);
    return { updateSuccess: update };
  }
};
export {
  actions,
  load
};

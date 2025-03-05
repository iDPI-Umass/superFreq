import { s as selectFeedData } from "../../../../chunks/feed2.js";
import { i as insertPostFlag } from "../../../../chunks/users.js";
import { d as deletePost, i as insertUpdateReaction } from "../../../../chunks/posts.js";
import { s as saveItemToCollection, a as selectListSessionUserCollections } from "../../../../chunks/collections.js";
import { add } from "date-fns";
let sessionUserId;
let loadData = true;
let updateReaction = false;
let batchIterator = 0;
const feedItems = [];
let feedItemCount = 0;
let totalAvailableItems = 0;
let remaining = 0;
let nowPlayingPostId;
let updatedReactionActive;
let updatedReactionCount;
let saveItemPostId;
let sessionUserCollections = [];
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  sessionUserId = session?.user.id;
  const batchSize = 20;
  const timestampEnd = /* @__PURE__ */ new Date();
  const timestampStart = add(timestampEnd, { days: -300 });
  const options = { "options": ["nowPlayingPosts", "comments", "reactions", "collectionFollows", "collectionEdits"] };
  if (loadData) {
    const { feedData, totalRowCount } = await selectFeedData(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options);
    feedItems.push(...feedData);
    feedItemCount = feedItems.length;
    totalAvailableItems = totalRowCount;
    remaining = totalRowCount - feedItemCount;
    loadData = !loadData;
  }
  if (updateReaction) {
    const reaction = feedItems.find((item) => item.now_playing_post_id == nowPlayingPostId);
    reaction.reaction_active = updatedReactionActive;
    reaction.reaction_count = updatedReactionCount;
    updateReaction = false;
    loadData = true;
  }
  return { sessionUserId, feedItems, totalAvailableItems, remaining, sessionUserCollections };
};
const actions = {
  loadMore: async () => {
    batchIterator++;
    loadData = true;
    return { loadData };
  },
  submitReaction: async ({ request }) => {
    const data = await request.formData();
    const postId = data.get("post-id");
    const reactionType = data.get("reaction-type");
    const { reaction, reactionCount } = await insertUpdateReaction(sessionUserId, postId, reactionType);
    nowPlayingPostId = postId;
    updatedReactionActive = reaction.active;
    updatedReactionCount = reactionCount;
    updateReaction = reaction ? true : false;
    loadData = reaction ? false : true;
    return { updateReaction };
  },
  flagPost: async ({ request }) => {
    const data = await request.formData();
    const postId = data.get("post-id");
    const flag = await insertPostFlag(sessionUserId, postId);
    const userActionSuccess = flag ? true : false;
    return { userActionSuccess };
  },
  deletePost: async ({ request }) => {
    const data = await request.formData();
    const postId = data.get("post-id");
    const submitDelete = await deletePost(sessionUserId, postId);
    const success = submitDelete ? true : false;
    return { success };
  },
  getCollectionList: async ({ request }) => {
    const data = await request.formData();
    saveItemPostId = data.get("post-id");
    if (sessionUserCollections.length == 0) {
      sessionUserCollections = await selectListSessionUserCollections(sessionUserId);
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

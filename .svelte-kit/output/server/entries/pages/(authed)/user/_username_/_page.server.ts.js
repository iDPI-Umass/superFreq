import { r as redirect } from "../../../../../chunks/index.js";
import { b as selectProfilePageData, i as insertPostFlag, d as insertUpdateUserFollow, e as insertUserFlag, f as insertUpdateBlock } from "../../../../../chunks/users.js";
import { s as selectFeedData } from "../../../../../chunks/feed2.js";
import { s as selectUserPostsSample, i as insertUpdateReaction, d as deletePost, a as insertPost } from "../../../../../chunks/posts.js";
import { s as saveItemToCollection, a as selectListSessionUserCollections } from "../../../../../chunks/collections.js";
import { g as getListenUrlData, v as validStringCheck } from "../../../../../chunks/parseData.js";
import { add, parseISO } from "date-fns";
import { m as metadata } from "../../../../../chunks/updates.js";
let sessionUserId;
let username = null;
let loadData = true;
let userAction = false;
let updateReaction = false;
let profileData = null;
let batchIterator = 0;
const feedItems = [];
let feedItemCount = 0;
let totalAvailableItems = 0;
let remaining = 0;
let postId;
let updatedReactionActive;
let updatedReactionCount;
let saveItemPostId;
let sessionUserCollections = [];
const load = async ({ params, locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  sessionUserId = session?.user.id;
  const profileUsername = params.username;
  loadData = profileUsername != username ? true : false;
  const batchSize = 10;
  const timestampEnd = /* @__PURE__ */ new Date();
  const timestampStart = add(timestampEnd, { days: -300 });
  const options = { "options": ["nowPlayingPosts", "comments", "reactions", "collectionFollows", "collectionEdits"] };
  const updatesPageUpdatedAt = metadata.updated;
  if (loadData) {
    profileData = await selectProfilePageData(sessionUserId, profileUsername);
    username = profileData.profileUserData ? profileData.profileUserData.username : null;
    if (!profileData.profileUserData) {
      throw redirect(303, "/");
    } else if (sessionUserId == profileData.profileUserData.id) {
      const { feedData, totalRowCount } = await selectFeedData(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options);
      feedItems.push(...feedData);
      feedItemCount = feedItems.length;
      totalAvailableItems = totalRowCount;
      remaining = totalRowCount - feedItemCount;
      loadData = !loadData;
    } else if (sessionUserId != profileData.profileUserData.id) {
      const selectPosts = await selectUserPostsSample(sessionUserId, profileUsername, batchSize);
      const { posts } = selectPosts;
      feedItems.push(...posts);
      feedItemCount = feedItems.length;
      console.log(feedItemCount);
    }
  }
  if (userAction) {
    userAction = false;
    loadData = true;
    profileData = await selectProfilePageData(sessionUserId, profileUsername);
  }
  function findPost(item, postId2) {
    if (item.post_id == postId2) {
      return true;
    }
    return false;
  }
  if (updateReaction) {
    updateReaction = false;
    const reaction = feedItems.find((element) => findPost(element, postId));
    console.log(reaction);
    reaction.reaction_active = updatedReactionActive;
    reaction.reaction_count = updatedReactionCount;
  }
  return { sessionUserId, profileData, feedItems, totalAvailableItems, remaining, profileUsername, sessionUserCollections, updatesPageUpdatedAt };
};
const actions = {
  loadMore: async () => {
    batchIterator++;
    loadData = true;
    return { loadData };
  },
  blockUser: async ({ request }) => {
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const block = await insertUpdateBlock(sessionUserId, profileUserId);
    const userActionSuccess = block ? true : false;
    userAction = userActionSuccess ? true : false;
    loadData = userActionSuccess ? false : true;
    return { userActionSuccess };
  },
  reportUser: async ({ request }) => {
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const flag = await insertUserFlag(sessionUserId, profileUserId);
    const userActionSuccess = flag ? true : false;
    userAction = userActionSuccess ? true : false;
    loadData = userActionSuccess ? false : true;
    return { userActionSuccess };
  },
  followUser: async ({ request }) => {
    const data = await request.formData();
    const profileUserId = data.get("profile-user-id");
    const follow = await insertUpdateUserFollow(sessionUserId, profileUserId);
    const userActionSuccess = follow ? true : false;
    userAction = userActionSuccess ? true : false;
    loadData = userActionSuccess ? false : true;
    return { userActionSuccess };
  },
  parseListenUrl: async ({ request }) => {
    const data = await request.formData();
    const listenUrlString = data.get("listen-url");
    const embedInfo = await getListenUrlData(listenUrlString);
    return { embedInfo, success: true };
  },
  post: async ({ request }) => {
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const itemType = data.get("item-type");
    const listenUrl = data.get("listen-url");
    const artistMbid = data.get("artist-mbid");
    const artistName = data.get("artist-name");
    const releaseGroupMbid = data.get("release-group-mbid");
    const releaseGroupName = data.get("release-group-name");
    const recordingMbid = data.get("recording-mbid");
    const recordingName = data.get("recording-name");
    const remixerArtistMbid = data.get("remixer-artist-mbid");
    const releaseDate = data.get("release-date");
    const label = data.get("label");
    const imgUrl = data.get("img-url");
    const lastFmImgUrl = data.get("last-fm-img-url");
    const episodeName = data.get("episode");
    const showName = data.get("show");
    const postText = data.get("post-text");
    const embedInfo = listenUrl ? await getListenUrlData(listenUrl) : null;
    const postData = {
      user_id: sessionUserId,
      type: "now_playing",
      status: "new",
      listen_url: validStringCheck(listenUrl),
      item_type: validStringCheck(itemType),
      artist_mbid: validStringCheck(artistMbid),
      release_group_mbid: validStringCheck(releaseGroupMbid),
      recording_mbid: validStringCheck(recordingMbid),
      artist_name: validStringCheck(artistName),
      release_group_name: validStringCheck(releaseGroupName),
      recording_name: validStringCheck(recordingName),
      remixer_artist_mbid: validStringCheck(remixerArtistMbid),
      release_date: validStringCheck(releaseDate),
      label: validStringCheck(label),
      img_url: validStringCheck(imgUrl),
      last_fm_img_url: validStringCheck(lastFmImgUrl),
      episode_title: validStringCheck(episodeName),
      show_title: validStringCheck(showName),
      text: validStringCheck(postText),
      created_at: timestampISO,
      updated_at: timestampISO,
      embed_id: embedInfo?.id ?? null,
      embed_source: embedInfo?.source ?? null,
      embed_account: embedInfo?.account ?? null
    };
    const { username: username2, createdAt } = await insertPost(postData);
    const timestampSlug = createdAt?.toISOString();
    const timestamp = Date.parse(timestampSlug).toString();
    if (!timestampSlug) {
      return { success: false };
    } else {
      redirect(303, `/posts/${username2}/now-playing/${timestamp}`);
    }
  },
  flagPost: async ({ request }) => {
    const data = await request.formData();
    postId = data.get("post-id");
    const flag = await insertPostFlag(sessionUserId, postId);
    const userActionSuccess = flag ? true : false;
    return { userActionSuccess };
  },
  deletePost: async ({ request }) => {
    const data = await request.formData();
    postId = data.get("post-id");
    const submitDelete = await deletePost(sessionUserId, postId);
    const success = submitDelete ? true : false;
    return { success };
  },
  submitReaction: async ({ request }) => {
    const data = await request.formData();
    postId = data.get("post-id");
    const reactionType = data.get("reaction-type");
    const reaction = await insertUpdateReaction(sessionUserId, postId, reactionType);
    const userActionSuccess = reaction ? true : false;
    updatedReactionActive = reaction.reaction.active;
    updatedReactionCount = parseInt(reaction.reactionCount);
    updateReaction = userActionSuccess ? true : false;
    loadData = userActionSuccess ? false : true;
    return { userActionSuccess };
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

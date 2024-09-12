import { r as redirect } from "../../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { i as insertPost } from "../../../../../chunks/posts2.js";
import { g as getListenUrlData } from "../../../../../chunks/parseData.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  if (!session.session) {
    throw redirect(303, "/");
  }
};
const actions = {
  parseListenUrl: async ({ request }) => {
    const data = await request.formData();
    const listenUrlString = data.get("listen-url");
    const embedInfo = await getListenUrlData(listenUrlString);
    console.log(embedInfo);
    return { embedInfo, success: true };
  },
  postAlbum: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const username = data.get("username");
    const listenUrl = data.get("listen-url");
    const mbid = data.get("mbid");
    const mbidType = data.get("item-type");
    const artistName = data.get("artist-name");
    const albumName = data.get("album-name");
    const postText = data.get("post-text");
    const embedInfo = await getListenUrlData(listenUrl);
    const postData = {
      user_id: sessionUserId,
      type: "now_playing",
      status: "new",
      listen_url: listenUrl,
      item_type: mbidType,
      mbid,
      artist_name: artistName,
      release_group_name: albumName,
      text: postText,
      created_at: timestampISO,
      updated_at: timestampISO,
      embed_id: embedInfo.id,
      embed_source: embedInfo.source,
      embed_account: embedInfo.account
    };
    const newPost = await insertPost(postData);
    const createdAt = newPost?.created_at ?? null;
    const timestampSlug = createdAt?.valueOf().toString();
    if (!timestampSlug) {
      return { sucess: false };
    } else {
      redirect(303, `/user/${username}/now-playing/${timestampSlug}`);
    }
  },
  postTrack: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const username = data.get("username");
    const listenUrl = data.get("listen-url");
    const mbid = data.get("mbid");
    const itemType = data.get("item-type");
    const artistName = data.get("artist-name");
    const albumName = data.get("album-name");
    const recordingName = data.get("track-name");
    const postText = data.get("post-text");
    const embedInfo = await getListenUrlData(listenUrl);
    const postData = {
      user_id: sessionUserId,
      type: "now_playing",
      status: "new",
      listen_url: listenUrl,
      item_type: itemType,
      mbid,
      artist_name: artistName,
      release_group_name: albumName,
      recording_name: recordingName,
      text: postText,
      created_at: timestampISO,
      updated_at: timestampISO,
      embed_id: embedInfo.id,
      embed_source: embedInfo.source,
      embed_account: embedInfo.account
    };
    const newPost = await insertPost(postData);
    const createdAt = newPost?.created_at ?? null;
    const timestampSlug = createdAt?.valueOf().toString();
    if (!timestampSlug) {
      return { sucess: false };
    } else {
      redirect(303, `/user/${username}/now-playing/${timestampSlug}`);
    }
  },
  postMix: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const username = data.get("username");
    const listenUrl = data.get("listen-url");
    const mbid = data.get("mbid");
    const itemType = data.get("item-type");
    const artistName = data.get("artist-name");
    const episode = data.get("episode");
    const show = data.get("show");
    const postText = data.get("post-text");
    const embedInfo = await getListenUrlData(listenUrl);
    const postData = {
      user_id: sessionUserId,
      type: "now_playing",
      status: "new",
      listen_url: listenUrl,
      item_type: itemType,
      mbid,
      artist_name: artistName,
      episode_title: episode,
      show_name: show,
      text: postText,
      created_at: timestampISO,
      updated_at: timestampISO,
      embed_id: embedInfo.id,
      embed_source: embedInfo.source,
      embed_account: embedInfo.account
    };
    const newPost = await insertPost(postData);
    const createdAt = newPost?.created_at ?? null;
    const timestampSlug = createdAt?.valueOf().toString();
    if (!timestampSlug) {
      return { sucess: false };
    } else {
      redirect(303, `/user/${username}/now-playing/${timestampSlug}`);
    }
  }
};
export {
  actions,
  load
};

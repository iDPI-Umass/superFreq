import { r as redirect } from "../../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { a as insertPost } from "../../../../../chunks/posts.js";
import { g as getListenUrlData, v as validStringCheck } from "../../../../../chunks/parseData.js";
const load = async ({ parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const { profile } = await parent();
  const username = profile?.username ?? null;
  if (!session.session) {
    throw redirect(307, "/");
  } else if (session.session && !username) {
    throw redirect(307, "/account/create-profile");
  }
};
const actions = {
  parseListenUrl: async ({ request }) => {
    const data = await request.formData();
    const listenUrlString = data.get("listen-url");
    const embedInfo = await getListenUrlData(listenUrlString);
    return { embedInfo, success: true };
  },
  post: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
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
    const { username, createdAt } = await insertPost(postData);
    const timestampSlug = createdAt?.toISOString();
    const timestamp = Date.parse(timestampSlug).toString();
    if (!timestampSlug) {
      return { success: false };
    } else {
      redirect(303, `/posts/${username}/now-playing/${timestamp}`);
    }
  }
};
export {
  actions,
  load
};

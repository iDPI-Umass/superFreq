import { parseISO } from "date-fns";
import { parseHTML } from "linkedom";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkUnlink from "remark-unlink";
import remarkStringify from "remark-stringify";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
function validStringCheck(value) {
  if (value && value.length > 0) {
    return value;
  } else return null;
}
const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
const timestampISO = parseISO(timestampISOString);
const options = {
  year: "numeric",
  month: "long",
  day: "numeric"
};
const displayDate = (date) => {
  return new Date(date).toLocaleDateString(void 0, options);
};
function parseTimestamp(itemTimestamp) {
  const timestampString = itemTimestamp.toISOString();
  const timestamp = Date.parse(timestampString).toString();
  return timestamp;
}
const parseMarkdown = async function(text) {
  const parsedText = await unified().use(remarkParse).use(remarkUnlink).use(remarkStringify).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeStringify).process(text);
  const formattedText = parsedText ? parsedText : "";
  return formattedText;
};
const mbidCategoryTable = {
  "artists": "artist_mbid",
  "release-groups": "release_group_mbid",
  "release_groups": "release_group_mbid",
  "recordings": "recording_mbid",
  "albums": "release_group_mbid",
  "tracks": "recording_mbid",
  "songs": "recording_mbid"
};
const prepareMusicMetadataInsert = function(collectionItems) {
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  let recordingsMetadata = [];
  for (const item in collectionItems) {
    const thisItem = collectionItems[item];
    const itemType = thisItem["item_type"];
    const existsInDatabase = thisItem["original_id"] ? true : false;
    if (itemType && !existsInDatabase) {
      if (thisItem["artist_mbid"]) {
        artistsMetadata = [...artistsMetadata, {
          "artist_mbid": thisItem["artist_mbid"],
          "artist_name": thisItem["artist_name"],
          "added_at": timestampISO
        }];
      }
      if (itemType.includes("release_group") && thisItem["release_group_mbid"]) {
        releaseGroupsMetadata = [...releaseGroupsMetadata, {
          "artist_mbid": thisItem["artist_mbid"],
          "release_group_mbid": thisItem["release_group_mbid"],
          "release_group_name": thisItem["release_group_name"],
          "release_date": thisItem["release_date"],
          "label": thisItem["label_name"],
          "img_url": thisItem["img_url"],
          "last_fm_img_url": thisItem["last_fm_img_url"],
          "added_at": timestampISO
        }];
      } else if (itemType.includes("recording") && thisItem["recording_mbid"]) {
        releaseGroupsMetadata = [...releaseGroupsMetadata, {
          "artist_mbid": thisItem["artist_mbid"],
          "release_group_mbid": thisItem["release_group_mbid"],
          "release_group_name": thisItem["release_group_name"],
          "release_date": thisItem["release_date"],
          "label": thisItem["label"],
          "img_url": thisItem["img_url"],
          "last_fm_img_url": thisItem["last_fm_img_url"],
          "added_at": timestampISO
        }];
        recordingsMetadata = [...recordingsMetadata, {
          "artist_mbid": thisItem["artist_mbid"],
          "recording_mbid": thisItem["recording_mbid"],
          "recording_name": thisItem["recording_name"],
          "remixer_artist_mbid": thisItem["remixer_artist_mbid"],
          "release_date": thisItem["release_date"],
          "added_at": timestampISO
        }];
      }
    }
  }
  return { artistsMetadata, releaseGroupsMetadata, recordingsMetadata };
};
const prepareAvatarMetadataInsert = function(avatarItem) {
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  artistsMetadata = [...artistsMetadata, {
    "artist_mbid": avatarItem["artist_mbid"],
    "artist_name": avatarItem["artist_name"],
    "added_at": timestampISO
  }];
  releaseGroupsMetadata = [...releaseGroupsMetadata, {
    "artist_mbid": avatarItem["artist_mbid"],
    "release_group_mbid": avatarItem["release_group_mbid"],
    "release_group_name": avatarItem["release_group_name"],
    "release_date": avatarItem["release_date"],
    "label": avatarItem["label_name"],
    "img_url": avatarItem["img_url"],
    "last_fm_img_url": avatarItem["last_fm_img_url"],
    "added_at": timestampISO
  }];
  return { artistsMetadata, releaseGroupsMetadata };
};
const populateCollectionContents = function(sessionUserId, collectionItems, collectionId) {
  let collectionContents = [];
  for (const [index, item] of collectionItems.entries()) {
    const thisItem = item;
    const changelog = thisItem.changelog ?? {};
    const itemPosition = thisItem.item_position == null ? null : index;
    changelog[timestampISOString] = {
      "updated_at": timestampISO,
      "item_position": itemPosition,
      "notes": thisItem["notes"]
    };
    if (thisItem.original_id != null) {
      collectionContents = [...collectionContents, {
        "id": thisItem["original_id"],
        "collection_id": collectionId,
        "inserted_at": thisItem["inserted_at"] ?? timestampISO,
        "inserted_by": thisItem["inserted_by"],
        "updated_at": timestampISO,
        "updated_by": sessionUserId,
        "artist_mbid": thisItem["artist_mbid"],
        "release_group_mbid": thisItem["release_group_mbid"],
        "recording_mbid": thisItem["recording_mbid"],
        "item_position": itemPosition,
        "item_type": thisItem["item_type"],
        "notes": thisItem["notes"],
        "user_added_metadata_id": thisItem["user_added_metadata_id"] ?? null,
        "changelog": changelog
      }];
    } else {
      collectionContents = [...collectionContents, {
        "collection_id": collectionId,
        "inserted_at": thisItem["inserted_at"] ?? timestampISO,
        "inserted_by": sessionUserId,
        "updated_at": timestampISO,
        "updated_by": sessionUserId,
        "artist_mbid": thisItem["artist_mbid"],
        "release_group_mbid": thisItem["release_group_mbid"],
        "recording_mbid": thisItem["recording_mbid"],
        "item_position": itemPosition,
        "item_type": thisItem["item_type"],
        "notes": thisItem["notes"],
        "user_added_metadata_id": thisItem["user_added_metadata_id"] ?? null,
        "changelog": changelog
      }];
    }
  }
  return collectionContents;
};
const parseUrlSource = function(listenUrlString) {
  const linkTokens = listenUrlString.split("/");
  for (const token of linkTokens) {
    if (token.includes("youtu.be")) {
      return "youtube";
    }
    if (token.includes(".com")) {
      const domain = token.split(".");
      return domain[domain.length - 2].toLowerCase();
    }
  }
  return "";
};
const listenUrlSourceWhitelist = [
  "bandcamp",
  "soundcloud",
  "youtube",
  "mixcloud"
];
const listenUrlWhitelistCheck = function(urlString) {
  const urlSource = parseUrlSource(urlString ?? "");
  const approved = listenUrlSourceWhitelist.includes(urlSource) ? true : false;
  return approved;
};
const getListenUrlData = async function(listenUrlString) {
  if (!listenUrlString) {
    const embedInfo = {
      "id": null,
      "source": null,
      "title": null,
      "artist": null,
      "account": null
    };
    return embedInfo;
  }
  const urlSource = parseUrlSource(listenUrlString);
  async function getHtml(listenUrl) {
    const response = await fetch(listenUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    return await response.text();
  }
  async function parseBandcampHtml(html) {
    const { document } = await parseHTML(html);
    const embedLink = document.head.querySelector('meta[property="og:video"]').content;
    const embedAccount = document.head.querySelector('meta[property="og:site_name"]').content;
    const embedElements = embedLink.split("/");
    let id = "";
    for (const element of embedElements) {
      if (element.includes("album=") || element.includes("track=")) {
        id = element;
        break;
      }
    }
    const pageTitle = document.title;
    const titleElements = pageTitle.split(" | ");
    const itemTitle = titleElements[0];
    const itemArtist = titleElements[1];
    const itemInfo = {
      "url": listenUrlString,
      "id": id,
      "source": "bandcamp",
      "title": itemTitle,
      "artist": itemArtist,
      "account": embedAccount
    };
    return itemInfo;
  }
  async function parseSoundcloudHtml(html) {
    const { document } = await parseHTML(html);
    const embedLink = document.head.querySelector('meta[property="twitter:app:url:googleplay"]').content;
    const elements = embedLink.split(":");
    const itemId = elements[2];
    const pageTitle = document.title;
    const titleElements = pageTitle.split(" | ");
    const info = titleElements[0].split(" by ");
    const itemTitle = info[0].replace("Stream ", "");
    const itemAccount = info[1];
    const itemInfo = {
      "url": listenUrlString,
      "id": itemId,
      "source": "soundcloud",
      "title": itemTitle,
      "artist": null,
      "account": itemAccount
    };
    return itemInfo;
  }
  async function parseYouTubeHtml(html, listenUrlString2) {
    let itemId = listenUrlString2.includes("youtu.be") ? listenUrlString2.split("/")[3].split("?")[0] : listenUrlString2.split("=")[1];
    if (itemId.includes("&")) {
      const elements = itemId.split("&");
      itemId = elements[0];
    }
    const { document } = await parseHTML(html);
    const pageTitle = document.title;
    let title = null;
    let artist = null;
    if (pageTitle.includes(" - ")) {
      const elements = pageTitle.split(" - ");
      artist = elements[0];
      title = elements[1];
    }
    const itemInfo = {
      "url": listenUrlString2,
      "id": itemId,
      "source": "youtube",
      "title": title ?? pageTitle,
      "artist": artist,
      "account": null
    };
    return itemInfo;
  }
  if (urlSource == "bandcamp") {
    const listenUrl = new URL(listenUrlString);
    const html = await getHtml(listenUrl);
    const embedInfo = await parseBandcampHtml(html);
    return embedInfo;
  } else if (urlSource == "soundcloud") {
    const listenUrl = new URL(listenUrlString);
    const html = await getHtml(listenUrl);
    const embedInfo = await parseSoundcloudHtml(html);
    return embedInfo;
  } else if (urlSource == "youtube") {
    const listenUrl = new URL(listenUrlString);
    const html = await getHtml(listenUrl);
    const embedInfo = await parseYouTubeHtml(html, listenUrlString);
    return embedInfo;
  } else {
    const embedInfo = {
      "id": null,
      "source": null,
      "title": null,
      "artist": null,
      "account": null
    };
    return embedInfo;
  }
};
export {
  prepareMusicMetadataInsert as a,
  populateCollectionContents as b,
  parseTimestamp as c,
  parseMarkdown as d,
  displayDate as e,
  getListenUrlData as g,
  listenUrlWhitelistCheck as l,
  mbidCategoryTable as m,
  prepareAvatarMetadataInsert as p,
  timestampISO as t,
  validStringCheck as v
};

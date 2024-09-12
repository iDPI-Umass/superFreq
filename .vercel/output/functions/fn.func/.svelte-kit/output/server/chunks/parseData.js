import "./index.js";
import { parseISO } from "date-fns";
import { parseHTML } from "linkedom";
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
const prepareMusicMetadataInsert = function(collectionItems, collectionType) {
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  let recordingsMetadata = [];
  for (const item in collectionItems) {
    const thisItem = collectionItems[item];
    if (collectionType == "artists") {
      artistsMetadata = [...artistsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "artist_name": thisItem["artist_name"],
        "added_at": timestampISO
      }];
    } else if (collectionType == "release_groups") {
      console.log(thisItem["artist_name"]);
      artistsMetadata = [...artistsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "artist_name": thisItem["artist_name"],
        "added_at": timestampISO
      }];
      releaseGroupsMetadata = [...releaseGroupsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "release_group_mbid": thisItem["release_group_mbid"],
        "release_group_name": thisItem["release_group_name"],
        "release_date": thisItem["release_date"],
        "label": thisItem["label_name"],
        "img_url": thisItem["img_url"],
        "added_at": timestampISO
      }];
      console.log(thisItem["release_group_name"]);
    } else if (collectionType == "recordings") {
      artistsMetadata = [...artistsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "artist_name": thisItem["artist_name"],
        "added_at": timestampISO
      }];
      releaseGroupsMetadata = [...releaseGroupsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "release_group_mbid": thisItem["release_group_mbid"],
        "release_group_name": thisItem["release_group_name"],
        "release_date": thisItem["release_fate"],
        "label": thisItem["label"],
        "img_url": thisItem["img_url"],
        "added_at": timestampISO
      }];
      recordingsMetadata = [...recordingsMetadata, {
        "artist_mbid": thisItem["artist_mbid"],
        "recording_mbid": thisItem["recording_mbid"],
        "recording_name": thisItem["recording_name"],
        "remixer_mbid": thisItem["remixer_mbid"],
        "release_date": thisItem["release_date"],
        "added_at": timestampISO
      }];
    }
  }
  return { artistsMetadata, releaseGroupsMetadata, recordingsMetadata };
};
const populateCollectionContents = function(collectionItems, collectionId) {
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
    collectionContents = [...collectionContents, {
      "collection_id": collectionId,
      "inserted_at": thisItem["inserted_at"] ?? timestampISO,
      "updated_at": timestampISO,
      "artist_mbid": thisItem["artist_mbid"],
      "release_group_mbid": thisItem["release_group_mbid"],
      "recording_mbid": thisItem["recording_mbid"],
      "item_position": itemPosition,
      "notes": thisItem["notes"],
      "changelog": changelog
    }];
  }
  return collectionContents;
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
  function parseUrlSource(listenUrlString2) {
    const linkSplit = listenUrlString2.split("/");
    for (const element of linkSplit) {
      if (element.includes("youtu.be")) {
        return "youtube";
      }
      if (element.includes(".com")) {
        const domain = element.split(".");
        return domain[domain.length - 2];
      }
    }
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
      console.log(element);
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
    const itemId = listenUrlString2.split("=")[1];
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
  populateCollectionContents as a,
  displayDate as d,
  getListenUrlData as g,
  prepareMusicMetadataInsert as p,
  timestampISO as t
};

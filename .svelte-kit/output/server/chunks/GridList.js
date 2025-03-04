import { k as sanitize_props, o as spread_props, n as slot, b as push, p as pop, g as await_block, j as bind_props, d as ensure_array_like, f as attr, t as to_class, i as clsx, e as escape_html, s as stringify } from "./index2.js";
import { I as Icon } from "./Icon.js";
import { w as wave } from "./freq-wave.js";
import { C as CoverArt } from "./CoverArt.js";
import "clsx";
import { D as Disc_2, M as Music, B as Boom_box } from "./boom-box.js";
import { l as listenUrlWhitelistCheck } from "./parseData.js";
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var FEATURE_FLAG_NAMES = Object.freeze({
  // This flag exists as a workaround for issue 454 (basically a browser bug) - seems like these rect values take time to update when in grid layout. Setting it to true can cause strange behaviour in the REPL for non-grid zones, see issue 470
  USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT: "USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT"
});
_defineProperty({}, FEATURE_FLAG_NAMES.USE_COMPUTED_STYLE_INSTEAD_OF_BOUNDING_RECT, false);
var _ID_TO_INSTRUCTION;
var INSTRUCTION_IDs$1 = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs$1.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list"), _ID_TO_INSTRUCTION;
function Grip($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "12", "cy": "5", "r": "1" }],
    ["circle", { "cx": "19", "cy": "5", "r": "1" }],
    ["circle", { "cx": "5", "cy": "5", "r": "1" }],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "1" }
    ],
    [
      "circle",
      { "cx": "19", "cy": "12", "r": "1" }
    ],
    ["circle", { "cx": "5", "cy": "12", "r": "1" }],
    [
      "circle",
      { "cx": "12", "cy": "19", "r": "1" }
    ],
    [
      "circle",
      { "cx": "19", "cy": "19", "r": "1" }
    ],
    ["circle", { "cx": "5", "cy": "19", "r": "1" }]
  ];
  Icon($$payload, spread_props([
    { name: "grip" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Palette($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      {
        "cx": "13.5",
        "cy": "6.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "17.5",
        "cy": "10.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "8.5",
        "cy": "7.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "circle",
      {
        "cx": "6.5",
        "cy": "12.5",
        "r": ".5",
        "fill": "currentColor"
      }
    ],
    [
      "path",
      {
        "d": "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "palette" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function CollectionItemTag($$payload, $$props) {
  push();
  let { display = true, itemType } = $$props;
  if (display) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="inline-block svelte-1gm6lgu"><div class="collection-item-tag svelte-1gm6lgu">`;
    if (itemType && itemType.includes("artist")) {
      $$payload.out += "<!--[-->";
      Palette($$payload, {
        size: "12",
        color: "var(--freq-color-text-medium-dark)"
      });
      $$payload.out += `<!----> <span>artist</span>`;
    } else if (itemType && itemType.includes("release_group")) {
      $$payload.out += "<!--[1-->";
      Disc_2($$payload, {
        size: "12",
        color: "var(--freq-color-text-medium-dark)"
      });
      $$payload.out += `<!----> <span>album</span>`;
    } else if (itemType && itemType.includes("recording")) {
      $$payload.out += "<!--[2-->";
      Music($$payload, {
        size: "12",
        color: "var(--freq-color-text-medium-dark)"
      });
      $$payload.out += `<!----> <span>track</span>`;
    } else if (itemType && itemType.includes("episode")) {
      $$payload.out += "<!--[3-->";
      Boom_box($$payload, {
        size: "12",
        color: "var(--freq-color-text-medium-dark)"
      });
      $$payload.out += `<!----> <span>mix</span>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<span>item</span>`;
    }
    $$payload.out += `<!--]--></div></span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function itemAttribution($$payload, item, status) {
  if (status == "open") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a class="attribution svelte-917sxt"${attr("href", `/user/${stringify(item.inserted_by_username)}`)}>${escape_html(item.inserted_by_display_name)}</a>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function GridList($$payload, $$props) {
  push();
  let {
    collectionContents = [],
    deletedItems = [],
    collectionReturned,
    collectionType,
    // "artists" | "release_groups" | "recordings" | "labels"
    collectionStatus = "public",
    // "open", "public", "private", "deleted"
    showTags = true,
    layout,
    // "grid" | "condensed-grid" | "list"
    mode,
    // "view" | "edit"
    imgPromise = null
  } = $$props;
  const format = {
    "grid": ["media-grid", "media-grid-item"],
    "list": ["media-list", "media-list-item"],
    "condensed-grid": ["media-grid-condensed", "media-grid-item"]
  };
  function ariaLabel(item, itemType) {
    let text = "";
    if (itemType.includes("artist")) {
      text = item["artistName"];
    } else if (itemType.includes("release_group")) {
      text = `${item["release_group_name"]} by ${item["artist_name"]}`;
    } else if (itemType.includes("recording")) {
      text = `${item["recording_name"]} by ${item["artist_name"]}`;
    }
    return text;
  }
  function altText(item, itemType) {
    let text = "";
    if (itemType.includes("release_group")) {
      text = `${item["release_group_name"]}" by ${item["artist_name"]}`;
    } else if (itemType.includes("recording")) {
      text = `"${item["recording_name"]}" by ${item["artist_name"]}`;
    }
    return text;
  }
  let items = collectionContents;
  const undersizedCollection = mode == "view" && (layout == "grid" && collectionContents.length < 6) || layout == "condensed-grid" && collectionContents.length < 4 ? true : false;
  function getGridSpacers(items2, layout2) {
    const spacesArray = [];
    if (!undersizedCollection || layout2 == "list") {
      return spacesArray;
    }
    const remainingSpaces = layout2 == "grid" ? items2.length % 6 : items2.length % 4;
    let n = 0;
    while (n < remainingSpaces) {
      spacesArray.push(n);
      n++;
    }
    return spacesArray;
  }
  const gridSpacers = getGridSpacers(items, layout);
  function editorInteractions($$payload2, item, labelText) {
    $$payload2.out += `<div class="editor-interactions svelte-917sxt"><button class="standard svelte-917sxt">x remove</button> <div${attr("aria-label", `drag-handle for ${stringify(labelText)}`)} class="handle">`;
    Grip($$payload2, {
      size: "20",
      color: "var(--freq-color-text-muted)"
    });
    $$payload2.out += `<!----></div></div>`;
  }
  function editorItemImage($$payload2, item, altText2) {
    $$payload2.out += `<!---->`;
    await_block(
      imgPromise,
      () => {
        $$payload2.out += `<img${attr("src", wave)} alt="loading cover art">`;
      },
      () => {
        $$payload2.out += `<img${attr("src", item["img_url"] ?? item["last_fm_img_url"] ?? wave)}${attr("alt", `${stringify(item["img_url"] ? altText2 : "no available")} cover art`)}>`;
      }
    );
    $$payload2.out += `<!---->`;
  }
  function coverArt($$payload2, item, itemType, mode2) {
    if (itemType.includes("release_group") && mode2 == "edit") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<!---->`;
      {
        if (item["img_url"] != null || item["last_fm_img_url"] != null) {
          $$payload2.out += "<!--[-->";
          CoverArt($$payload2, {
            item,
            altText: `"${item["release_group_name"]}" by ${item["artist_name"]}`
          });
        } else if (item["img_url"] == null && item["last_fm_img_url"] == null) {
          $$payload2.out += "<!--[1-->";
          editorItemImage($$payload2, item, item["release_group_name"]);
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]-->`;
      }
      $$payload2.out += `<!---->`;
    } else if (itemType.includes("release_group") && mode2 == "view") {
      $$payload2.out += "<!--[1-->";
      CoverArt($$payload2, { item, altText: item["release_group_name"] });
    } else if (itemType.includes("recording") && mode2 == "edit") {
      $$payload2.out += "<!--[2-->";
      $$payload2.out += `<!---->`;
      {
        if (item["img_url"] != null || item["last_fm_img_url"] != null) {
          $$payload2.out += "<!--[-->";
          CoverArt($$payload2, {
            item,
            altText: altText(item, collectionType ?? item["item_type"])
          });
        } else if (item["img_url"] == null && item["last_fm_img_url"] == null) {
          $$payload2.out += "<!--[1-->";
          editorItemImage($$payload2, item, item["recording_name"]);
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]-->`;
      }
      $$payload2.out += `<!---->`;
    } else if (itemType.includes("recording") && mode2 == "view") {
      $$payload2.out += "<!--[3-->";
      CoverArt($$payload2, { item, altText: item["recording_name"] });
    } else if (itemType.includes("episode")) {
      $$payload2.out += "<!--[4-->";
      CoverArt($$payload2, { item, altText: item["episode_title"] });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  function metadataBlurb($$payload2, item, itemType, mode2) {
    if (itemType.includes("artist")) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<span class="artist">`;
      CollectionItemTag($$payload2, { display: showTags, itemType });
      $$payload2.out += `<!----> `;
      if (item["artist_mbid"] && item["artist_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/artist/${item["artist_mbid"]}`)}>${escape_html(item["artist_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["artist_name"] ?? item["user_added_artist_name"])}`;
      }
      $$payload2.out += `<!--]--></span>`;
    } else if (itemType.includes("release_group")) {
      $$payload2.out += "<!--[1-->";
      CollectionItemTag($$payload2, { display: showTags, itemType });
      $$payload2.out += `<!----> <span class="title">`;
      if (item["release_group_mbid"] && item["release_group_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/release-group/${item["release_group_mbid"]}`)}>${escape_html(item["release_group_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["release_group_name"] ?? item["user_added_release_group_name"])}`;
      }
      $$payload2.out += `<!--]--></span> <span class="artist">`;
      if (item["artist_mbid"] && item["artist_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/artist/${item["artist_mbid"]}`)}>${escape_html(item["artist_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["artist_name"] ?? item["user_added_artist_name"])}`;
      }
      $$payload2.out += `<!--]--></span>`;
    } else if (itemType.includes("recording")) {
      $$payload2.out += "<!--[2-->";
      CollectionItemTag($$payload2, { display: showTags, itemType });
      $$payload2.out += `<!----> <span class="title">`;
      if (item["recording_mbid"] && item["recording_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/recording/${item["recording_mbid"]}`)}>${escape_html(item["recording_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["recording_name"] ?? item["user_added_recording_name"])}`;
      }
      $$payload2.out += `<!--]--></span> <span class="artist">`;
      if (item["artist_mbid"] && item["artist_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/artist/${item["artist_mbid"]}`)}>${escape_html(item["artist_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["artist_name"] ?? item["user_added_artist_name"])}`;
      }
      $$payload2.out += `<!--]--></span>`;
    } else if (itemType.includes("episode")) {
      $$payload2.out += "<!--[3-->";
      CollectionItemTag($$payload2, { display: showTags, itemType });
      $$payload2.out += `<!----> <span class="title">`;
      if (item["user_added_listen_url"] && item["user_added_listen_url"].length > 0 && listenUrlWhitelistCheck(item["user_added_listen_url"]) && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", item["user_added_listen_url"])}>${escape_html(item["episode_title"] ?? item["user_added_episode_title"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["episode_title"] ?? item["user_added_episode_title"])}`;
      }
      $$payload2.out += `<!--]--></span> <span class="artist">`;
      if (item["artist_mbid"] && item["artist_mbid"].length > 0 && mode2 == "view") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `https://musicbrainz.org/artist/${item["artist_mbid"]}`)}>${escape_html(item["artist_name"])}</a>`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `${escape_html(item["artist_name"] ?? item["user_added_artist_name"])}`;
      }
      $$payload2.out += `<!--]--></span>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  function underSizedCollection($$payload2) {
    if (undersizedCollection) {
      $$payload2.out += "<!--[-->";
      const each_array = ensure_array_like(gridSpacers);
      $$payload2.out += `<!--[-->`;
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        each_array[$$index];
        $$payload2.out += `<div class="media-grid-item"></div>`;
      }
      $$payload2.out += `<!--]-->`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  $$payload.out += `<!---->`;
  await_block(
    collectionContents.length > 0,
    () => {
    },
    () => {
      if (mode == "edit") {
        $$payload.out += "<!--[-->";
        const each_array_1 = ensure_array_like(items);
        $$payload.out += `<ul aria-label="collection items"${attr("class", to_class(clsx(format[layout][0]), "svelte-917sxt"))}><!--[-->`;
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let contentItem = each_array_1[$$index_1];
          $$payload.out += `<li${attr("aria-label", ariaLabel(contentItem, contentItem["item_type"] ?? collectionType))}${attr("class", to_class(clsx(format[layout][1]), "svelte-917sxt"))}>`;
          coverArt($$payload, contentItem, contentItem["item_type"] ?? collectionType, mode);
          $$payload.out += `<!----> <div class="metadata-blurb">`;
          metadataBlurb($$payload, contentItem, contentItem["item_type"] ?? collectionType, mode);
          $$payload.out += `<!----></div> `;
          editorInteractions($$payload, contentItem, contentItem["recording_name"]);
          $$payload.out += `<!----></li>`;
        }
        $$payload.out += `<!--]--></ul>`;
      } else if (mode == "view") {
        $$payload.out += "<!--[1-->";
        const each_array_2 = ensure_array_like(collectionContents);
        $$payload.out += `<ul aria-label="collection items"${attr("class", to_class(clsx(format[layout][0]), "svelte-917sxt"))}><!--[-->`;
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let contentItem = each_array_2[$$index_2];
          $$payload.out += `<li${attr("class", to_class(clsx(format[layout][1]), "svelte-917sxt"))}>`;
          coverArt($$payload, contentItem, contentItem["item_type"] ?? collectionType, mode);
          $$payload.out += `<!----> <div class="metadata-blurb">`;
          metadataBlurb($$payload, contentItem, contentItem["item_type"] ?? collectionType, mode);
          $$payload.out += `<!----></div> `;
          itemAttribution($$payload, contentItem, collectionStatus);
          $$payload.out += `<!----></li>`;
        }
        $$payload.out += `<!--]--> `;
        underSizedCollection($$payload);
        $$payload.out += `<!----></ul>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
  );
  $$payload.out += `<!---->`;
  bind_props($$props, { collectionContents, deletedItems, imgPromise });
  pop();
}
export {
  CollectionItemTag as C,
  GridList as G
};

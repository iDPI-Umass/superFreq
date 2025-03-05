import { b as push, f as attr, j as bind_props, p as pop, c as copy_payload, a as assign_payload, e as escape_html } from "./index2.js";
import "./client.js";
import { C as CollectionItemTag, G as GridList } from "./GridList.js";
import { M as MusicBrainzSearch } from "./MusicBrainzSearch.js";
import "./parseData.js";
function ManualAddModal($$payload, $$props) {
  push();
  let {
    showModal = false,
    itemType,
    items = [],
    headerText
  } = $$props;
  let itemTemplate = {
    "artist_name": null,
    "release_group_name": null,
    "recording_name": null,
    "release_date": null,
    "label": null,
    "episode_title": null,
    "show_title": null,
    "listen_url": null
  };
  let newItem = itemTemplate;
  items.length ?? 0;
  $$payload.out += `<dialog aria-label="modal" class="svelte-ayvj0y"><div class="dialog-header svelte-ayvj0y"><h2 class="svelte-ayvj0y">`;
  headerText?.($$payload);
  $$payload.out += `<!----></h2> <button aria-label="close modal" formmethod="dialog" class="svelte-ayvj0y">x</button></div> <form class="vertical"><input type="hidden" name="item-type" id="item-type"${attr("value", itemType)}> <div class="label-group"><label class="text-label" for="artist">artist</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="artist" id="artist"${attr("value", newItem.artist_name)} required> `;
  if (itemType == "recording") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="label-group"><label class="text-label" for="recording">track</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="recording" id="recording"${attr("value", newItem.recording_name)} required>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (itemType == "release_group" || itemType == "recording") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="label-group"><label class="text-label" for="release_group">album</label> `;
    if (itemType == "release_group") {
      $$payload.out += "<!--[-->";
      $$payload.out += `<span class="label-explainer">* required</span>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div> <input class="text" type="text" name="release_group" id="release_group"${attr("value", newItem.release_group_name)} required> <label class="text-label" for="release_date">release date</label> <input class="text" type="text" name="release_date" id="release_date"${attr("value", newItem.release_date)}> <label class="text-label" for="label">label</label> <input class="text" type="text" name="label" id="label"${attr("value", newItem.label)}>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (itemType == "episode") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="label-group"><label class="text-label" for="episode_title">episode / dj mix title</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="episode_title" id="episode_title"${attr("value", newItem.episode_title)} required> <div class="label-group"><label class="text-label" for="show_title">show name / mix series</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="show_title" id="show_title"${attr("value", newItem.show_title)} required> <div class="label-group"><label class="text-label" for="listen_url">listen URL</label></div> <input class="text" type="text" name="listen_url" id="listen_url"${attr("value", newItem.listen_url)}>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="standard" type="button">add item</button></form></dialog>`;
  bind_props($$props, { showModal, items });
  pop();
}
function CollectionEditor($$payload, $$props) {
  push();
  let {
    collectionType,
    collectionStatus,
    mode = "",
    // artists || release_groups || recordings
    collectionItems = [],
    deletedItems = [],
    itemAdded = false,
    formAction,
    imgPromise = null
  } = $$props;
  const categoryLookup = {
    "": "...",
    "artist": "artists",
    "artists": "artists",
    "release_group": "albums",
    "release_groups": "albums",
    "recording": "tracks",
    "recordings": "tracks",
    "episode": "episode",
    "mix": "episode"
  };
  let itemType = mode ?? "";
  let itemLookup = {
    "": "item",
    "artist": "artist",
    "artists": "artist",
    "release_group": "album",
    "release_groups": "album",
    "recording": "track",
    "recordings": "track",
    "episode": "episode or mix",
    "episodes": "episode or mix"
  };
  let searchCategoryLookup = {
    "": "",
    "artist": "artists",
    "artists": "artists",
    "album": "release_groups",
    "albums": "release_groups",
    "release_group": "release_groups",
    "release_groups": "release_groups",
    "track": "recordings",
    "tracks": "recordings",
    "recording": "recordings",
    "recordings": "recordings",
    "episode": "episode",
    "episodes": "episode",
    "mix": "episode",
    "mixes": "episode"
  };
  let showManualAddModal = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="collection-search">`;
    if (!mode?.includes("artist") && !mode?.includes("release_group") && !mode?.includes("recording")) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="form-column svelte-e1wkfd"><fieldset class="search svelte-e1wkfd"><legend>Add `;
      CollectionItemTag($$payload2, { itemType: searchCategoryLookup[itemType] });
      $$payload2.out += `<!----> to your collection</legend> <ul><li><input class="radio" type="radio" name="item-type" id="artist" value="artist"${attr("checked", itemType === "artist", true)}> <label for="artist">artist</label></li> <li><input class="radio" type="radio" name="item-type" id="release_group" value="release_group"${attr("checked", itemType === "release_group", true)}> <label for="release_group">album</label></li> <li><input class="radio" type="radio" name="item-type" id="recording" value="recording"${attr("checked", itemType === "recording", true)}> <label for="recording">track</label></li> <li><input class="radio" type="radio" name="item-type" id="episode" value="episode"${attr("checked", itemType === "episode", true)}> <label for="episode">Episode / DJ Mix</label></li></ul></fieldset></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <div class="form-column svelte-e1wkfd">`;
    if (itemType != "episode") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="collection-search-bar"><span class="search-tooltip">search for <em>${escape_html(itemLookup[itemType])}</em> to add info automatically</span> `;
      MusicBrainzSearch($$payload2, {
        searchCategory: searchCategoryLookup[itemType],
        searchButtonText: `search ${categoryLookup[itemType]}`,
        searchPlaceholder: `search ${categoryLookup[itemType]}`,
        mode: "collection",
        get addedItems() {
          return collectionItems;
        },
        set addedItems($$value) {
          collectionItems = $$value;
          $$settled = false;
        },
        get deletedItems() {
          return deletedItems;
        },
        set deletedItems($$value) {
          deletedItems = $$value;
          $$settled = false;
        },
        get newItemAdded() {
          return itemAdded;
        },
        set newItemAdded($$value) {
          itemAdded = $$value;
          $$settled = false;
        },
        get imgPromise() {
          return imgPromise;
        },
        set imgPromise($$value) {
          imgPromise = $$value;
          $$settled = false;
        }
      });
      $$payload2.out += `<!----></div> <span class="or svelte-e1wkfd">— or —</span>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <span class="search-tooltip">add <em>${escape_html(itemLookup[itemType])}</em> info yourself</span> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<!---->manually add ${escape_html(itemLookup[itemType])}`;
      };
      ManualAddModal($$payload2, {
        itemType,
        get showModal() {
          return showManualAddModal;
        },
        set showModal($$value) {
          showManualAddModal = $$value;
          $$settled = false;
        },
        get items() {
          return collectionItems;
        },
        set items($$value) {
          collectionItems = $$value;
          $$settled = false;
        },
        headerText,
        $$slots: { headerText: true }
      });
    }
    $$payload2.out += `<!----> <div class="manual-add-button svelte-e1wkfd"><button class="double-border-top"${attr("disabled", itemType == "", true)}><div class="inner-border">Add ${escape_html(itemLookup[itemType])} manually</div></button></div></div></div> <div class="bottom-double-border"></div> `;
    GridList($$payload2, {
      collectionType,
      collectionStatus,
      layout: "list",
      mode: "edit",
      get collectionContents() {
        return collectionItems;
      },
      set collectionContents($$value) {
        collectionItems = $$value;
        $$settled = false;
      },
      get deletedItems() {
        return deletedItems;
      },
      set deletedItems($$value) {
        deletedItems = $$value;
        $$settled = false;
      },
      get imgPromise() {
        return imgPromise;
      },
      set imgPromise($$value) {
        imgPromise = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    collectionItems,
    deletedItems,
    itemAdded,
    imgPromise
  });
  pop();
}
export {
  CollectionEditor as C
};

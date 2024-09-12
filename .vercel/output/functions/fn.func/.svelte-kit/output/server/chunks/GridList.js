import { d as null_to_empty } from "./utils.js";
import { c as create_ssr_component, v as validate_component, f as escape, h as each, d as add_attribute } from "./ssr.js";
import { I as Icon } from "./Icon.js";
/* empty css                    */
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
var INSTRUCTION_IDs = {
  DND_ZONE_ACTIVE: "dnd-zone-active",
  DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
_ID_TO_INSTRUCTION = {}, _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_ACTIVE, "Tab to one the items and press space-bar or enter to start dragging it"), _defineProperty(_ID_TO_INSTRUCTION, INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED, "This is a disabled drag and drop list"), _ID_TO_INSTRUCTION;
const Grip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "5", "r": "1" }],
    ["circle", { "cx": "19", "cy": "5", "r": "1" }],
    ["circle", { "cx": "5", "cy": "5", "r": "1" }],
    ["circle", { "cx": "12", "cy": "12", "r": "1" }],
    ["circle", { "cx": "19", "cy": "12", "r": "1" }],
    ["circle", { "cx": "5", "cy": "12", "r": "1" }],
    ["circle", { "cx": "12", "cy": "19", "r": "1" }],
    ["circle", { "cx": "19", "cy": "19", "r": "1" }],
    ["circle", { "cx": "5", "cy": "19", "r": "1" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "grip" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const logo = "/_app/immutable/assets/freq-logo-dark.DO3XIE_t.png";
const css = {
  code: "li.svelte-o2owaj{display:flex;flex-direction:row;gap:0.25em;margin:auto 0}button.standard.svelte-o2owaj{display:flex;flex-direction:row;flex-wrap:none;border-style:none;margin:auto}.item-data.svelte-o2owaj{display:flex}.editor-interactions.svelte-o2owaj{display:flex;flex-direction:row;width:200px;align-items:center;margin-right:0}",
  map: '{"version":3,"file":"GridList.svelte","sources":["GridList.svelte"],"sourcesContent":["<!-- \\n    Component for switchable grid/list collection builder and view. Modes \\"new\\" and \\"edit\\" enable drag-and-drop functionality. The \\"svelte-dnd-action\\" package has keyboard interaction functionality and ARIA labels have been added to ensure clarity for screen reader users.\\n-->\\n\\n<script lang=\\"ts\\">import { flip } from \\"svelte/animate\\";\\nimport { dragHandleZone, dndzone, dragHandle } from \\"svelte-dnd-action\\";\\nimport Grip from \\"lucide-svelte/icons/grip\\";\\nimport logo from \\"$lib/assets/images/logo/freq-logo-dark.png\\";\\nimport \\"$lib/styles/media-grid-list.css\\";\\nimport \\"$lib/styles/metadata-formatting.css\\";\\nexport let collectionContents;\\nexport let deletedItems = [];\\nexport let collectionReturned;\\nexport let collectionType;\\nexport let layout;\\nexport let mode;\\nconst format = {\\n  \\"grid\\": [\\"media-grid\\", \\"media-grid-item\\"],\\n  \\"list\\": [\\"media-list\\", \\"media-list-item\\"],\\n  \\"condensed-grid\\": [\\"media-grid-condensed\\", \\"media-grid-item\\"]\\n};\\nlet items = collectionContents;\\nconsole.log(items);\\nconst flipDurationMs = 300;\\nfunction handleSort(e) {\\n  items = e.detail.items;\\n}\\nfunction handleFinalize(e) {\\n  const { items: newItems } = e.detail;\\n  items = newItems;\\n  collectionContents = newItems;\\n}\\nfunction updateIds(collectionContents2) {\\n  for (const [index, item] of collectionContents2.entries()) {\\n    item.id = index + 1;\\n  }\\n  console.log(collectionContents2);\\n}\\nfunction deleteItem(item) {\\n  items = items.filter((i) => i != item);\\n  for (const i of items) {\\n    i[\\"id\\"] = items.indexOf(i) + 1;\\n  }\\n  collectionContents = items;\\n  if (item.inserted_at) {\\n    item.item_position = null;\\n    deletedItems.push(item);\\n  }\\n}\\nconsole.log(collectionContents);\\n<\/script>\\n\\n{#if ( collectionReturned || collectionContents.length > 0 ) && mode == \\"edit\\"}\\n    <ul \\n    aria-label=\\"collection items\\" \\n    class={format[layout][0]}\\n    use:dragHandleZone={{items, flipDurationMs}} \\n    on:consider={handleSort} \\n    on:finalize={handleFinalize}>\\n        {#if collectionType == \\"artists\\"}\\n            {#each items as contentItem, index(contentItem.id)}\\n            <li\\n                aria-label={contentItem[\\"artistName\\"]}\\n                animate:flip=\\"{{duration: flipDurationMs}}\\" \\n                class={format[layout][1]} \\n            >\\n            <div class=\\"metadata-blurb\\">\\n                <p>\\n                    {contentItem[\\"artist_name\\"]}\\n                </p>\\n            </div>\\n                <div class=\\"editor-interactions\\">\\n                    <button class=\\"standard\\" on:click|preventDefault={() => deleteItem(contentItem)}>\\n                        x remove\\n                    </button>\\n                    <div use:dragHandle aria-label=\\"drag-handle for {contentItem[\\"artist_name\\"]}\\" class=\\"handle\\">\\n                        <Grip size=\\"20\\" color=var(--freq-color-text-muted)></Grip>\\n                    </div>\\n                </div>\\n            </li>\\n            {/each}\\n        {:else if collectionType == \\"release_groups\\" || collectionContents.length > 0 }\\n            {#each items as contentItem, index(contentItem.id)}\\n            <li \\n                aria-label=\\"{contentItem[\\"release_group_name\\"]} by ${contentItem[\\"artist_name\\"]}\\" \\n                animate:flip=\\"{{duration: flipDurationMs}}\\" \\n                class={format[layout][1]} \\n            >\\n                <img \\n                    src={contentItem[\\"img_url\\"] ?? \'\'} \\n                    alt=\\"{contentItem[\\"release_group_name\\"]} cover art\\"\\n                />\\n                <div class=\\"metadata-blurb\\">\\n                    <h2>\\n                        {contentItem[\\"release_group_name\\"]}\\n                    </h2>\\n                    <p>\\n                        {contentItem[\\"artist_name\\"]}\\n                    </p>\\n                </div>\\n                <div class=\\"editor-interactions\\">\\n                    <button class=\\"standard\\" on:click|preventDefault={() => deleteItem(contentItem)}>\\n                        x remove\\n                    </button>\\n                    <div use:dragHandle aria-label=\\"drag-handle for {contentItem[\\"release_group_name\\"]}\\" class=\\"handle\\">\\n                        <Grip size=\\"20\\" color=var(--freq-color-text-muted)></Grip>\\n                    </div>\\n                </div>\\n            </li>\\n            {/each}\\n        {:else if collectionType == \\"recordings\\" }\\n            {#each items as contentItem, index(contentItem.id)}\\n            <li \\n                aria-label=\\"{contentItem[\\"recording_name\\"]} by ${contentItem[\\"artist_name\\"]}\\" \\n                animate:flip=\\"{{duration: flipDurationMs}}\\" \\n                class={format[layout][0]}\\n            >\\n                <img src={contentItem[\\"imgUrl\\"]}  alt={contentItem[\\"recording_name\\"]} />\\n                <div class=\\"metadata-blurb\\">\\n                    <h2>{contentItem[\\"recording_name\\"]}</h2>\\n                    <p>{contentItem[\\"artist_name\\"]}</p>\\n                </div>\\n                <div class=\\"editor-interactions\\">\\n                    <button class=\\"standard\\" on:click|preventDefault={() => deleteItem(contentItem)}>\\n                        x remove\\n                    </button>\\n                    <div use:dragHandle aria-label=\\"drag-handle for {contentItem[\\"recording_name\\"]}\\" class=\\"handle\\">\\n                        <Grip size=\\"20\\" color=var(--freq-color-text-muted)></Grip>\\n                    </div>\\n                </div>\\n            </li>\\n            {/each}\\n        {/if}\\n    </ul>\\n{:else if ( collectionReturned || collectionContents.length > 0 ) && mode == \\"view\\" }\\n    {#if collectionType == \\"artists\\"}\\n        <div class={format[layout][0]}>\\n            {#each collectionContents as contentItem}\\n            <a href={`https://musicbrainz.org/artist/${contentItem[\\"artist_mbid\\"]}`}>\\n                <div class={format[layout][1]}>\\n                    <p>{contentItem[\\"artists\\"][\\"artist_name\\"]}</p>\\n                </div>\\n            </a>\\n            {/each}\\n        </div>\\n    {:else if collectionType == \\"release_groups\\"}\\n        <div class={format[layout][0]}>\\n            {#each collectionContents as contentItem}\\n            <div class={format[layout][1]}>\\n                    <img src={(\\n                        contentItem[\'img_url\'] && contentItem[\'img_url\'] != \'\') ? contentItem[\'img_url\'] : logo\\n                        } \\n                        alt={contentItem[\'release_group_name\']} />\\n                    <div class=\\"metadata-blurb\\">\\n                        <a href={`https://musicbrainz.org/release-group/${contentItem[\\"release_group_mbid\\"]}`}>\\n                            <h2>{contentItem[\\"release_group_name\\"]}</h2>\\n                        </a>\\n                        <a href={`https://musicbrainz.org/artist/${contentItem[\\"artist_mbid\\"]}`}>\\n                            <p>{contentItem[\\"artist_name\\"]}</p>\\n                        </a>\\n                    </div>\\n            </div>\\n            {/each}\\n        </div>\\n    {:else if collectionType == \\"recordings\\"}\\n        <div class={format[layout][0]}>\\n            {#each collectionContents as contentItem}\\n            <div class={format[layout][1]}>\\n                    <img src={contentItem[\\"release_groups\\"][\\"img_url\\"]}  alt={contentItem[\\"recordings\\"][\\"recording_name\\"]} />\\n                    <div class=\\"metata-blurb\\">\\n                        <a href={`https://musicbrainz.org/recording/${contentItem[\\"recording_mbid\\"]}`}>\\n                            <h2>{contentItem[\\"recordings\\"][\\"recording_name\\"]}</h2>\\n                        </a>\\n                        <a href={`https://musicbrainz.org/artist/${contentItem[\\"artist_mbid\\"]}`}>\\n                            <p>{contentItem[\\"artists\\"][\\"artist_name\\"]}</p>\\n                        </a>\\n                    </div>\\n            </div>\\n            {/each}\\n        </div>\\n    {/if}\\n{/if}\\n\\n<style>\\n    li {\\n        display: flex;\\n        flex-direction: row;\\n        gap: 0.25em;\\n        margin: auto 0;\\n    }\\n    button.standard {\\n        display: flex;\\n        flex-direction: row;\\n        flex-wrap: none;\\n        border-style: none;\\n        margin: auto;\\n    }\\n    .item-data {\\n        display: flex;\\n    }\\n    .editor-interactions {\\n        display: flex;\\n        flex-direction: row;\\n        width: 200px;\\n        align-items: center;\\n        margin-right: 0;\\n    }\\n</style>"],"names":[],"mappings":"AAwLI,gBAAG,CACC,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,GAAG,CAAE,MAAM,CACX,MAAM,CAAE,IAAI,CAAC,CACjB,CACA,MAAM,uBAAU,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,SAAS,CAAE,IAAI,CACf,YAAY,CAAE,IAAI,CAClB,MAAM,CAAE,IACZ,CACA,wBAAW,CACP,OAAO,CAAE,IACb,CACA,kCAAqB,CACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,KAAK,CAAE,KAAK,CACZ,WAAW,CAAE,MAAM,CACnB,YAAY,CAAE,CAClB"}'
};
const GridList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { collectionContents } = $$props;
  let { deletedItems = [] } = $$props;
  let { collectionReturned } = $$props;
  let { collectionType } = $$props;
  let { layout } = $$props;
  let { mode } = $$props;
  const format = {
    "grid": ["media-grid", "media-grid-item"],
    "list": ["media-list", "media-list-item"],
    "condensed-grid": ["media-grid-condensed", "media-grid-item"]
  };
  let items = collectionContents;
  console.log(items);
  console.log(collectionContents);
  if ($$props.collectionContents === void 0 && $$bindings.collectionContents && collectionContents !== void 0) $$bindings.collectionContents(collectionContents);
  if ($$props.deletedItems === void 0 && $$bindings.deletedItems && deletedItems !== void 0) $$bindings.deletedItems(deletedItems);
  if ($$props.collectionReturned === void 0 && $$bindings.collectionReturned && collectionReturned !== void 0) $$bindings.collectionReturned(collectionReturned);
  if ($$props.collectionType === void 0 && $$bindings.collectionType && collectionType !== void 0) $$bindings.collectionType(collectionType);
  if ($$props.layout === void 0 && $$bindings.layout && layout !== void 0) $$bindings.layout(layout);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  $$result.css.add(css);
  return `  ${(collectionReturned || collectionContents.length > 0) && mode == "edit" ? `<ul aria-label="collection items" class="${escape(null_to_empty(format[layout][0]), true) + " svelte-o2owaj"}">${collectionType == "artists" ? `${each(items, (contentItem, index) => {
    return `<li${add_attribute("aria-label", contentItem["artistName"], 0)} class="${escape(null_to_empty(format[layout][1]), true) + " svelte-o2owaj"}"><div class="metadata-blurb"><p>${escape(contentItem["artist_name"])} </p></div> <div class="editor-interactions svelte-o2owaj"><button class="standard svelte-o2owaj" data-svelte-h="svelte-1fx820u">x remove</button> <div aria-label="${"drag-handle for " + escape(contentItem["artist_name"], true)}" class="handle">${validate_component(Grip, "Grip").$$render(
      $$result,
      {
        size: "20",
        color: "var(--freq-color-text-muted)"
      },
      {},
      {}
    )} </div></div> </li>`;
  })}` : `${collectionType == "release_groups" || collectionContents.length > 0 ? `${each(items, (contentItem, index) => {
    return `<li aria-label="${escape(contentItem["release_group_name"], true) + " by $" + escape(contentItem["artist_name"], true)}" class="${escape(null_to_empty(format[layout][1]), true) + " svelte-o2owaj"}"><img${add_attribute("src", contentItem["img_url"] ?? "", 0)} alt="${escape(contentItem["release_group_name"], true) + " cover art"}"> <div class="metadata-blurb"><h2>${escape(contentItem["release_group_name"])}</h2> <p>${escape(contentItem["artist_name"])} </p></div> <div class="editor-interactions svelte-o2owaj"><button class="standard svelte-o2owaj" data-svelte-h="svelte-1fx820u">x remove</button> <div aria-label="${"drag-handle for " + escape(contentItem["release_group_name"], true)}" class="handle">${validate_component(Grip, "Grip").$$render(
      $$result,
      {
        size: "20",
        color: "var(--freq-color-text-muted)"
      },
      {},
      {}
    )} </div></div> </li>`;
  })}` : `${collectionType == "recordings" ? `${each(items, (contentItem, index) => {
    return `<li aria-label="${escape(contentItem["recording_name"], true) + " by $" + escape(contentItem["artist_name"], true)}" class="${escape(null_to_empty(format[layout][0]), true) + " svelte-o2owaj"}"><img${add_attribute("src", contentItem["imgUrl"], 0)}${add_attribute("alt", contentItem["recording_name"], 0)}> <div class="metadata-blurb"><h2>${escape(contentItem["recording_name"])}</h2> <p>${escape(contentItem["artist_name"])}</p></div> <div class="editor-interactions svelte-o2owaj"><button class="standard svelte-o2owaj" data-svelte-h="svelte-1fx820u">x remove</button> <div aria-label="${"drag-handle for " + escape(contentItem["recording_name"], true)}" class="handle">${validate_component(Grip, "Grip").$$render(
      $$result,
      {
        size: "20",
        color: "var(--freq-color-text-muted)"
      },
      {},
      {}
    )} </div></div> </li>`;
  })}` : ``}`}`}</ul>` : `${(collectionReturned || collectionContents.length > 0) && mode == "view" ? `${collectionType == "artists" ? `<div class="${escape(null_to_empty(format[layout][0]), true) + " svelte-o2owaj"}">${each(collectionContents, (contentItem) => {
    return `<a${add_attribute("href", `https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`, 0)}><div class="${escape(null_to_empty(format[layout][1]), true) + " svelte-o2owaj"}"><p>${escape(contentItem["artists"]["artist_name"])}</p></div> </a>`;
  })}</div>` : `${collectionType == "release_groups" ? `<div class="${escape(null_to_empty(format[layout][0]), true) + " svelte-o2owaj"}">${each(collectionContents, (contentItem) => {
    return `<div class="${escape(null_to_empty(format[layout][1]), true) + " svelte-o2owaj"}"><img${add_attribute(
      "src",
      contentItem["img_url"] && contentItem["img_url"] != "" ? contentItem["img_url"] : logo,
      0
    )}${add_attribute("alt", contentItem["release_group_name"], 0)}> <div class="metadata-blurb"><a${add_attribute("href", `https://musicbrainz.org/release-group/${contentItem["release_group_mbid"]}`, 0)}><h2>${escape(contentItem["release_group_name"])}</h2></a> <a${add_attribute("href", `https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`, 0)}><p>${escape(contentItem["artist_name"])}</p> </a></div> </div>`;
  })}</div>` : `${collectionType == "recordings" ? `<div class="${escape(null_to_empty(format[layout][0]), true) + " svelte-o2owaj"}">${each(collectionContents, (contentItem) => {
    return `<div class="${escape(null_to_empty(format[layout][1]), true) + " svelte-o2owaj"}"><img${add_attribute("src", contentItem["release_groups"]["img_url"], 0)}${add_attribute("alt", contentItem["recordings"]["recording_name"], 0)}> <div class="metata-blurb"><a${add_attribute("href", `https://musicbrainz.org/recording/${contentItem["recording_mbid"]}`, 0)}><h2>${escape(contentItem["recordings"]["recording_name"])}</h2></a> <a${add_attribute("href", `https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`, 0)}><p>${escape(contentItem["artists"]["artist_name"])}</p> </a></div> </div>`;
  })}</div>` : ``}`}`}` : ``}`}`;
});
export {
  GridList as G
};

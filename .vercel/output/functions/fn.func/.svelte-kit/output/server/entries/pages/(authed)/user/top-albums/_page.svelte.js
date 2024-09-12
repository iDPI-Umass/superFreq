import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../../chunks/ssr.js";
import "../../../../../chunks/client.js";
import "../../../../../chunks/localStorage.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { G as GridList } from "../../../../../chunks/GridList.js";
import { M as MusicBrainzSearch } from "../../../../../chunks/MusicBrainzSearch.js";
const css = {
  code: ".horizontal.svelte-nh3k4j{justify-content:space-between;align-items:center}.search-bar.svelte-nh3k4j{border-top:1px solid var(--freq-color-border-panel);border-bottom:1px solid var(--freq-color-border-panel);padding:var(--freq-height-spacer-half) var(--freq-width-spacer);margin:var(--freq-spacing-3x-small) 0}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<!--\\n\\tSearch MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.\\n\\n\\tAll of this is done on the client side.\\n-->\\n\\n<script lang=\\"ts\\">import { goto } from \\"$app/navigation\\";\\nimport { username } from \\"$lib/resources/localStorage.ts\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport GridList from \\"$lib/components/GridList.svelte\\";\\nimport MusicBrainzSearch from \\"$lib/components/MusicBrainzSearch.svelte\\";\\nexport let data;\\nlet { collection } = data;\\n$: ({ collection } = data);\\nlet collectionId;\\nlet collectionTitle = `${username}\'s\' top albums`;\\nlet collectionType = \\"release_groups\\";\\nlet collectionStatus = \\"public\\";\\nlet descriptionText = \\"\\";\\nlet collectionItems = [];\\n$: collectionItems;\\nlet itemAdded = false;\\nlet collectionItemCount = collectionItems.length;\\nconst buttonTextLookup = {\\n  \\"\\": \\"...\\",\\n  \\"artists\\": \\"artists\\",\\n  \\"release_groups\\": \\"albums\\",\\n  \\"recordings\\": \\"tracks\\"\\n};\\nlet placeholderText = \\"Search for items to add to your collection\\";\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tChoose Top Albums\\n\\t</title>\\n</svelte:head>\\n\\n\\n<div class=\\"panel\\">\\n    <PanelHeader>\\n        my top albums\\n    </PanelHeader>\\n    <form class=\\"horizontal\\" method=\\"POST\\" action=\'?/submitCollection\'>\\n\\t\\t<p>Pick your top 8 albums to display on your profile.</p>\\n\\t\\t<input \\n\\t\\t\\ttype=\\"hidden\\"\\n\\t\\t\\tname=\\"collection-items\\"\\n\\t\\t\\tid=\\"collection=items\\"\\n\\t\\t\\tvalue={JSON.stringify(collectionItems)}\\n\\t\\t/>\\n        <button \\n            class=\\"double-border-top\\" \\n            type=\\"submit\\"\\n        >\\n            <div class=\\"inner-border\\">             \\n                submit\\n            </div>\\n        </button>\\n    </form>\\n    <div class=\\"search-bar\\">\\n\\t\\t<MusicBrainzSearch \\n            searchCategory={collectionType}\\n\\t\\t\\tbind:addedItems={collectionItems}\\n\\t\\t\\tbind:newItemAdded={itemAdded}\\n\\t\\t\\tsearchButtonText={`add ${buttonTextLookup[collectionType]}`}\\n\\t\\t\\tsearchPlaceholder={placeholderText}\\n            mode=\\"collection\\"\\n            limit={8}\\n\\t\\t></MusicBrainzSearch>\\n    </div>\\n    {#key collectionItems.length}\\n        <GridList \\n            bind:collectionContents={collectionItems}\\n            collectionReturned={itemAdded}\\n            collectionType={collectionType}\\n            layout=\\"list\\"\\n            mode=\\"edit\\"\\n        ></GridList>\\n    {/key}\\n</div>\\n\\n<style>\\n\\t.horizontal {\\n\\t\\tjustify-content: space-between;\\n\\t\\talign-items: center;\\n\\t}\\n    .search-bar {\\n        border-top: 1px solid var(--freq-color-border-panel);\\n        border-bottom: 1px solid var(--freq-color-border-panel);\\n        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);\\n\\t\\tmargin: var(--freq-spacing-3x-small) 0;\\n    }\\n</style>"],"names":[],"mappings":"AAmFC,yBAAY,CACX,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MACd,CACG,yBAAY,CACR,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACpD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACvD,OAAO,CAAE,IAAI,yBAAyB,CAAC,CAAC,IAAI,mBAAmB,CAAC,CACtE,MAAM,CAAE,IAAI,uBAAuB,CAAC,CAAC,CACnC"}'
};
let collectionType = "release_groups";
let placeholderText = "Search for items to add to your collection";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let collectionItems = [];
  let itemAdded = false;
  collectionItems.length;
  const buttonTextLookup = {
    "": "...",
    "artists": "artists",
    "release_groups": "albums",
    "recordings": "tracks"
  };
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `  ${$$result.head += `<!-- HEAD_svelte-k6fbmn_START -->${$$result.title = `<title>
		Choose Top Albums
	</title>`, ""}<!-- HEAD_svelte-k6fbmn_END -->`, ""} <div class="panel">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
      default: () => {
        return `my top albums`;
      }
    })} <form class="horizontal svelte-nh3k4j" method="POST" action="?/submitCollection"><p data-svelte-h="svelte-no6qtz">Pick your top 8 albums to display on your profile.</p> <input type="hidden" name="collection-items" id="collection=items"${add_attribute("value", JSON.stringify(collectionItems), 0)}> <button class="double-border-top" type="submit" data-svelte-h="svelte-181pen"><div class="inner-border">submit</div></button></form> <div class="search-bar svelte-nh3k4j">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
      $$result,
      {
        searchCategory: collectionType,
        searchButtonText: `add ${buttonTextLookup[collectionType]}`,
        searchPlaceholder: placeholderText,
        mode: "collection",
        limit: 8,
        addedItems: collectionItems,
        newItemAdded: itemAdded
      },
      {
        addedItems: ($$value) => {
          collectionItems = $$value;
          $$settled = false;
        },
        newItemAdded: ($$value) => {
          itemAdded = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div> ${validate_component(GridList, "GridList").$$render(
      $$result,
      {
        collectionReturned: itemAdded,
        collectionType,
        layout: "list",
        mode: "edit",
        collectionContents: collectionItems
      },
      {
        collectionContents: ($$value) => {
          collectionItems = $$value;
          $$settled = false;
        }
      },
      {}
    )} </div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};

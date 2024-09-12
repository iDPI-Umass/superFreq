import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../chunks/ssr.js";
import { P as PanelHeader } from "../../../../chunks/PanelHeader.js";
import { G as GridList } from "../../../../chunks/GridList.js";
import { M as MusicBrainzSearch } from "../../../../chunks/MusicBrainzSearch.js";
import { T as Tooltip } from "../../../../chunks/Tooltip.js";
const InfoBox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="info-box-compact"><p>${slots.default ? slots.default({}) : ``}</p></div>`;
});
const css = {
  code: ".search-bar.svelte-1fi82wk{border-top:1px solid var(--freq-color-border-panel);border-bottom:1px solid var(--freq-color-border-panel);padding:var(--freq-height-spacer-half) var(--freq-width-spacer);margin:var(--freq-spacing-3x-small) 0}@media screen and (max-width: 600px){form.horizontal.svelte-1fi82wk{flex-direction:column}}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<!--\\n\\tSearch MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.\\n-->\\n\\n<script lang=\\"ts\\">import PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport GridList from \\"$lib/components/GridList.svelte\\";\\nimport MusicBrainzSearch from \\"$lib/components/MusicBrainzSearch.svelte\\";\\nimport Tooltip from \\"$lib/components/Tooltip.svelte\\";\\nimport InfoBox from \\"src/lib/components/InfoBox.svelte\\";\\nexport let data;\\nlet { sessionUserId } = data;\\n$: ({ sessionUserId } = data);\\nlet collectionTitle;\\nlet collectionType;\\nlet collectionStatus;\\nlet collectionItems = [];\\n$: collectionItems;\\nlet itemAdded = false;\\nconsole.log(collectionItems);\\nconst buttonTextLookup = {\\n  \\"\\": \\"...\\",\\n  \\"artists\\": \\"artists\\",\\n  \\"release_groups\\": \\"albums\\",\\n  \\"recordings\\": \\"tracks\\"\\n};\\nfunction searchButtonLabel(lookup) {\\n  if (!lookup) {\\n    return \\"...\\";\\n  } else return lookup;\\n}\\nlet placeholderText = \\"Search for items to add to your collection\\";\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tNew Collection\\n\\t</title>\\n</svelte:head>\\n\\n<InfoBox>\\n    A collection is a list of albums, tracks, or artists. Among many other things, you can make a colleciton to keep track of music you want to listen to or create a resource for other people who might want to learn more about music you love.\\n</InfoBox>\\n\\n<div class=\\"panel\\">\\n    <PanelHeader>\\n        new collection\\n    </PanelHeader>\\n    <form\\n        class=\\"horizontal\\"\\n        method=\\"POST\\"\\n        action=\\"?/insertCollection\\"\\n    >\\n        <div class=\\"form-column\\">\\n            <input \\n                type=\\"hidden\\"\\n                name=\\"collection-contents\\"\\n                id=\\"collection-contents\\"\\n                value={JSON.stringify(collectionItems)}\\n            />\\n            <div class=\\"label-group\\">\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"collection-title\\"\\n                >\\n                    collection name\\n                </label>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n            </div>\\n            <input \\n                class=\\"text\\" \\n                type=\\"text\\" \\n                name=\\"collection-title\\" \\n                id=\\"collection-title\\" \\n                bind:value={collectionTitle} \\n                required \\n            />\\n            <fieldset>\\n                <div class=\\"label-group\\">\\n                    <legend>Type of collection</legend>\\n                    <Tooltip>\\n                        All items in a collection must be the same type. You can not mix and match artists, ablums, and tracks.\\n                    </Tooltip>\\n                </div>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n                <ul>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"collection-type\\" \\n                            id=\\"artists\\" \\n                            value=\\"artists\\" \\n                            bind:group={collectionType} \\n                        />\\n                        <label for=\\"artists\\">artists</label>\\n                    </li>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"collection-type\\" \\n                            id=\\"albums\\" \\n                            value=\\"release_groups\\" \\n                            bind:group={collectionType} \\n                        />\\n                        <label for=\\"albums\\">albums</label>\\n                    </li>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"collection-type\\" \\n                            id=\\"tracks\\" \\n                            value=\\"recordings\\" \\n                            bind:group={collectionType} \\n                        />\\n                        <label for=\\"tracks\\">tracks</label>\\n                    </li>\\n                </ul>\\n            </fieldset>\\n            <fieldset>\\n                <div class=\\"label-group\\">\\n                    <legend>Status of collection</legend>\\n                    <Tooltip>\\n                        <u>Open</u> collections can be viewed and edited by anyone.\\n                        <br />\\n                        <br />\\n                        <u>Public</u> collections can be viewed by anyone, but only edited by you.\\n                        <br />\\n                        <br />\\n                        <u>Private</u> collections can only be viewed and edited by you.\\n                    </Tooltip>\\n                </div>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n                <ul>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"status\\" \\n                            id=\\"open\\" \\n                            value=\\"open\\" \\n                            bind:group={collectionStatus} \\n                        />\\n                        <label for=\\"open\\">open</label>\\n                    </li>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"status\\" \\n                            id=\\"public\\" \\n                            value=\\"public\\" \\n                            bind:group={collectionStatus} \\n                        />\\n                        <label for=\\"public\\">public</label>\\n                    </li>\\n                    <li>\\n                        <input \\n                            class=\\"radio\\" \\n                            type=\\"radio\\" \\n                            name=\\"status\\" \\n                            id=\\"private\\" \\n                            value=\\"private\\" \\n                            bind:group={collectionStatus} \\n                        />\\n                        <label for=\\"private\\">private</label>\\n                    </li>\\n                </ul>\\n            </fieldset>\\n        </div>\\n        <div class=\\"form-column\\">\\n            <label \\n                class=\\"text-label\\" \\n                for=\\"description\\"\\n            >\\n                Collection Description\\n            </label>\\n            <textarea\\n                id=\\"description\\"\\n                name=\\"description\\"\\n                rows=\\"10\\"\\n                cols=\\"1\\"\\n                spellcheck=true \\n                required\\n            ></textarea>\\n            <button \\n                class=\\"double-border-top\\" \\n                type=\\"submit\\"\\n                formAction=\\"?/insertCollection\\"\\n                disabled={!(collectionStatus && collectionTitle)}\\n            >\\n                <div class=\\"inner-border\\">\\n                    submit\\n                </div>\\n            </button>\\n        </div>\\n    </form>\\n    <div class=\\"search-bar\\">\\n\\t\\t<MusicBrainzSearch \\n            searchCategory={collectionType}\\n\\t\\t\\tbind:addedItems={collectionItems}\\n\\t\\t\\tbind:newItemAdded={itemAdded}\\n\\t\\t\\tsearchButtonText={`add ${searchButtonLabel(buttonTextLookup[collectionType])}`}\\n\\t\\t\\tsearchPlaceholder={placeholderText}\\n            mode=\\"collection\\"\\n\\t\\t></MusicBrainzSearch>\\n    </div>\\n    {#key collectionItems.length}\\n        <GridList \\n            bind:collectionContents={collectionItems}\\n            collectionReturned={itemAdded}\\n            collectionType={collectionType}\\n            layout=\\"list\\"\\n            mode=\\"edit\\"\\n        ></GridList>\\n    {/key}\\n</div>\\n\\n<style>\\n    .search-bar {\\n        border-top: 1px solid var(--freq-color-border-panel);\\n        border-bottom: 1px solid var(--freq-color-border-panel);\\n        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);\\n\\t\\tmargin: var(--freq-spacing-3x-small) 0;\\n    }\\n    @media screen and (max-width: 600px) {\\n        form.horizontal {\\n            flex-direction: column;\\n        }\\n    }\\n</style>"],"names":[],"mappings":"AAkOI,0BAAY,CACR,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACpD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACvD,OAAO,CAAE,IAAI,yBAAyB,CAAC,CAAC,IAAI,mBAAmB,CAAC,CACtE,MAAM,CAAE,IAAI,uBAAuB,CAAC,CAAC,CACnC,CACA,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAE,CACjC,IAAI,0BAAY,CACZ,cAAc,CAAE,MACpB,CACJ"}'
};
let placeholderText = "Search for items to add to your collection";
function searchButtonLabel(lookup) {
  if (!lookup) {
    return "...";
  } else return lookup;
}
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let collectionTitle;
  let collectionType;
  let collectionItems = [];
  let itemAdded = false;
  console.log(collectionItems);
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
    $$rendered = `  ${$$result.head += `<!-- HEAD_svelte-1pvitdh_START -->${$$result.title = `<title>
		New Collection
	</title>`, ""}<!-- HEAD_svelte-1pvitdh_END -->`, ""} ${validate_component(InfoBox, "InfoBox").$$render($$result, {}, {}, {
      default: () => {
        return `A collection is a list of albums, tracks, or artists. Among many other things, you can make a colleciton to keep track of music you want to listen to or create a resource for other people who might want to learn more about music you love.`;
      }
    })} <div class="panel">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
      default: () => {
        return `new collection`;
      }
    })} <form class="horizontal svelte-1fi82wk" method="POST" action="?/insertCollection"><div class="form-column"><input type="hidden" name="collection-contents" id="collection-contents"${add_attribute("value", JSON.stringify(collectionItems), 0)}> <div class="label-group" data-svelte-h="svelte-36b99r"><label class="text-label" for="collection-title">collection name</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="collection-title" id="collection-title" required${add_attribute("value", collectionTitle, 0)}> <fieldset><div class="label-group"><legend data-svelte-h="svelte-1fdxuez">Type of collection</legend> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
      default: () => {
        return `All items in a collection must be the same type. You can not mix and match artists, ablums, and tracks.`;
      }
    })}</div> <span class="label-explainer" data-svelte-h="svelte-6fdnqv">* required</span> <ul><li><input class="radio" type="radio" name="collection-type" id="artists" value="artists"${""}> <label for="artists" data-svelte-h="svelte-1kp4d7u">artists</label></li> <li><input class="radio" type="radio" name="collection-type" id="albums" value="release_groups"${""}> <label for="albums" data-svelte-h="svelte-lki2fu">albums</label></li> <li><input class="radio" type="radio" name="collection-type" id="tracks" value="recordings"${""}> <label for="tracks" data-svelte-h="svelte-bl4i7u">tracks</label></li></ul></fieldset> <fieldset><div class="label-group"><legend data-svelte-h="svelte-1y7llzl">Status of collection</legend> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
      default: () => {
        return `<u data-svelte-h="svelte-1rxzqm4">Open</u> collections can be viewed and edited by anyone.
                        <br> <br> <u data-svelte-h="svelte-1udjsj7">Public</u> collections can be viewed by anyone, but only edited by you.
                        <br> <br> <u data-svelte-h="svelte-1jsi2fh">Private</u> collections can only be viewed and edited by you.`;
      }
    })}</div> <span class="label-explainer" data-svelte-h="svelte-6fdnqv">* required</span> <ul><li><input class="radio" type="radio" name="status" id="open" value="open"${""}> <label for="open" data-svelte-h="svelte-1dynoiq">open</label></li> <li><input class="radio" type="radio" name="status" id="public" value="public"${""}> <label for="public" data-svelte-h="svelte-171904i">public</label></li> <li><input class="radio" type="radio" name="status" id="private" value="private"${""}> <label for="private" data-svelte-h="svelte-1l2bu68">private</label></li></ul></fieldset></div> <div class="form-column"><label class="text-label" for="description" data-svelte-h="svelte-pl59zr">Collection Description</label> <textarea id="description" name="description" rows="10" cols="1" spellcheck="true" required></textarea> <button class="double-border-top" type="submit" formaction="?/insertCollection" ${"disabled"}><div class="inner-border" data-svelte-h="svelte-18eb69e">submit</div></button></div></form> <div class="search-bar svelte-1fi82wk">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
      $$result,
      {
        searchCategory: collectionType,
        searchButtonText: `add ${searchButtonLabel(buttonTextLookup[collectionType])}`,
        searchPlaceholder: placeholderText,
        mode: "collection",
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

import { c as create_ssr_component, f as escape, d as add_attribute, v as validate_component } from "../../../../../chunks/ssr.js";
import { G as GridList } from "../../../../../chunks/GridList.js";
import { M as MusicBrainzSearch } from "../../../../../chunks/MusicBrainzSearch.js";
import { T as Tooltip } from "../../../../../chunks/Tooltip.js";
const css = {
  code: ".collection-builder.svelte-1aswrno.svelte-1aswrno{width:var(--freq-max-width-primary);margin:3vh 3vw;border:var(--freq-border-panel)}.builder-header.svelte-1aswrno.svelte-1aswrno{border-top:1px solid var(--freq-color-border-panel);border-bottom:1px solid var(--freq-color-border-panel);margin:var(--freq-spacing-3x-small) 0;align-items:center}.builder-header.svelte-1aswrno h1.svelte-1aswrno{text-transform:uppercase;font-size:var(--freq-font-size-medium);color:var(--freq-color-primary);padding:0 var(--freq-width-spacer)}form.svelte-1aswrno.svelte-1aswrno{display:flex;flex-direction:row;gap:var(--freq-width-spacer);padding:var(--freq-width-spacer)}form.svelte-1aswrno label.text-label.svelte-1aswrno{text-transform:uppercase}form.svelte-1aswrno input.svelte-1aswrno{width:auto}.form-block.svelte-1aswrno.svelte-1aswrno{display:flex;flex-direction:column;width:100%}.search-bar.svelte-1aswrno.svelte-1aswrno{border-top:1px solid var(--freq-color-border-panel);border-bottom:1px solid var(--freq-color-border-panel);padding:var(--freq-height-spacer-half) var(--freq-width-spacer);margin:var(--freq-spacing-3x-small) 0}@media screen and (max-width: 600px){}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<!--\\n\\tRetrieve existing collection if user has edit permission.\\n    \\n    Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.\\n\\n    Upsert updates.\\n\\n\\tAll of this is done on the client side.\\n-->\\n\\n<script lang=\\"ts\\">import GridList from \\"$lib/components/GridList.svelte\\";\\nimport MusicBrainzSearch from \\"$lib/components/MusicBrainzSearch.svelte\\";\\nimport Tooltip from \\"$lib/components/Tooltip.svelte\\";\\nexport let data;\\nlet { collection, sessionUserId, collectionId } = data;\\n$: ({ collection, sessionUserId, collectionId } = data);\\nconst collectionInfo = collection?.info;\\nlet collectionTitle = collectionInfo[\\"title\\"];\\nlet collectionType = collectionInfo[\\"type\\"];\\nlet collectionStatus = collectionInfo[\\"status\\"];\\nlet descriptionText = collectionInfo[\\"description_text\\"];\\nlet collectionItems = collection?.collectionContents;\\n$: collectionItems;\\nlet itemAdded = false;\\nlet deletedItems = collection?.deletedCollectionContents;\\n$: deletedItems;\\nconst buttonTextLookup = {\\n  \\"\\": \\"...\\",\\n  \\"artists\\": \\"artists\\",\\n  \\"release_groups\\": \\"albums\\",\\n  \\"recordings\\": \\"tracks\\"\\n};\\nlet placeholderText = \\"Search for items to add to your collection\\";\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tEdit {collectionInfo.title}\\n\\t</title>\\n</svelte:head>\\n\\n\\n<div class=\\"collection-builder\\">\\n    <div class=\\"builder-header\\">\\n        <h1>\\n            edit collection\\n        </h1>\\n    </div>\\n    <form class=\\"form-box\\" method=\\"POST\\" action =\\"?/updateCollection\\">\\n        <div class=\\"form-block\\">\\n            <div class=\\"label-group\\">\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"collection-title\\"\\n                >\\n                    collection name\\n                </label>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n            </div>\\n            <input class=\\"text\\" type=\\"text\\" name=\\"collection-title\\" id=\\"collection-title\\" bind:value={collectionTitle} required />\\n            <input \\n                type=\\"hidden\\"\\n                name=\\"collection-id\\"\\n                value={collectionId}\\n            />\\n            {#key collectionItems?.length}\\n            <input \\n                type=\\"hidden\\"\\n                name=\\"collection-contents\\"\\n                value={JSON.stringify(collectionItems)}\\n            />\\n            {/key}\\n            {#key deletedItems?.length}\\n            <input \\n                type=\\"hidden\\"\\n                name=\\"deleted-items\\"\\n                value={JSON.stringify(deletedItems)}\\n            />\\n            {/key}\\n            <input \\n                type=\\"hidden\\"\\n                name=\\"updated-by\\"\\n                value={sessionUserId}\\n            />\\n            <fieldset>\\n                <div class=\\"label-group\\">\\n                    <legend>Status of collection</legend>\\n                    <Tooltip>\\n                        <u>Open</u> collections can be viewed and edited by anyone.\\n                        <br />\\n                        <br />\\n                        <u>Public</u> collections can be viewed by anyone, but only edited by you.\\n                        <br />\\n                        <br />\\n                        <u>Private</u> collections can only be viewed and edited by you.\\n                    </Tooltip>\\n                </div>\\n                <ul>\\n                    <li>\\n                        <input class=\\"radio\\" type=\\"radio\\" name=\\"status\\" id=\\"open\\" value=\\"open\\" bind:group={collectionStatus} />\\n                        <label for=\\"open\\">open</label>\\n                    </li>\\n                    <li>\\n                        <input class=\\"radio\\" type=\\"radio\\" name=\\"status\\" id=\\"public\\" value=\\"public\\" bind:group={collectionStatus} />\\n                        <label for=\\"public\\">public</label>\\n                    </li>\\n                    <li>\\n                        <input class=\\"radio\\" type=\\"radio\\" name=\\"status\\" id=\\"private\\" value=\\"private\\" bind:group={collectionStatus} />\\n                        <label for=\\"private\\">private</label>\\n                    </li>\\n                </ul>\\n            </fieldset>\\n        </div>\\n        <div class=\\"form-block\\">\\n            <label class=\\"text-label\\" for=\\"description\\">\\n                Collection Description\\n            </label>\\n            <textarea\\n                id=\\"description\\"\\n                name=\\"description\\"\\n                rows=\\"10\\"\\n                cols=\\"1\\"\\n                spellcheck=true \\n                required\\n            >{descriptionText}</textarea>\\n            <button \\n                class=\\"double-border-top\\" \\n                formAction = \'?/updateCollection\'\\n                disabled={!(collectionStatus && collectionTitle)}\\n            >\\n                <div class=\\"inner-border\\">\\n                    submit\\n                </div>\\n            </button>\\n        </div>\\n    </form>\\n    <div class=\\"search-bar\\">\\n\\t\\t<MusicBrainzSearch \\n            searchCategory={collectionType}\\n\\t\\t\\tbind:addedItems={collectionItems}\\n\\t\\t\\tbind:newItemAdded={itemAdded}\\n\\t\\t\\tsearchButtonText={`add ${buttonTextLookup[collectionType]}`}\\n\\t\\t\\tsearchPlaceholder={placeholderText}\\n            mode=\\"collection\\"\\n\\t\\t></MusicBrainzSearch>\\n    </div>\\n    {#key collectionItems?.length}\\n        <GridList \\n            bind:collectionContents={collectionItems}\\n            bind:deletedItems={deletedItems}\\n            collectionReturned={itemAdded}\\n            collectionType={collectionType}\\n            layout=\\"list\\"\\n            mode=\\"edit\\"\\n        ></GridList>\\n    {/key}\\n</div>\\n\\n<style>\\n    .collection-builder {\\n        width: var(--freq-max-width-primary);\\n        margin: 3vh 3vw;\\n        border: var(--freq-border-panel);\\n    }\\n    .builder-header {\\n        border-top: 1px solid var(--freq-color-border-panel);\\n        border-bottom: 1px solid var(--freq-color-border-panel);\\n        margin: var(--freq-spacing-3x-small) 0;\\n        align-items: center;\\n    }\\n    .builder-header h1 {\\n        text-transform: uppercase;\\n        font-size: var(--freq-font-size-medium);\\n        color: var(--freq-color-primary);\\n        padding: 0 var(--freq-width-spacer);\\n    }\\n    form {\\n        display: flex;\\n        flex-direction: row;\\n        gap: var(--freq-width-spacer);\\n        padding: var(--freq-width-spacer);\\n    }\\n    form label.text-label {\\n        text-transform: uppercase;\\n    }\\n    form input {\\n        width: auto;\\n    }\\n    .form-block {\\n        display: flex;\\n        flex-direction: column;\\n        width: 100%;\\n    }\\n    .search-bar {\\n        border-top: 1px solid var(--freq-color-border-panel);\\n        border-bottom: 1px solid var(--freq-color-border-panel);\\n        padding: var(--freq-height-spacer-half) var(--freq-width-spacer);\\n\\t\\tmargin: var(--freq-spacing-3x-small) 0;\\n    }\\n    @media screen and (max-width: 600px) {\\n        form.horizontal {\\n            flex-direction: column;\\n        }\\n    }\\n</style>"],"names":[],"mappings":"AAiKI,iDAAoB,CAChB,KAAK,CAAE,IAAI,wBAAwB,CAAC,CACpC,MAAM,CAAE,GAAG,CAAC,GAAG,CACf,MAAM,CAAE,IAAI,mBAAmB,CACnC,CACA,6CAAgB,CACZ,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACpD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACvD,MAAM,CAAE,IAAI,uBAAuB,CAAC,CAAC,CAAC,CACtC,WAAW,CAAE,MACjB,CACA,8BAAe,CAAC,iBAAG,CACf,cAAc,CAAE,SAAS,CACzB,SAAS,CAAE,IAAI,uBAAuB,CAAC,CACvC,KAAK,CAAE,IAAI,oBAAoB,CAAC,CAChC,OAAO,CAAE,CAAC,CAAC,IAAI,mBAAmB,CACtC,CACA,kCAAK,CACD,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,GAAG,CAAE,IAAI,mBAAmB,CAAC,CAC7B,OAAO,CAAE,IAAI,mBAAmB,CACpC,CACA,mBAAI,CAAC,KAAK,0BAAY,CAClB,cAAc,CAAE,SACpB,CACA,mBAAI,CAAC,oBAAM,CACP,KAAK,CAAE,IACX,CACA,yCAAY,CACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,IACX,CACA,yCAAY,CACR,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACpD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,yBAAyB,CAAC,CACvD,OAAO,CAAE,IAAI,yBAAyB,CAAC,CAAC,IAAI,mBAAmB,CAAC,CACtE,MAAM,CAAE,IAAI,uBAAuB,CAAC,CAAC,CACnC,CACA,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAE,CAIrC"}'
};
let placeholderText = "Search for items to add to your collection";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { collection, sessionUserId, collectionId } = data;
  const collectionInfo = collection?.info;
  let collectionTitle = collectionInfo["title"];
  let collectionType = collectionInfo["type"];
  let collectionStatus = collectionInfo["status"];
  let descriptionText = collectionInfo["description_text"];
  let collectionItems = collection?.collectionContents;
  let itemAdded = false;
  let deletedItems = collection?.deletedCollectionContents;
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
    ({ collection, sessionUserId, collectionId } = data);
    $$rendered = `  ${$$result.head += `<!-- HEAD_svelte-187cbdd_START -->${$$result.title = `<title>
		Edit ${escape(collectionInfo.title)} </title>`, ""}<!-- HEAD_svelte-187cbdd_END -->`, ""} <div class="collection-builder svelte-1aswrno"><div class="builder-header svelte-1aswrno" data-svelte-h="svelte-f5hvkp"><h1 class="svelte-1aswrno">edit collection</h1></div> <form class="form-box svelte-1aswrno" method="POST" action="?/updateCollection"><div class="form-block svelte-1aswrno"><div class="label-group" data-svelte-h="svelte-36b99r"><label class="text-label svelte-1aswrno" for="collection-title">collection name</label> <span class="label-explainer">* required</span></div> <input class="text svelte-1aswrno" type="text" name="collection-title" id="collection-title" required${add_attribute("value", collectionTitle, 0)}> <input type="hidden" name="collection-id"${add_attribute("value", collectionId, 0)} class="svelte-1aswrno"> <input type="hidden" name="collection-contents"${add_attribute("value", JSON.stringify(collectionItems), 0)} class="svelte-1aswrno"> <input type="hidden" name="deleted-items"${add_attribute("value", JSON.stringify(deletedItems), 0)} class="svelte-1aswrno"> <input type="hidden" name="updated-by"${add_attribute("value", sessionUserId, 0)} class="svelte-1aswrno"> <fieldset><div class="label-group"><legend data-svelte-h="svelte-1y7llzl">Status of collection</legend> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
      default: () => {
        return `<u data-svelte-h="svelte-1rxzqm4">Open</u> collections can be viewed and edited by anyone.
                        <br> <br> <u data-svelte-h="svelte-1udjsj7">Public</u> collections can be viewed by anyone, but only edited by you.
                        <br> <br> <u data-svelte-h="svelte-1jsi2fh">Private</u> collections can only be viewed and edited by you.`;
      }
    })}</div> <ul><li><input class="radio svelte-1aswrno" type="radio" name="status" id="open" value="open"${"open" === collectionStatus ? add_attribute("checked", true, 1) : ""}> <label for="open" data-svelte-h="svelte-1dynoiq">open</label></li> <li><input class="radio svelte-1aswrno" type="radio" name="status" id="public" value="public"${"public" === collectionStatus ? add_attribute("checked", true, 1) : ""}> <label for="public" data-svelte-h="svelte-171904i">public</label></li> <li><input class="radio svelte-1aswrno" type="radio" name="status" id="private" value="private"${"private" === collectionStatus ? add_attribute("checked", true, 1) : ""}> <label for="private" data-svelte-h="svelte-1l2bu68">private</label></li></ul></fieldset></div> <div class="form-block svelte-1aswrno"><label class="text-label svelte-1aswrno" for="description" data-svelte-h="svelte-emyzxv">Collection Description</label> <textarea id="description" name="description" rows="10" cols="1" spellcheck="true" required>${escape(descriptionText, false)}</textarea> <button class="double-border-top" formaction="?/updateCollection" ${!(collectionStatus && collectionTitle) ? "disabled" : ""}><div class="inner-border" data-svelte-h="svelte-18eb69e">submit</div></button></div></form> <div class="search-bar svelte-1aswrno">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
      $$result,
      {
        searchCategory: collectionType,
        searchButtonText: `add ${buttonTextLookup[collectionType]}`,
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
        collectionContents: collectionItems,
        deletedItems
      },
      {
        collectionContents: ($$value) => {
          collectionItems = $$value;
          $$settled = false;
        },
        deletedItems: ($$value) => {
          deletedItems = $$value;
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

import { c as create_ssr_component, h as each, d as add_attribute, f as escape } from "../../../chunks/ssr.js";
import "devalue";
import "../../../chunks/client.js";
const css = {
  code: ".wrapper.svelte-uayrdb{margin:3vh 3vw}a.svelte-uayrdb{display:flex;flex-direction:row;align-items:center;gap:1rem}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { enhance } from \\"$app/forms\\";\\nexport let form;\\nexport let data;\\nlet { collections, remaining, totalCollections, batchSize, batchIterator } = data;\\n$: ({ collections, remaining, totalCollections, batchSize, batchIterator } = data);\\n<\/script>\\n\\n<div class=\\"wrapper\\">\\n    <h1>collections</h1>\\n    <ul>\\n        {#each (form?.collections ?? collections) as collection}\\n            <li>\\n                <a href='/collection/{collection.collection_id}'>\\n                    {collection.title} by {collection.username} ({new Date(collection.created_at).toLocaleDateString()})\\n                </a>\\n            </li>\\n        {/each}\\n    </ul>\\n\\n    <form \\n        method=\\"POST\\" \\n        action=\\"?/loadMore\\"\\n        use:enhance\\n    >\\n        <input\\n            type=\\"hidden\\"\\n            name=\\"batch-iterator\\"\\n            value={form?.batchIterator ?? batchIterator}\\n        />\\n        <input\\n            type=\\"hidden\\"\\n            name=\\"batch-size\\"\\n            value={batchSize}\\n        />\\n        <input\\n            type=\\"hidden\\"\\n            name=\\"collections\\"\\n            value={JSON.stringify(form?.collections ?? collections)}\\n        />\\n        {#if (form?.remaining ?? remaining) > 0}\\n            <button class=\\"standard\\" formaction=\\"?/loadMore\\">\\n                load more\\n            </button>\\n        {/if}\\n    </form>\\n</div>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tExplore Collections\\n\\t</title>\\n</svelte:head>\\n\\n\\n<style>\\n    .wrapper {\\n        margin: 3vh 3vw;\\n    }\\n    a {\\n        display: flex;\\n        flex-direction: row;\\n        align-items: center;\\n        gap: 1rem;\\n    }\\n</style>"],"names":[],"mappings":"AAuDI,sBAAS,CACL,MAAM,CAAE,GAAG,CAAC,GAChB,CACA,eAAE,CACE,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IACT"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  let { data } = $$props;
  let { collections, remaining, totalCollections, batchSize, batchIterator } = data;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  ({ collections, remaining, totalCollections, batchSize, batchIterator } = data);
  return `<div class="wrapper svelte-uayrdb"><h1 data-svelte-h="svelte-gh69dd">collections</h1> <ul>${each(form?.collections ?? collections, (collection) => {
    return `<li><a href="${"/collection/" + escape(collection.collection_id, true)}" class="svelte-uayrdb">${escape(collection.title)} by ${escape(collection.username)} (${escape(new Date(collection.created_at).toLocaleDateString())})</a> </li>`;
  })}</ul> <form method="POST" action="?/loadMore"><input type="hidden" name="batch-iterator"${add_attribute("value", form?.batchIterator ?? batchIterator, 0)}> <input type="hidden" name="batch-size"${add_attribute("value", batchSize, 0)}> <input type="hidden" name="collections"${add_attribute("value", JSON.stringify(form?.collections ?? collections), 0)}> ${(form?.remaining ?? remaining) > 0 ? `<button class="standard" formaction="?/loadMore" data-svelte-h="svelte-43wruz">load more</button>` : ``}</form></div> ${$$result.head += `<!-- HEAD_svelte-fc5c77_START -->${$$result.title = `<title>
		Explore Collections
	</title>`, ""}<!-- HEAD_svelte-fc5c77_END -->`, ""}`;
});
export {
  Page as default
};

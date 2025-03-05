import { d as ensure_array_like, h as head, f as attr, e as escape_html, s as stringify, p as pop, b as push } from "../../../chunks/index2.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
import "../../../chunks/client.js";
function _page($$payload, $$props) {
  push();
  let { form, data } = $$props;
  let {
    collections,
    remaining,
    totalCollections,
    batchSize,
    batchIterator
  } = data;
  const each_array = ensure_array_like(form?.collections ?? collections);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Explore Collections
	</title>`;
  });
  $$payload.out += `<div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->collection spotlight`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="spotlight svelte-1ire6v1"><h2 class="svelte-1ire6v1"><a href="/collection/177" class="svelte-1ire6v1">Freq beta test listening club, January 2025</a></h2></div></div> <div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->all collections`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <ul><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let collection = each_array[$$index];
    $$payload.out += `<li><a${attr("href", `/collection/${stringify(collection.collection_id)}`)} class="svelte-1ire6v1">${escape_html(collection.title)} by ${escape_html(collection.username)} (${escape_html(new Date(collection.created_at).toLocaleDateString())})</a></li>`;
  }
  $$payload.out += `<!--]--></ul> <form method="POST" action="?/loadMore"><input type="hidden" name="batch-iterator"${attr("value", form?.batchIterator ?? batchIterator)}> <input type="hidden" name="batch-size"${attr("value", batchSize)}> <input type="hidden" name="collections"${attr("value", JSON.stringify(form?.collections ?? collections))}> `;
  if ((form?.remaining ?? remaining) > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="standard" formaction="?/loadMore">load more</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></form></div>`;
  pop();
}
export {
  _page as default
};

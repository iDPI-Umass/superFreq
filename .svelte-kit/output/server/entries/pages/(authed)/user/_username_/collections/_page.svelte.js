import { d as ensure_array_like, h as head, f as attr, e as escape_html, s as stringify } from "../../../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../../../chunks/PanelHeader.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let tmp = data, collections = tmp.collections, username = tmp.username;
  let displayName = collections[0]["display_name"];
  const each_array = ensure_array_like(collections);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		${escape_html(username)}'s collections
	</title>`;
  });
  $$payload.out += `<div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->${escape_html(`${displayName}'s collections`)}`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <ul><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let collection = each_array[$$index];
    $$payload.out += `<li><a${attr("href", `/collection/${stringify(collection.id)}`)}>${escape_html(collection.title)}</a></li>`;
  }
  $$payload.out += `<!--]--></ul></div>`;
}
export {
  _page as default
};

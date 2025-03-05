import { d as ensure_array_like, h as head, f as attr, e as escape_html, s as stringify } from "../../../../../../chunks/index2.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let { collections, username } = data;
  const each_array = ensure_array_like(collections);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Collections $${escape_html(username)} follows
	</title>`;
  });
  $$payload.out += `<ul><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let collection = each_array[$$index];
    $$payload.out += `<li><a${attr("href", `/collection/${stringify(collection.id)}`)}>${escape_html(collection.title)} by ${escape_html(collection.display_name)}</a></li>`;
  }
  $$payload.out += `<!--]--></ul>`;
}
export {
  _page as default
};

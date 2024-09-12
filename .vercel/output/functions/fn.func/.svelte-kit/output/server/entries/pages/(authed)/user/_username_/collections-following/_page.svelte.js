import { c as create_ssr_component, f as escape, h as each } from "../../../../../../chunks/ssr.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { collections, username } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  ({ collections, username } = data);
  return `${$$result.head += `<!-- HEAD_svelte-m153ry_START -->${$$result.title = `<title>
		Collections $${escape(username)} follows
	</title>`, ""}<!-- HEAD_svelte-m153ry_END -->`, ""} <ul>${each(collections, (collection) => {
    return `<li><a href="${"/collection/$" + escape(collection.id, true)}">$${escape(collection.title)} by $${escape(collection.display_name)}</a> </li>`;
  })}</ul>`;
});
export {
  Page as default
};

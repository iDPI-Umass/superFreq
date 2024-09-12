import { c as create_ssr_component, v as validate_component } from "../../../../../chunks/ssr.js";
import { N as NewNowPlayingPost } from "../../../../../chunks/NewNowPlayingPost.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  return `${$$result.head += `<!-- HEAD_svelte-13i9yjx_START -->${$$result.title = `<title>
		New Now Playing Post
	</title>`, ""}<!-- HEAD_svelte-13i9yjx_END -->`, ""} ${validate_component(NewNowPlayingPost, "NewNowPlayingPost").$$render($$result, { form }, {}, {})}`;
});
export {
  Page as default
};

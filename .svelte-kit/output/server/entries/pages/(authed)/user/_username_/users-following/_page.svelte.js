import { d as ensure_array_like, h as head, e as escape_html, f as attr, s as stringify } from "../../../../../../chunks/index2.js";
import { w as wave } from "../../../../../../chunks/freq-wave.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let { profiles, profileDisplayName, username } = data;
  const each_array = ensure_array_like(profiles);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Users ${escape_html(username)} follows
	</title>`;
  });
  $$payload.out += `<h1>users ${escape_html(profileDisplayName)} follows</h1> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let user = each_array[$$index];
    $$payload.out += `<ul><li class="svelte-1n9j5uv"><a${attr("href", `/user/${stringify(user.username)}`)} class="svelte-1n9j5uv"><img${attr("src", user.avatar_url ?? wave)}${attr("alt", `${stringify(user.display_name)}'s avatar`)} class="avatar"> ${escape_html(user.display_name)}</a></li></ul>`;
  }
  $$payload.out += `<!--]-->`;
}
export {
  _page as default
};

import { d as ensure_array_like, h as head, f as attr, s as stringify, e as escape_html } from "../../../chunks/index2.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
import { C as CoverArt } from "../../../chunks/CoverArt.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let { users } = data;
  let item = {
    "img_url": null,
    "last_fm_img_url": null,
    "artist_name": null,
    "release_group_name": null
  };
  function avatarItem(user) {
    item = {
      "img_url": user.avatar_url ?? null,
      "last_fm_img_url": user.avatar_last_fm_img_url ?? null,
      "artist_name": user.avatar_artist_name ?? null,
      "release_group_name": user.avatar_release_group_name ?? null
    };
    return item;
  }
  const each_array = ensure_array_like(users);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Explore Users
	</title>`;
  });
  $$payload.out += `<div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->users`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let user = each_array[$$index];
    $$payload.out += `<ul>`;
    if (user.username) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<li class="svelte-1tv04cv"><a${attr("href", `/user/${stringify(user.username)}`)} class="svelte-1tv04cv">`;
      CoverArt($$payload, {
        altText: `${user.display_name}'s avatar`,
        item: avatarItem(user),
        imgClass: "avatar-large"
      });
      $$payload.out += `<!----> <span class="display-name">${escape_html(user.display_name)}</span></a></li>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></ul>`;
  }
  $$payload.out += `<!--]--></div> <h1 class="svelte-1tv04cv">users</h1>`;
}
export {
  _page as default
};

import { d as ensure_array_like, h as head } from "../../../chunks/index2.js";
import { N as NowPlayingPost } from "../../../chunks/NowPlayingPost.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
function _page($$payload, $$props) {
  let { data, form } = $$props;
  let { posts, postCount } = data;
  let displayPosts = [...posts];
  const each_array = ensure_array_like(displayPosts);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Anonymous Posts
	</title>`;
  });
  $$payload.out += `<div class="panel-medium">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span>Some anonymized Now Playing posts</span>`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="posts-spacing svelte-1gilt3n"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let post = each_array[$$index];
    NowPlayingPost($$payload, { post, mode: "sample" });
  }
  $$payload.out += `<!--]--></div></div> <div class="post-panel"></div>`;
}
export {
  _page as default
};

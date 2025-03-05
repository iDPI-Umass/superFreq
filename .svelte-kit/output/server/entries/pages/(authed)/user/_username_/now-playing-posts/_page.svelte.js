import { d as ensure_array_like, h as head, f as attr, p as pop, b as push, e as escape_html } from "../../../../../../chunks/index2.js";
import { N as NowPlayingPost } from "../../../../../../chunks/NowPlayingPost.js";
import { a as PostReply } from "../../../../../../chunks/PostReply.js";
import { P as PanelHeader } from "../../../../../../chunks/PanelHeader.js";
import "../../../../../../chunks/client.js";
/* empty css                                                                   */
import { N as NotificationModal } from "../../../../../../chunks/NotificationModal.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let tmp = data, posts = tmp.posts, username = tmp.username, sessionUserId = tmp.sessionUserId, sessionUserCollections = tmp.sessionUserCollections;
  let showCollectionsListModal = form?.showCollectionsModal ?? false;
  let showSaveSucessModal = form?.updateSuccess ?? false;
  const each_array = ensure_array_like(posts);
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		${escape_html(username)}'s' Now Playing posts
	</title>`;
  });
  $$payload.out += `<div class="panel-medium">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span>${escape_html(posts[0]["display_name"])}'s Now Playing posts</span>`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="posts-spacing svelte-1gilt3n"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let post = each_array[$$index];
    $$payload.out += `<input type="hidden" name="post-id" id="post-id" form="delete"${attr("value", post?.id)}> <input type="hidden" name="post-username" id="post-username" form="delete"${attr("value", post?.username)}> <input type="hidden" name="post-id" id="post-id" form="flagPost"${attr("value", post?.id)}> <input type="hidden" name="post-id" id="post-id" form="submitReaction"${attr("value", post?.id)}> <input type="hidden" name="reaction-type" id="reaction-type" form="submitReaction" value="like"> `;
    if (post.type == "now_playing") {
      $$payload.out += "<!--[-->";
      NowPlayingPost($$payload, {
        sessionUserId,
        post,
        mode: "feed",
        userActionSuccess: form?.success,
        collections: sessionUserCollections,
        showCollectionsModal: showCollectionsListModal,
        showSaveSucessModal
      });
    } else if (post.type == "reply") {
      $$payload.out += "<!--[1-->";
      PostReply($$payload, { reply: post, sessionUserId });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]-->`;
  }
  $$payload.out += `<!--]--></div></div> `;
  if (form?.success) {
    $$payload.out += "<!--[-->";
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<span>success!</span>`;
      };
      NotificationModal($$payload, {
        showModal: form?.success,
        headerText,
        $$slots: { headerText: true }
      });
    }
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};

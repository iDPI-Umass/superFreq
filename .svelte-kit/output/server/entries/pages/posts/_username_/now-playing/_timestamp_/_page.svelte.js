import { h as head, d as ensure_array_like, f as attr, p as pop, b as push, e as escape_html } from "../../../../../../chunks/index2.js";
import { N as NowPlayingPost } from "../../../../../../chunks/NowPlayingPost.js";
import { P as PostReplyEditor, a as PostReply } from "../../../../../../chunks/PostReply.js";
function formInputs($$payload, formName) {
  $$payload.out += `<input type="hidden" name="reaction-type" id="reaction-type" form="submitReaction" value="like">`;
}
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let { post, postReplies, collections } = data;
  let sessionUserId = data?.sessionUserId;
  let actionSuccess = form?.success;
  let showCollectionsListModal = form?.showCollectionsModal ?? false;
  let showSaveSucessModal = form?.updateSuccess ?? false;
  function replyId(username, createdAt) {
    const replyTimestampString = createdAt.toISOString();
    const replyTimestamp = Date.parse(replyTimestampString).toString();
    const slug = username?.concat(replyTimestamp);
    return slug;
  }
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		${escape_html(post?.display_name)}'s Now Playing post
	</title>`;
  });
  $$payload.out += `<div class="post-panel">`;
  formInputs($$payload);
  $$payload.out += `<!----> `;
  formInputs($$payload);
  $$payload.out += `<!----> `;
  formInputs($$payload);
  $$payload.out += `<!----> `;
  formInputs($$payload);
  $$payload.out += `<!----> `;
  if (post?.status != "deleted") {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(postReplies);
    NowPlayingPost($$payload, {
      sessionUserId,
      post,
      editState: form?.editState,
      userActionSuccess: actionSuccess,
      collections,
      showCollectionsModal: showCollectionsListModal,
      showSaveSucessModal
    });
    $$payload.out += `<!----> `;
    PostReplyEditor($$payload);
    $$payload.out += `<!----> <!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let reply = each_array[$$index];
      $$payload.out += `<div${attr("id", replyId(reply.username, reply.created_at))}>`;
      PostReply($$payload, {
        reply,
        sessionUserId,
        userActionSuccess: actionSuccess
      });
      $$payload.out += `<!----></div>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="panel"><p>This post has been deleted.</p></div>`;
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

import { h as head, p as pop, b as push } from "../../../../chunks/index2.js";
import { F as Feed } from "../../../../chunks/Feed.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let {
    sessionUserId,
    feedItems,
    remaining,
    sessionUserCollections
  } = data;
  let showCollectionsListModal = form?.showCollectionsModal ?? false;
  let showSaveSucessModal = form?.updateSuccess ?? false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Feed
	</title>`;
  });
  Feed($$payload, {
    sessionUserId,
    feedItems,
    mode: "feed",
    userActionSuccess: form?.userActionSuccess,
    remaining,
    collections: sessionUserCollections,
    showCollectionsListModal,
    showSaveSucessModal
  });
  pop();
}
export {
  _page as default
};

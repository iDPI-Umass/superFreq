import { c as copy_payload, a as assign_payload, h as head } from "../../../../../chunks/index2.js";
import { N as NewNowPlayingPost } from "../../../../../chunks/NewNowPlayingPost.js";
function _page($$payload) {
  let addedItem = {};
  let imgPromise = null;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		New Now Playing Post
	</title>`;
    });
    NewNowPlayingPost($$payload2, {
      get addedItem() {
        return addedItem;
      },
      set addedItem($$value) {
        addedItem = $$value;
        $$settled = false;
      },
      get imgPromise() {
        return imgPromise;
      },
      set imgPromise($$value) {
        imgPromise = $$value;
        $$settled = false;
      }
    });
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
}
export {
  _page as default
};

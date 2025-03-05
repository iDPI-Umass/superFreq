import { b as push, c as copy_payload, a as assign_payload, j as bind_props, p as pop, f as attr, e as escape_html } from "./index2.js";
import { L as ListModal } from "./ListModal.js";
import { m as mbidCateogory } from "./musicbrainz.js";
/* empty css                                       */
function MusicBrainzSearch($$payload, $$props) {
  push();
  let {
    searchCategory,
    // "artists" | "release_groups" | "releases" | "recordings" | "labels"
    searchButtonText,
    searchPlaceholder,
    addedItems = [],
    deletedItems = [],
    newItemAdded = false,
    mode,
    // "single" | "collection" | "avatar-search"
    limit = "25",
    query = "",
    imgPromise = null
  } = $$props;
  let showModal = false;
  const searchCategories = ["artists", "release_groups", "recordings"];
  mbidCateogory(searchCategory);
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="search-bar svelte-ve0egz">`;
    {
      let headerText = function($$payload3) {
        if (!query) {
          $$payload3.out += "<!--[-->";
          $$payload3.out += `Please enter valid input in the search bar.`;
        } else if (query && true) {
          $$payload3.out += "<!--[1-->";
          $$payload3.out += `Loading...`;
        } else {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]-->`;
      }, list = function($$payload3) {
        $$payload3.out += `<div>`;
        {
          $$payload3.out += "<!--[!-->";
        }
        $$payload3.out += `<!--]--></div>`;
      };
      ListModal($$payload2, {
        get showModal() {
          return showModal;
        },
        set showModal($$value) {
          showModal = $$value;
          $$settled = false;
        },
        headerText,
        list,
        $$slots: { headerText: true, list: true }
      });
    }
    $$payload2.out += `<!----> <form class="search svelte-ve0egz"><button class="double-border-top"${attr("disabled", !searchCategory || !searchCategories.includes(searchCategory), true)}><div class="inner-border">${escape_html(searchButtonText)}</div></button> <div class="input-sizing svelte-ve0egz"><input class="search" type="search" id="searchQuery" name="query"${attr("placeholder", searchPlaceholder)}${attr("aria-label", searchPlaceholder)} size="40"${attr("value", query)}></div></form></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    addedItems,
    deletedItems,
    newItemAdded,
    imgPromise
  });
  pop();
}
export {
  MusicBrainzSearch as M
};

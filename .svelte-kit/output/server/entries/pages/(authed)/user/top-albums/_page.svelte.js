import { c as copy_payload, a as assign_payload, h as head, f as attr } from "../../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { C as CollectionEditor } from "../../../../../chunks/CollectionEditor.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let tmp = data, collectionContents = tmp.collectionContents, deletedCollectionContents = tmp.deletedCollectionContents;
  let collectionType = "release_groups";
  let imgPromise = null;
  let collectionItems = collectionContents ? collectionContents : [];
  let deletedItems = deletedCollectionContents ? deletedCollectionContents : [];
  let itemAdded = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		Choose Top Albums
	</title>`;
    });
    $$payload2.out += `<div class="panel">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>my top albums</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <form class="horizontal svelte-gpgkbt" method="POST" action="?/submitCollection"><p>Pick your top 8 albums to display on your profile.</p> <!---->`;
    {
      $$payload2.out += `<input type="hidden" name="collection-items" id="collection=items"${attr("value", JSON.stringify(collectionItems))}>`;
    }
    $$payload2.out += `<!----> <!---->`;
    {
      $$payload2.out += `<input type="hidden" name="deleted-items"${attr("value", JSON.stringify(deletedItems))}>`;
    }
    $$payload2.out += `<!----> <button class="double-border-top" type="submit"><div class="inner-border">submit</div></button></form> `;
    CollectionEditor($$payload2, {
      collectionStatus: "public",
      collectionType,
      mode: "release_group",
      itemAdded,
      get collectionItems() {
        return collectionItems;
      },
      set collectionItems($$value) {
        collectionItems = $$value;
        $$settled = false;
      },
      get deletedItems() {
        return deletedItems;
      },
      set deletedItems($$value) {
        deletedItems = $$value;
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
    $$payload2.out += `<!----></div>`;
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

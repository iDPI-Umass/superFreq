import { c as copy_payload, a as assign_payload, h as head, f as attr } from "../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../chunks/PanelHeader.js";
import "../../../../chunks/GridList.js";
import "../../../../chunks/parseData.js";
/* empty css                                                        */
import "../../../../chunks/ListModal.js";
import "../../../../chunks/MusicBrainzSearch.js";
import { T as Tooltip } from "../../../../chunks/Tooltip.js";
import { I as InfoBox } from "../../../../chunks/InfoBox.js";
import { C as CollectionEditor } from "../../../../chunks/CollectionEditor.js";
function _page($$payload, $$props) {
  let { data } = $$props;
  let tmp = data;
  tmp.sessionUserId;
  tmp.infoBoxText;
  let collectionTitle = void 0;
  let collectionType = void 0;
  let collectionStatus = void 0;
  let collectionItems = [];
  let itemAdded = false;
  let imgPromise = null;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		New Collection
	</title>`;
    });
    InfoBox($$payload2, {
      mode: "compact",
      children: ($$payload3) => {
        $$payload3.out += `<!---->A collection is a list of albums, tracks, mixes, or artists. Among many other things, you can make a colleciton to keep track of music you want to listen to or create a resource for other people who might want to learn more about music you love.`;
      }
    });
    $$payload2.out += `<!----> <div class="collection-container">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>new collection</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <form class="horizontal" method="POST" action="?/insertCollection"><div class="form-column"><input type="hidden" name="collection-contents" id="collection-contents"${attr("value", JSON.stringify(collectionItems))}> <div class="label-group"><label class="text-label" for="collection-title">collection name</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="collection-title" id="collection-title"${attr("value", collectionTitle)} required> <fieldset><div class="label-group"><legend>view sort</legend> `;
    Tooltip($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->This how your collection is sorted by default when other users view it. This does not change or effect the order of the items in the editor below.`;
      }
    });
    $$payload2.out += `<!----></div> <ul><li><input class="radio" type="radio" name="view-sort" id="default" value="default" checked> <label for="default">default</label></li> <li><input class="radio" type="radio" name="view-sort" id="reverse" value="reverse"> <label for="reverse">reverse</label></li> <li><input class="radio" type="radio" name="view-sort" id="artist-asc" value="artist_asc"> <label for="artist-asc">artists a --> z</label></li> <li><input class="radio" type="radio" name="view-sort" id="artist-desc" value="artist_desc"> <label for="artist-desc">artists z --> a</label></li></ul></fieldset> <fieldset><div class="label-group"><legend>Status of collection</legend> `;
    Tooltip($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<u>Open</u> collections can be viewed and edited by anyone. <br> <br> <u>Public</u> collections can be viewed by anyone, but only edited by you. <br> <br> <u>Private</u> collections can only be viewed and edited by you.`;
      }
    });
    $$payload2.out += `<!----></div> <span class="label-explainer">* required</span> <ul><li><input class="radio" type="radio" name="status" id="open" value="open"${attr("checked", collectionStatus === "open", true)}> <label for="open">open</label></li> <li><input class="radio" type="radio" name="status" id="public" value="public"${attr("checked", collectionStatus === "public", true)}> <label for="public">public</label></li> <li><input class="radio" type="radio" name="status" id="private" value="private"${attr("checked", collectionStatus === "private", true)}> <label for="private">private</label></li></ul></fieldset> `;
    {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="form-column"><label class="text-label" for="description">Collection Description</label> <textarea id="description" name="description" rows="10" cols="1" spellcheck="true" required></textarea> <div class="collection-info-button-spacing"><button class="double-border-top" type="submit" formAction="?/insertCollection"${attr("disabled", true, true)}><div class="inner-border">create new collection</div></button></div></div></form> `;
    CollectionEditor($$payload2, {
      collectionType,
      collectionStatus,
      get collectionItems() {
        return collectionItems;
      },
      set collectionItems($$value) {
        collectionItems = $$value;
        $$settled = false;
      },
      get itemAdded() {
        return itemAdded;
      },
      set itemAdded($$value) {
        itemAdded = $$value;
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
    $$payload2.out += `<!----> <div class="bottom-double-border svelte-gc6ymb"></div></div> <div class="buffer svelte-gc6ymb"></div>`;
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

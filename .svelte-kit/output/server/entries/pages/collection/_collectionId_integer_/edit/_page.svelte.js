import { b as push, f as attr, e as escape_html, s as stringify, j as bind_props, p as pop, c as copy_payload, a as assign_payload, h as head } from "../../../../../chunks/index2.js";
import { C as CollectionEditor } from "../../../../../chunks/CollectionEditor.js";
import { T as Tooltip } from "../../../../../chunks/Tooltip.js";
import { I as InfoBox } from "../../../../../chunks/InfoBox.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import "../../../../../chunks/client.js";
function SingleActionModal($$payload, $$props) {
  push();
  let {
    showModal = void 0,
    headerText,
    message,
    formAction,
    buttonText,
    success = null
  } = $$props;
  let buttonsInactive = false;
  $$payload.out += `<dialog class="notification svelte-1p4us4r" aria-label="notification modal"><div class="dialog-header"><h1 class="notification">`;
  headerText($$payload);
  $$payload.out += `<!----></h1></div> <p class="notification">`;
  message?.($$payload);
  $$payload.out += `<!----></p> <div class="options svelte-1p4us4r"><form method="POST"${attr("action", formAction)}><button class="standard" type="submit"${attr("aria-label", `submit ${stringify(buttonText)}`)}${attr("disabled", buttonsInactive, true)}>${escape_html(buttonText)}</button></form> <button class="standard" aria-label="close modal" formmethod="dialog"${attr("disabled", buttonsInactive, true)}>cancel</button></div></dialog>`;
  bind_props($$props, { showModal });
  pop();
}
function _page($$payload, $$props) {
  push();
  let { form, data } = $$props;
  let tmp = data, collection = tmp.collection;
  const { sessionUserId, collectionId, infoBoxText } = data;
  let imgPromise = null;
  const collectionInfo = collection?.info;
  let collectionTitle = collectionInfo["title"];
  let collectionType = collectionInfo["type"];
  let collectionStatus = collectionInfo["status"];
  let descriptionText = collectionInfo["description_text"];
  let defaultSort = collectionInfo["default_view_sort"];
  let collectionItems = collection?.collectionContents;
  let itemAdded = false;
  let deletedItems = collection?.deletedCollectionContents;
  const isOwner = sessionUserId == collectionInfo.owner_id ? true : false;
  let showModal = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		Edit ${escape_html(collectionInfo.title)}
	</title>`;
    });
    $$payload2.out += `<div class="collection-container">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>edit collection</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <form class="horizontal" method="POST" action="?/updateCollection"><div class="form-column"><div class="label-group"><label class="text-label" for="collection-title">collection name</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="collection-title" id="collection-title"${attr("value", collectionTitle)} required> <input type="hidden" name="status"${attr("value", collectionStatus)}> <!---->`;
    {
      $$payload2.out += `<input type="hidden" name="collection-contents"${attr("value", JSON.stringify(collectionItems))}>`;
    }
    $$payload2.out += `<!----> <!---->`;
    {
      $$payload2.out += `<input type="hidden" name="deleted-items"${attr("value", JSON.stringify(deletedItems))}>`;
    }
    $$payload2.out += `<!----> `;
    if (isOwner) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<fieldset><div class="label-group"><legend>view sort</legend> `;
      Tooltip($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<!---->This how your collection is sorted by default when other users view it. This does not change or effect the order of the items in the editor below.`;
        }
      });
      $$payload2.out += `<!----></div> <ul><li><input class="radio" type="radio" name="view-sort" id="view-sort" value="default"${attr("checked", defaultSort === "default", true)}> <label for="default">default</label></li> <li><input class="radio" type="radio" name="view-sort" id="view-sort" value="reverse"${attr("checked", defaultSort === "reverse", true)}> <label for="reverse">reverse</label></li> <li><input class="radio" type="radio" name="view-sort" id="view-sort" value="artist_asc"${attr("checked", defaultSort === "artist_asc", true)}> <label for="artist-asc">artists a --> z</label></li> <li><input class="radio" type="radio" name="view-sort" id="view-sort" value="artist_desc"${attr("checked", defaultSort === "artist_desc", true)}> <label for="artist-desc">artists z --> a</label></li></ul></fieldset> <fieldset><div class="label-group"><legend>Status of collection</legend> `;
      Tooltip($$payload2, {
        children: ($$payload3) => {
          $$payload3.out += `<u>Open</u> collections can be viewed and edited by anyone. <br> <br> <u>Public</u> collections can be viewed by anyone, but only edited by you. <br> <br> <u>Private</u> collections can only be viewed and edited by you.`;
        }
      });
      $$payload2.out += `<!----></div> <ul><li><input class="radio" type="radio" name="status" id="open" value="open"${attr("checked", collectionStatus === "open", true)}> <label for="open">open</label></li> <li><input class="radio" type="radio" name="status" id="public" value="public"${attr("checked", collectionStatus === "public", true)}> <label for="public">public</label></li> <li><input class="radio" type="radio" name="status" id="private" value="private"${attr("checked", collectionStatus === "private", true)}> <label for="private">private</label></li></ul></fieldset>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (collectionStatus && collectionStatus != "public") {
      $$payload2.out += "<!--[-->";
      InfoBox($$payload2, {
        mode: "inline",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(infoBoxText[collectionStatus])}`;
        }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="form-column"><label class="text-label" for="description">Collection Description</label> <textarea id="description" name="description" rows="10" cols="1" spellcheck="true" required>`;
    const $$body = escape_html(descriptionText);
    if ($$body) {
      $$payload2.out += `${$$body}`;
    }
    $$payload2.out += `</textarea> <div class="collection-info-button-spacing"><button type="button" class="double-border-top"><div class="inner-border">delete collection</div></button> <button class="double-border-top" formAction="?/updateCollection"${attr("disabled", !(collectionStatus && collectionTitle), true)}><div class="inner-border">save edits</div></button></div></div></form> `;
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
      get deletedItems() {
        return deletedItems;
      },
      set deletedItems($$value) {
        deletedItems = $$value;
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
    $$payload2.out += `<!----> <div class="bottom-double-border svelte-gc6ymb"></div></div> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<!---->delete collection?`;
      }, message = function($$payload3) {
        $$payload3.out += `<!---->Do you want to delete this collection? You will never be able to access it again.`;
      };
      SingleActionModal($$payload2, {
        formAction: "?/deleteCollection",
        buttonText: "delete collection",
        success: form?.success,
        get showModal() {
          return showModal;
        },
        set showModal($$value) {
          showModal = $$value;
          $$settled = false;
        },
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
    $$payload2.out += `<!----> <div class="buffer svelte-gc6ymb"></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};

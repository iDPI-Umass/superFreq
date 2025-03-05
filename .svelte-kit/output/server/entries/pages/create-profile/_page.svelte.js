import { c as copy_payload, a as assign_payload, p as pop, b as push, h as head, f as attr, e as escape_html } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
import "../../../chunks/ListModal.js";
import "../../../chunks/parseData.js";
/* empty css                                                     */
import "../../../chunks/MusicBrainzSearch.js";
import { N as NotificationModal } from "../../../chunks/NotificationModal.js";
import { R as RedirectModal } from "../../../chunks/RedirectModal.js";
import { A as AvatarSearch } from "../../../chunks/AvatarSearch.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  const email = data.email;
  let username = "";
  let displayName = "";
  let about = "";
  let website = "";
  let newItemAdded = false;
  let avatarItem = {};
  let delay = 5;
  let countdown = 0;
  let imgPromise = null;
  let avatarUrl = avatarItem?.avatar_url ?? "";
  let avatarInfo = {
    "img_url": avatarUrl,
    "last_fm_img_url": avatarItem?.last_fm_img_url,
    "artist_name": avatarItem?.artist_name,
    "artist_mbid": avatarItem?.artist_mbid,
    "release_group_name": avatarItem?.release_group_name,
    "release_group_mbid": avatarItem?.release_group_mbid,
    "label": avatarItem?.label
  };
  let showNotificationModal = form?.success == false ? true : false;
  let showRedirectModal = form?.success ? form?.success : false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		Create Profile
	</title>`;
    });
    $$payload2.out += `<div class="panel" id="profile-info">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>create profile</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <div class="form-wrapper svelte-427bvk"><form id="account-data" class="form-column" method="POST" action="?/create"><label class="text-label" for="email" form="account-data">Email</label> <input class="text" type="text" name="email" id="email" form="account-data"${attr("value", email)} disabled> <div class="label-group"><label class="text-label" for="username" form="account-data">Username</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="username" id="username" form="account-data"${attr("value", username)} required> <div class="label-group"><label class="text-label" for="display-name">Display name</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="display-name" id="display-name"${attr("value", displayName)} form="account-data" required> <label class="text-label" for="description">about me</label> <textarea id="about" name="about" rows="3" cols="1" maxlength="140" spellcheck="true">`;
    const $$body = escape_html(about);
    if ($$body) {
      $$payload2.out += `${$$body}`;
    }
    $$payload2.out += `</textarea> <label class="text-label" for="website">Website</label> <input class="text" type="url" name="website" id="website"${attr("value", website)}> <input type="hidden" name="avatarItem" id="avatarItem"${attr("value", JSON.stringify(avatarItem))}> <input type="hidden" name="avatarUrl" id="avatarUrl"${attr("value", avatarItem?.img_url ?? null)}> <input type="hidden" name="avatarMbid" id="avatarMbid"${attr("value", avatarItem.release_group_mbid ?? null)}></form> <div class="form-column"><label class="text-label" for="avatarUrl">Avatar</label> `;
    AvatarSearch($$payload2, {
      displayName,
      avatarUrl,
      avatarInfo,
      get newItemAdded() {
        return newItemAdded;
      },
      set newItemAdded($$value) {
        newItemAdded = $$value;
        $$settled = false;
      },
      get avatarItem() {
        return avatarItem;
      },
      set avatarItem($$value) {
        avatarItem = $$value;
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
    $$payload2.out += `<!----> <div class="actions svelte-427bvk"><button class="double-border-top" type="submit"${attr("disabled", true, true)} form="account-data" formaction="?/create"><div class="inner-border">submit</div></button></div></div></div></div> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>Try Another Username</span>`;
      }, message = function($$payload3) {
        $$payload3.out += `<span>That Username is already taken, but you can use it for your Display Name. <br> <br> Your Display Name is what other people on the site will actually see.</span>`;
      };
      NotificationModal($$payload2, {
        showModal: showNotificationModal,
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
    $$payload2.out += `<!----> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>Profiled created!</span>`;
      }, message = function($$payload3) {
        $$payload3.out += `<span>Automatically redirecting to our Community Guidelines in ${escape_html(countdown)} seconds.</span>`;
      };
      RedirectModal($$payload2, {
        showModal: showRedirectModal,
        delay,
        redirectPath: "/about/guidelines",
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
    $$payload2.out += `<!---->`;
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

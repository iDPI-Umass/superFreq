import { c as copy_payload, a as assign_payload, p as pop, b as push, h as head, f as attr, e as escape_html } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
import "../../../../chunks/ListModal.js";
import "../../../../chunks/parseData.js";
/* empty css                                                        */
import "../../../../chunks/MusicBrainzSearch.js";
import { P as PanelHeader } from "../../../../chunks/PanelHeader.js";
import { N as NotificationModal } from "../../../../chunks/NotificationModal.js";
import { A as AvatarSearch } from "../../../../chunks/AvatarSearch.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let { user, profile } = data;
  let success = form?.success;
  let newItemAdded = false;
  let displayName = profile?.display_name ?? "";
  let username = profile?.username ?? "";
  let website = profile?.website ?? "";
  let about = profile?.about ?? "";
  let email = user?.email;
  let avatarItem = {};
  let avatarMbid = avatarItem?.release_group_mbid ?? profile?.avatar_mbid ?? "";
  let avatarUrl = avatarItem?.avatar_url ?? profile?.avatar_url ?? "";
  let lastFmImgUrl = avatarItem?.last_fm_img_url ?? profile?.avatar_last_fm_img_url ?? "";
  let avatarArtist = avatarItem?.artist_name ?? profile?.avatar_artist_name ?? "";
  let avatarReleaseGroup = avatarItem?.release_group_name ?? profile?.avatar_release_group_name ?? "";
  let avatarInfo = {
    "img_url": avatarUrl,
    "last_fm_img_url": lastFmImgUrl,
    "artist_name": avatarArtist,
    "artist_mbid": avatarItem?.artist_mbid,
    "release_group_name": avatarReleaseGroup,
    "release_group_mbid": avatarItem?.release_group_mbid,
    "label": avatarItem?.label
  };
  let imgPromise = null;
  let loading = newItemAdded && !imgPromise ? true : false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		Account
	</title>`;
    });
    $$payload2.out += `<div class="panel" id="profile-info">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>profile info</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <div class="form-wrapper svelte-427bvk"><form id="account-data" class="form-column" method="post" action="?/update"><div class="label-group"><label class="text-label" for="email" form="account-data">Email</label> <a class="label-link" href="/account/update-email">update email</a></div> <input class="text" type="text" name="email" id="email" form="account-data"${attr("value", email)} disabled> <div class="label-group"><label class="text-label" for="username" form="account-data">Username</label> <a class="label-link" href="/account/update-username">update username</a></div> <input class="text" type="text" name="username" id="username" form="account-data"${attr("value", username)} disabled> <label class="text-label" for="displayName">Display name</label> <input class="text" type="text" name="displayName" id="displayName"${attr("value", displayName)}> <label class="text-label" for="description">about me</label> <textarea id="about" name="about" rows="3" cols="1" maxlength="140" spellcheck="true">`;
    const $$body = escape_html(about);
    if ($$body) {
      $$payload2.out += `${$$body}`;
    }
    $$payload2.out += `</textarea> <label class="text-label" for="website">Website</label> <input class="text" type="text" name="website" id="website"${attr("value", website)}> <input type="hidden" name="avatarItem" id="avatarmItem"${attr("value", JSON.stringify(avatarInfo))}> <input type="hidden" name="avatarUrl" id="avatarUrl"${attr("value", avatarUrl)}> <input type="hidden" name="newAvatarUrl" id="newAvatarUrl"${attr("value", avatarItem?.img_url ?? avatarItem?.last_fm_img_url ?? null)}> <input type="hidden" name="avatarMbid" id="avatarMbid"${attr("value", avatarMbid)}> <input type="hidden" name="newAvatarMbid" id="newAvatarMbid"${attr("value", avatarItem?.release_group_mbid ?? null)}> <input type="hidden" name="avatarName" id="avatarName"${attr("value", avatarItem?.release_group_name ?? null)}></form> <div class="form-column"><label class="text-label" for="avatarUrl">Avatar</label> `;
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
    $$payload2.out += `<!----> <div class="actions svelte-427bvk"><button form="account-data" class="double-border-top" type="submit"${attr("disabled", loading, true)}><div class="inner-border">${escape_html(loading ? "Loading..." : "Update profile")}</div></button> <form class="signout" method="post" action="?/signout"><button class="double-border-top" type="submit"${attr("disabled", loading, true)}><div class="inner-border">Sign Out</div></button></form></div></div></div></div> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>Success!</span>`;
      }, message = function($$payload3) {
        $$payload3.out += `<span>Your profile has been updated.</span>`;
      };
      NotificationModal($$payload2, {
        showModal: success,
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

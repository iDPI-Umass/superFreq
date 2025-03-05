import { b as push, c as copy_payload, a as assign_payload, j as bind_props, p as pop, s as stringify, g as await_block, f as attr } from "./index2.js";
import { M as MusicBrainzSearch } from "./MusicBrainzSearch.js";
import { C as CoverArt } from "./CoverArt.js";
import { w as wave } from "./freq-wave.js";
function AvatarSearch($$payload, $$props) {
  push();
  let {
    newItemAdded = false,
    displayName,
    avatarUrl,
    avatarItem = {},
    avatarInfo,
    imgPromise = null
  } = $$props;
  let avatarArtistName = avatarInfo["artist_name"];
  let avatarReleaseGroupName = avatarInfo["release_group_name"];
  function editorItemImage($$payload2, avatarItem2, altText) {
    $$payload2.out += `<!---->`;
    await_block(
      imgPromise,
      () => {
        $$payload2.out += `<img${attr("src", wave)} alt="loading cover art" class="svelte-1qx7hzq"> <p>Loading cover art.</p>`;
      },
      () => {
        $$payload2.out += `<img${attr("src", avatarItem2["img_url"] ?? avatarItem2["last_fm_img_url"] ?? wave)}${attr("alt", `${stringify(avatarItem2["img_url"] ?? avatarItem2["last_fm_img_url"] ? altText : "no available")} cover art`)} class="svelte-1qx7hzq">`;
      }
    );
    $$payload2.out += `<!---->`;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="mb-search svelte-1qx7hzq">`;
    MusicBrainzSearch($$payload2, {
      searchCategory: "release_groups",
      searchButtonText: "search",
      searchPlaceholder: "Search for an album",
      mode: "single",
      limit: "10",
      get addedItems() {
        return avatarItem;
      },
      set addedItems($$value) {
        avatarItem = $$value;
        $$settled = false;
      },
      get newItemAdded() {
        return newItemAdded;
      },
      set newItemAdded($$value) {
        newItemAdded = $$value;
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
    $$payload2.out += `<!----></div> <span class="tip">search for album cover to make your profile image</span> `;
    if (avatarUrl && !newItemAdded) {
      $$payload2.out += "<!--[-->";
      CoverArt($$payload2, {
        item: avatarInfo,
        altText: `${stringify(displayName)}'s avatar: ${stringify(avatarReleaseGroupName)} by ${stringify(avatarArtistName)}`
      });
    } else if (avatarItem && newItemAdded) {
      $$payload2.out += "<!--[1-->";
      editorItemImage($$payload2, avatarItem, avatarReleaseGroupName);
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { newItemAdded, avatarItem, imgPromise });
  pop();
}
export {
  AvatarSearch as A
};

import { g as await_block, f as attr, t as to_class, i as clsx, p as pop, b as push } from "./index2.js";
import { g as getLastFmCoverArt } from "./musicbrainz.js";
import { w as wave } from "./freq-wave.js";
/* empty css                                       */
function CoverArt($$payload, $$props) {
  push();
  let {
    item,
    imgUrl,
    artistName,
    releaseGroupName,
    altText,
    imgClass
  } = $$props;
  const coverArtItem = item != null ? item : {
    "img_url": imgUrl ?? null,
    "last_fm_img_url": null,
    "artist_name": artistName,
    "release_group_name": releaseGroupName
  };
  item ? coverArtItem["img_url"] : null;
  item ? item["last_fm_img_url"] ?? item["last_fm_avatar_img_url"] : null;
  if (coverArtItem["artist_name"] && coverArtItem["artist_name"] != null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    await_block(
      getLastFmCoverArt(coverArtItem),
      () => {
        $$payload.out += `<img${attr("src", wave)} alt="loading"${attr("class", to_class(clsx(imgClass), "svelte-711cl0"))}>`;
      },
      (result) => {
        $$payload.out += `<img${attr("src", result ? result : wave)}${attr("alt", result ? altText : "not found")}${attr("class", to_class(clsx(imgClass), "svelte-711cl0"))}>`;
      }
    );
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<img${attr("src", wave)} alt="not found"${attr("class", to_class(clsx(imgClass), "svelte-711cl0"))}>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  CoverArt as C
};

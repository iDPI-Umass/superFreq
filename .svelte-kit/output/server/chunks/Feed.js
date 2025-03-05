import { c as copy_payload, a as assign_payload, j as bind_props, p as pop, b as push, d as ensure_array_like, f as attr, e as escape_html } from "./index2.js";
import "./client.js";
import { c as parseTimestamp } from "./parseData.js";
import { P as PanelHeader } from "./PanelHeader.js";
import { N as NowPlayingPost } from "./NowPlayingPost.js";
import { C as CoverArt } from "./CoverArt.js";
function Feed($$payload, $$props) {
  push();
  let {
    sessionUserId,
    feedItems,
    mode,
    remaining,
    userActionSuccess = null,
    collections = [],
    showCollectionsListModal = false,
    showSaveSucessModal = false
  } = $$props;
  function avatarItem(item) {
    const avatar = {
      "img_url": item.avatar_url,
      "last_fm_img_url": item.avatar_last_fm_img_url,
      "artist_name": item.avatar_artist_name,
      "release_group_name": item.avatar_release_group_name
    };
    return avatar;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    const each_array = ensure_array_like(feedItems);
    $$payload2.out += `<div class="feed-panel">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>feed</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> `;
    if (feedItems.length == 0) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="feed-item-one-liner"><p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections">collections</a>.</p></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      $$payload2.out += `<div class="feed-item">`;
      if (item.item_type == "now_playing_post") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", `/posts/${item.username}/now-playing/${parseTimestamp(item.timestamp)}`)}><div class="feed-item-user-data">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> ${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)}
                    posted:</div></a> <div class="feed-post-spacer"><div class="feed-item-now-playing">`;
        NowPlayingPost($$payload2, {
          sessionUserId,
          post: item,
          mode: "feed",
          userActionSuccess,
          collections,
          get showCollectionsModal() {
            return showCollectionsListModal;
          },
          set showCollectionsModal($$value) {
            showCollectionsListModal = $$value;
            $$settled = false;
          },
          get showSaveSucessModal() {
            return showSaveSucessModal;
          },
          set showSaveSucessModal($$value) {
            showSaveSucessModal = $$value;
            $$settled = false;
          }
        });
        $$payload2.out += `<!----></div></div>`;
      } else if (item.item_type == "social_follow" && item.target_user_id == sessionUserId) {
        $$payload2.out += "<!--[1-->";
        $$payload2.out += `<a${attr("href", `/user/${item.username}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> ${escape_html(item.display_name)} followed you</div></a>`;
      } else if (item.item_type == "comment") {
        $$payload2.out += "<!--[2-->";
        $$payload2.out += `<a${attr("href", `/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}#${item.username?.concat(parseTimestamp(item.timestamp))}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> ${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)} commented on ${escape_html(item.parent_post_user_id == sessionUserId ? "your" : item.parent_post_display_name.concat(`'s`))} post</div></a>`;
      } else if (item.item_type == "reaction") {
        $$payload2.out += "<!--[3-->";
        $$payload2.out += `<a${attr("href", `/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> ${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)} liked ${escape_html(item.parent_post_user_id == sessionUserId ? "your" : item.parent_post_display_name.concat(`'s`))} post</div></a>`;
      } else if (item.item_type == "collection_follow") {
        $$payload2.out += "<!--[4-->";
        $$payload2.out += `<a${attr("href", `/collection/${item.collection_id}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> <span class="blurb">${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)}
                      followed ${escape_html(item.collection_owner_id == sessionUserId ? "your" : "a")} collection: <span class="feed-item-subject">${escape_html(item.collection_title)}</span></span></div></a>`;
      } else if (item.item_type == "collection_id" && !item.item_type.is_top_albums) {
        $$payload2.out += "<!--[5-->";
        $$payload2.out += `<a${attr("href", `/collection/${item.collection_id}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> <span class="blurb">${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)}
                      edited the collection: <span class="feed-item-subject">${escape_html(item.collection_)}</span></span></div></a>`;
      } else if (item.item_type == "collection_edit" && item.item_type.is_top_albums) {
        $$payload2.out += "<!--[6-->";
        $$payload2.out += `<a${attr("href", `/user/${item.username}`)}><div class="feed-item-one-liner">`;
        CoverArt($$payload2, {
          item: avatarItem(item),
          altText: `${item.display_name}'s avatar`,
          imgClass: "feed-avatar"
        });
        $$payload2.out += `<!----> <span class="blurb">${escape_html(item.user_id == sessionUserId ? "You" : item.display_name)}
                    edited their <span class="feed-item-subject">Top Albums</span> collection</span></div></a>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div>`;
    }
    $$payload2.out += `<!--]--> <form method="POST" action="?/loadMore" class="svelte-gp797e">`;
    if (remaining && remaining > 0) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="button-spacer svelte-gp797e"><button class="standard svelte-gp797e" formaction="?/loadMore">load more</button></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></form> `;
    if (mode == "mini") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="button-spacer svelte-gp797e"><button class="standard svelte-gp797e">see more</button></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { showCollectionsListModal, showSaveSucessModal });
  pop();
}
export {
  Feed as F
};

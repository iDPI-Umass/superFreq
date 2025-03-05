import { d as ensure_array_like, p as pop, b as push, f as attr, e as escape_html, h as head, s as stringify } from "../../../../../chunks/index2.js";
import "../../../../../chunks/client.js";
import { N as NowPlayingPost, U as UserActionsMenu } from "../../../../../chunks/NowPlayingPost.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { G as GridList } from "../../../../../chunks/GridList.js";
import { N as NewNowPlayingPost } from "../../../../../chunks/NewNowPlayingPost.js";
import { F as Feed } from "../../../../../chunks/Feed.js";
/* empty css                                                                      */
import "../../../../../chunks/parseData.js";
import { C as CoverArt } from "../../../../../chunks/CoverArt.js";
import { I as InfoBox } from "../../../../../chunks/InfoBox.js";
function NowPlayingPostsSample($$payload, $$props) {
  push();
  let {
    posts,
    username,
    displayName,
    moreItemsAvailable,
    sessionUserId = null
  } = $$props;
  if (posts && posts.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(posts);
    $$payload.out += `<div class="panel-medium">`;
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<a class="panel-header-link"${attr("href", `/user/${username}/now-playing-posts`)}>${escape_html(displayName)}'s Now Playing posts</a>`;
      };
      PanelHeader($$payload, { headerText });
    }
    $$payload.out += `<!----> <div class="posts-spacing svelte-1mvojoo"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let post = each_array[$$index];
      NowPlayingPost($$payload, { post, sessionUserId, mode: "feed" });
    }
    $$payload.out += `<!--]--></div> `;
    if (moreItemsAvailable) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<div class="button-spacer svelte-1mvojoo"><button class="standard svelte-1mvojoo">see more</button></div>`;
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></div>`;
  } else if (!posts || posts.length == 0) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="panel-medium"><div class="panel-button-buffer svelte-1mvojoo"><p class="svelte-1mvojoo">This user hasn't posted anything yet.</p></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let {
    sessionUserId,
    profileData,
    feedItems,
    totalAvailableItems,
    remaining,
    profileUsername,
    posts,
    sessionUserCollections,
    updatesPageUpdatedAt
  } = data;
  let {
    profileUserData,
    followInfo,
    permission,
    profileUserBlockInfo,
    profileUserFlagInfo
  } = profileData;
  console.log(profileUserData);
  const moreItemsAvailable = totalAvailableItems > feedItems.length ? true : false;
  const profileUserId = profileUserData?.id;
  let collectionCount = permission ? profileData?.collectionCount : null;
  let collectionFollowingCount = permission ? profileData?.collectionFollowingCount : null;
  let userFollowingCount = permission ? profileData?.userFollowingCount : null;
  let nowPlayingPostsCount = permission ? profileData?.nowPlayingPostsCount : null;
  let topAlbumsCollection = permission ? profileData?.topAlbumsCollection : null;
  let topAlbumsReturned = topAlbumsCollection ? true : false;
  let followingNow = followInfo?.follows_now ?? false;
  let profileUserBlocked = profileUserBlockInfo?.active ?? false;
  let profileUserFlagged = profileUserFlagInfo?.active ?? false;
  let displayName = profileUserData?.display_name;
  let imgUrl = profileUserData?.avatar_url;
  let lastFmImgUrl = profileUserData?.last_fm_img_url;
  let avatarArtistName = profileUserData?.avatar_artist_name;
  let avatarReleaseGroupName = profileUserData?.avatar_release_group_name;
  let avatarItem = {
    "img_url": imgUrl,
    "last_fm_img_url": lastFmImgUrl,
    "artist_name": avatarArtistName,
    "release_group_name": avatarReleaseGroupName
  };
  let isSessionUserProfile = profileUserData?.id == sessionUserId ? true : false;
  let showCollectionsListModal = form?.showCollectionsModal ?? false;
  let showSaveSucessModal = form?.updateSuccess ?? false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		${escape_html(displayName)}'s Profile
	</title>`;
  });
  $$payload.out += `<div class="profile-info"><div class="profile-info-box-left"><div class="avatar-user-data"><div class="cover-art-widget svelte-1ezepdk"><div class="avatar-image svelte-1ezepdk">`;
  CoverArt($$payload, {
    item: avatarItem,
    altText: `${displayName}'s avatar: ${avatarReleaseGroupName} by ${avatarArtistName}`
  });
  $$payload.out += `<!----></div> `;
  if (isSessionUserProfile) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="mini svelte-1ezepdk">edit</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="profile-info-box-column"><div class="profile-user-data-column"><div class="profile-displayname-username-column"><h2>${escape_html(profileUserData?.display_name)}</h2> <p class="data-muted">${escape_html(profileUserData?.username)}</p></div> <p>${escape_html(profileUserData?.about ?? "")}</p> <a class="about-website"${attr("href", profileUserData?.website)}>${escape_html(profileUserData?.website)}</a></div></div></div> <div class="profile-buttons-group">`;
  if (isSessionUserProfile) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="double-border-top"><div class="inner-border-condensed">edit profile</div></button>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<form method="POST" action="?/followUser"><input type="hidden" name="profile-user-id" id="profile-user-id"${attr("value", profileUserId)}> <button class="standard" type="submit" formaction="?/followUser">`;
    if (followingNow == true) {
      $$payload.out += "<!--[-->";
      $$payload.out += `unfollow`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `+ follow`;
    }
    $$payload.out += `<!--]--></button></form> `;
    UserActionsMenu($$payload, {
      mode: "profileMenu",
      blocked: profileUserBlocked,
      flagged: profileUserFlagged,
      profileUserId,
      success: form?.userActionSuccess
    });
    $$payload.out += `<!---->`;
  }
  $$payload.out += `<!--]--></div></div> <div class="profile-info-box-right"><div class="profile-stats-box" aria-label="user metrics"><div class="metric" aria-label="metric"><a class="metrics"${attr("href", `/user/${stringify(profileUsername)}/collections`)}><div class="numeral"><p class="metric-numerals">${escape_html(collectionCount)}</p></div> <p class="data-muted-uppercase">collections</p></a></div> <div class="metric" aria-label="metric"><a class="metrics"${attr("href", `/user/${stringify(profileUsername)}/now-playing-posts`)}><div class="numeral"><p class="metric-numerals">${escape_html(nowPlayingPostsCount)}</p></div> <p class="data-muted-uppercase">posts</p></a></div> <div class="metric" aria-label="metric"><a class="metrics"${attr("href", `/user/${stringify(profileUsername)}/collections-following`)}><div class="numeral"><p class="metric-numerals">${escape_html(collectionFollowingCount)}</p></div> <p class="data-muted-uppercase">collections followed</p></a></div> <div class="metric" aria-label="metric"><a class="metrics"${attr("href", `/user/${stringify(profileUsername)}/users-following`)}><div class="numeral"><p class="metric-numerals">${escape_html(userFollowingCount)}</p></div> <p class="data-muted-uppercase">users followed</p></a></div></div></div></div> <div class="border-full-vw"></div> <div class="content svelte-1ezepdk">`;
  if (topAlbumsCollection && topAlbumsCollection.length > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<div class="panel-medium">`;
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<span>top albums</span>`;
      }, button = function($$payload2) {
        $$payload2.out += `<span>`;
        if (profileUserData?.id == sessionUserId) {
          $$payload2.out += "<!--[-->";
          $$payload2.out += `<button class="standard">edit</button>`;
        } else {
          $$payload2.out += "<!--[!-->";
        }
        $$payload2.out += `<!--]--></span>`;
      };
      PanelHeader($$payload, {
        headerText,
        button
      });
    }
    $$payload.out += `<!----> `;
    GridList($$payload, {
      collectionContents: topAlbumsCollection,
      collectionReturned: topAlbumsReturned,
      collectionType: "release_groups",
      showTags: false,
      layout: "condensed-grid",
      mode: "view"
    });
    $$payload.out += `<!----></div>`;
  } else if (topAlbumsCollection?.length == 0 && profileUserData?.id == sessionUserId) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div class="panel-medium">`;
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<span>top albums</span>`;
      };
      PanelHeader($$payload, { headerText });
    }
    $$payload.out += `<!----> <div class="panel-button-buffer"><button class="standard">choose your top albums</button></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (profileUserData?.id == sessionUserId) {
    $$payload.out += "<!--[-->";
    InfoBox($$payload, {
      mode: "compact",
      children: ($$payload2) => {
        $$payload2.out += `<!---->New <a href="/about/updates#updates">updates and bug fixes</a> as of ${escape_html(updatesPageUpdatedAt)}`;
      }
    });
    $$payload.out += `<!----> `;
    NewNowPlayingPost($$payload, {});
    $$payload.out += `<!----> `;
    Feed($$payload, {
      sessionUserId,
      feedItems,
      mode: "feed",
      userActionSuccess: form?.userActionSuccess,
      remaining,
      collections: sessionUserCollections,
      showCollectionsListModal,
      showSaveSucessModal
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    NowPlayingPostsSample($$payload, {
      posts: feedItems,
      displayName,
      username: profileUsername,
      moreItemsAvailable
    });
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

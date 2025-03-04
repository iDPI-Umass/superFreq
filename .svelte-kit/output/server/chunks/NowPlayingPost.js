import { k as sanitize_props, o as spread_props, n as slot, c as copy_payload, a as assign_payload, j as bind_props, p as pop, b as push, f as attr, e as escape_html, d as ensure_array_like, s as stringify } from "./index2.js";
import "./client.js";
import "dequal";
import "./create.js";
import { P as Popover, a as Popover_trigger, b as Popover_content } from "./popover-trigger.js";
import { I as Icon } from "./Icon.js";
import { L as ListModal } from "./ListModal.js";
import { N as NotificationModal } from "./NotificationModal.js";
import { e as displayDate } from "./parseData.js";
import { D as Disc_2, M as Music, B as Boom_box } from "./boom-box.js";
import { C as CoverArt } from "./CoverArt.js";
import { I as InlineMarkdownText } from "./InlineMarkdownText.js";
function cubicOut(t) {
  const f = t - 1;
  return f * f * f + 1;
}
const defaultFlyAndScaleParams = { y: -8, start: 0.95, duration: 200 };
function flyAndScale(node, params) {
  const style = getComputedStyle(node);
  const transform = style.transform === "none" ? "" : style.transform;
  const withDefaults = { ...defaultFlyAndScaleParams, ...params };
  const scaleConversion = (valueA, scaleA, scaleB) => {
    const [minA, maxA] = scaleA;
    const [minB, maxB] = scaleB;
    const percentage = (valueA - minA) / (maxA - minA);
    const valueB = percentage * (maxB - minB) + minB;
    return valueB;
  };
  const styleToString = (style2) => {
    return Object.keys(style2).reduce((str, key) => {
      if (style2[key] === void 0) return str;
      return `${str}${key}:${style2[key]};`;
    }, "");
  };
  return {
    duration: withDefaults.duration ?? 200,
    delay: 0,
    css: (t) => {
      const y = scaleConversion(t, [0, 1], [withDefaults.y, 0]);
      const scale = scaleConversion(t, [0, 1], [withDefaults.start, 1]);
      return styleToString({
        transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
        opacity: t
      });
    },
    easing: cubicOut
  };
}
function Ban($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    ["path", { "d": "m4.9 4.9 14.2 14.2" }]
  ];
  Icon($$payload, spread_props([
    { name: "ban" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Circle($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "circle" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Ellipsis($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "1" }
    ],
    [
      "circle",
      { "cx": "19", "cy": "12", "r": "1" }
    ],
    ["circle", { "cx": "5", "cy": "12", "r": "1" }]
  ];
  Icon($$payload, spread_props([
    { name: "ellipsis" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Flag($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"
      }
    ],
    [
      "line",
      {
        "x1": "4",
        "x2": "4",
        "y1": "22",
        "y2": "15"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "flag" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Pen_line($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 20h9" }],
    [
      "path",
      {
        "d": "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "pen-line" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Trash_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      { "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }
    ],
    [
      "path",
      { "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }
    ],
    [
      "line",
      {
        "x1": "10",
        "x2": "10",
        "y1": "11",
        "y2": "17"
      }
    ],
    [
      "line",
      {
        "x1": "14",
        "x2": "14",
        "y1": "11",
        "y2": "17"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "trash-2" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function UserActionsMenu($$payload, $$props) {
  push();
  let {
    editState = false,
    mode,
    profileUserId = null,
    blocked = false,
    flagged = false,
    postId = null,
    success
  } = $$props;
  let popOverOpenState = false;
  const diaglogTitleOptions = {
    blockUser: "Block uesr?",
    deletePost: "Delete post?",
    flagPost: "Flag post?",
    reportUser: "Report user?",
    unblockUser: "Unblock user?"
  };
  const dialogTextOptions = {
    blockUser: "This user will no longer be able to see or interact with your profile data, posts, or private collections. They will be able to see your public and open collections.",
    deletePost: "This post will be permanently removed.",
    flagPost: "This will notify site admins that something about this post is fishy.",
    reportUser: "This will notify site admins that something about this user is fishy.",
    unblockUser: "This grants this user the same permission to see your activity that everyone else has."
  };
  const successTextOptions = {
    blockUser: "User blocked",
    deletePost: "Post deleted",
    flagPost: "Post flagged",
    reportUser: "User reported",
    unblockUser: "User unblocked"
  };
  const dialogConfirmButtonOptions = {
    blockUser: "block",
    deletePost: "delete",
    flagPost: "flag",
    reportUser: "report",
    unblockUser: "unblock"
  };
  const formIDs = {
    blockUser: "block",
    deletePost: "delete",
    flagPost: "flagPost",
    reportUser: "flag",
    unblockUser: "unblock"
  };
  const formActions = {
    blockUser: "?/blockUser",
    deletePost: "?/deletePost",
    flagPost: "?/flagPost",
    reportUser: "?/reportUser",
    unblockUser: "?/blockUser"
  };
  let dialogMode = void 0;
  let buttonsInactive = false;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Popover($$payload2, {
      get open() {
        return popOverOpenState;
      },
      set open($$value) {
        popOverOpenState = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Popover_trigger($$payload3, {
          children: ($$payload4) => {
            Ellipsis($$payload4, {
              size: "16",
              color: "var(--freq-color-text-muted)"
            });
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Popover_content($$payload3, {
          transition: flyAndScale,
          children: ($$payload4) => {
            if (mode == "profileMenu") {
              $$payload4.out += "<!--[-->";
              if (!blocked) {
                $$payload4.out += "<!--[-->";
                $$payload4.out += `<button class="popover-item">`;
                Ban($$payload4, {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                });
                $$payload4.out += `<!----> <span class="descriptor">block user</span></button>`;
              } else if (blocked) {
                $$payload4.out += "<!--[1-->";
                $$payload4.out += `<button class="popover-item">`;
                Circle($$payload4, {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                });
                $$payload4.out += `<!----> <span class="descriptor">unblock user</span></button>`;
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> `;
              if (!flagged) {
                $$payload4.out += "<!--[-->";
                $$payload4.out += `<button class="popover-item">`;
                Flag($$payload4, {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                });
                $$payload4.out += `<!----> <span class="descriptor">report user</span></button>`;
              } else if (flagged) {
                $$payload4.out += "<!--[1-->";
                $$payload4.out += `<button class="popover-item" disabled>`;
                Flag($$payload4, {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                });
                $$payload4.out += `<!----> <span class="descriptor">user reported</span></button>`;
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]-->`;
            } else if (mode == "sessionUserPostMenu") {
              $$payload4.out += "<!--[1-->";
              $$payload4.out += `<button class="popover-item">`;
              Pen_line($$payload4, {
                size: "16",
                color: "var(--freq-color-text-muted)"
              });
              $$payload4.out += `<!----> <span class="descriptor">edit</span></button> <button class="popover-item">`;
              Trash_2($$payload4, {
                size: "16",
                color: "var(--freq-color-text-muted)"
              });
              $$payload4.out += `<!----> <span class="descriptor">delete</span></button>`;
            } else if (mode = "postMenu") {
              $$payload4.out += "<!--[2-->";
              $$payload4.out += `<button class="popover-item">`;
              Flag($$payload4, {
                size: "16",
                color: "var(--freq-color-text-muted)"
              });
              $$payload4.out += `<!----> <span class="descriptor">flag post</span></button>`;
            } else {
              $$payload4.out += "<!--[!-->";
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <dialog aria-label="modal" class="svelte-1g8jhne"><form method="POST"${attr("id", formIDs[dialogMode])}${attr("action", formActions[dialogMode])}><input type="hidden" id="profile-user-id" name="profile-user-id"${attr("value", profileUserId)}> <input type="hidden" id="post-id" name="post-id"${attr("value", postId)}${attr("form", formIDs[dialogMode])}> `;
    if (success == null) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<h2>${escape_html(diaglogTitleOptions[dialogMode])}</h2> <p>${escape_html(dialogTextOptions[dialogMode])}</p> <div class="dialog-options svelte-1g8jhne"><button aria-label="close modal" formmethod="dialog" class="standard svelte-1g8jhne"${attr("disabled", buttonsInactive, true)}>cancel</button> <button aria-label="submit" type="submit" class="standard svelte-1g8jhne"${attr("formaction", formActions[dialogMode])}${attr("disabled", buttonsInactive, true)}>${escape_html(dialogConfirmButtonOptions[dialogMode])}</button></div>`;
    } else if (success == true) {
      $$payload2.out += "<!--[1-->";
      $$payload2.out += `<p>${escape_html(successTextOptions[dialogMode])}</p> <div class="dialog-options svelte-1g8jhne"><button aria-label="close modal" formmethod="dialog" class="standard svelte-1g8jhne">close</button></div>`;
    } else if (success == false) {
      $$payload2.out += "<!--[2-->";
      $$payload2.out += `<p>Something went wrong</p> <div class="dialog-options svelte-1g8jhne"><button aria-label="close modal" formmethod="dialog" class="standard svelte-1g8jhne">close</button></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></form></dialog>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { editState });
  pop();
}
function EditPostBody($$payload, $$props) {
  push();
  let { postData, editState = false } = $$props;
  let editPromise = false;
  $$payload.out += `<form method="POST" name="editPostText" class="vertical" action="?/editPost"><input id="post-data" name="post-data" type="hidden"${attr("value", JSON.stringify(postData))}> <textarea cols="1" rows="4" id="edited-text" name="edited-text" spellcheck="true" required>`;
  const $$body = escape_html(postData.text);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <div class="edit-submit-options svelte-1hf0syz"><button class="standard">cancel</button> <button type="submit" class="standard" formaction="?/editPost"${attr("disabled", editPromise, true)}>submit edit</button></div></form>`;
  bind_props($$props, { editState });
  pop();
}
function Heart($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "heart" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function LikeReact($$payload, $$props) {
  let { postId, reactionCount = 0, reactionActive } = $$props;
  let reactionPromise = false;
  $$payload.out += `<form method="POST" id="submitReaction" action="?/submitReaction"><input type="hidden" name="post-id" id="post-id"${attr("value", postId)}> <input type="hidden" name="reaction-type" id="reaction-type" value="like"> <button class="like" formaction="?/submitReaction"${attr("disabled", reactionPromise, true)}><div class="row-group-icon-description">`;
  if (reactionCount > 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span>${escape_html(reactionCount)}</span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> `;
  if (!reactionActive) {
    $$payload.out += "<!--[-->";
    Heart($$payload, {
      class: "icon",
      size: "16",
      color: "var(--freq-color-text-muted)"
    });
    $$payload.out += `<!----> <span class="descriptor">like</span>`;
  } else {
    $$payload.out += "<!--[!-->";
    Heart($$payload, {
      class: "icon",
      size: "16",
      color: "var(--freq-color-text-muted)",
      fill: "var(--freq-color-text-muted)"
    });
    $$payload.out += `<!----> <span class="descriptor">liked</span>`;
  }
  $$payload.out += `<!--]--></div></button></form>`;
}
function Save($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    ],
    [
      "path",
      {
        "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"
      }
    ],
    ["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
  ];
  Icon($$payload, spread_props([
    { name: "save" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function SaveToCollection($$payload, $$props) {
  let {
    showCollectionsListModal = false,
    showSuccessModal = false,
    postId,
    collections = []
  } = $$props;
  let addingItem = false;
  let savedToCollectionTitle = void 0;
  let savedToCollectionRoute = void 0;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<form method="POST" action="?/getCollectionList"><input type="hidden" id="post-id" name="post-id"${attr("value", postId)}> <button class="like" type="submit"><div class="row-group-icon-description">`;
    Save($$payload2, {
      class: "icon",
      size: "16",
      color: "var(--freq-color-text-muted)"
    });
    $$payload2.out += `<!----> <span class="descriptor">Save</span></div></button></form> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<!---->Save item to a collection`;
      }, list = function($$payload3) {
        const each_array = ensure_array_like(collections);
        $$payload3.out += `<ol class="list-modal"><!--[-->`;
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let collection = each_array[$$index];
          $$payload3.out += `<li class="list-modal"><div class="list-modal-li-row"><div class="list-modal-li-row-button-spacing"><form method="POST" action="?/saveToCollection"><input type="hidden" id="collection-id" name="collection-id"${attr("value", collection?.collection_id)}> <button class="add" type="submit"${attr("disabled", addingItem, true)}>+ save</button></form></div> ${escape_html(collection.title)}</div></li>`;
        }
        $$payload3.out += `<!--]--></ol>`;
      };
      ListModal($$payload2, {
        get showModal() {
          return showCollectionsListModal;
        },
        set showModal($$value) {
          showCollectionsListModal = $$value;
          $$settled = false;
        },
        headerText,
        list,
        $$slots: { headerText: true, list: true }
      });
    }
    $$payload2.out += `<!----> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<!---->Success!`;
      }, message = function($$payload3) {
        $$payload3.out += `<!---->Item saved to your collection <a${attr("href", savedToCollectionRoute)} class="svelte-1s94jns">${escape_html(savedToCollectionTitle)}</a>.`;
      };
      NotificationModal($$payload2, {
        get showModal() {
          return showSuccessModal;
        },
        set showModal($$value) {
          showSuccessModal = $$value;
          $$settled = false;
        },
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
  bind_props($$props, { showCollectionsListModal, showSuccessModal });
}
function Reply($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["polyline", { "points": "9 17 4 12 9 7" }],
    ["path", { "d": "M20 18v-2a4 4 0 0 0-4-4H4" }]
  ];
  Icon($$payload, spread_props([
    { name: "reply" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function Link_2($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M9 17H7A5 5 0 0 1 7 7h2" }],
    ["path", { "d": "M15 7h2a5 5 0 1 1 0 10h-2" }],
    [
      "line",
      {
        "x1": "8",
        "x2": "16",
        "y1": "12",
        "y2": "12"
      }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "link-2" },
    $$sanitized_props,
    {
      iconNode,
      children: ($$payload2) => {
        $$payload2.out += `<!---->`;
        slot($$payload2, $$props, "default", {}, null);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
}
function ListenEmbed($$payload, $$props) {
  let { embedInfo } = $$props;
  let { id, source } = embedInfo;
  if (source == "bandcamp") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<iframe style="border: 0; width: 100%; height: 42px;"${attr("src", `https://bandcamp.com/EmbeddedPlayer/${stringify(id)}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/`)} title="Bandcamp player" seamless></iframe>`;
  } else if (source == "soundcloud") {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"${attr("src", `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${stringify(id)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`)} title="Soundcloud player"></iframe>`;
  } else if (source == "youtube") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div class="youtube svelte-qhmpvb"><iframe width="100%"${attr("src", `https://www.youtube.com/embed/${stringify(id)}`)} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen class="svelte-qhmpvb"></iframe></div>`;
  } else if (source == "mixcloud") {
    $$payload.out += "<!--[3-->";
    $$payload.out += `<iframe width="100%" height="120"${attr("src", `https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&feed=${stringify(id)}`)} frameborder="0" title="Mixcloud player"></iframe>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function NowPlayingTag($$payload, $$props) {
  let { artistName, itemTitle, itemType } = $$props;
  if (itemType == "release_group") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<span class="now-playing-text"${attr("aria-details", `Now Playing album ${stringify(itemTitle)} by ${stringify(artistName)}`)}>`;
    Disc_2($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----> ${escape_html(artistName)} • ${escape_html(itemTitle)} `;
    Disc_2($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----></span>`;
  } else if (itemType == "recording") {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<span class="now-playing-text"${attr("aria-details", `Now Playing track ${stringify(itemTitle)} by ${stringify(artistName)}`)}>`;
    Music($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----> ${escape_html(artistName)} • ${escape_html(itemTitle)} `;
    Music($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----></span>`;
  } else if (itemType == "episode") {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<span class="now-playing-text"${attr("aria-details", `Now Playing mix ${stringify(itemTitle)} by ${stringify(artistName)}`)}>`;
    Boom_box($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----> ${escape_html(artistName)} • ${escape_html(itemTitle)} `;
    Boom_box($$payload, {
      size: "16",
      color: "var(--freq-color-text-medium-dark)"
    });
    $$payload.out += `<!----></span>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
}
function NowPlayingPost($$payload, $$props) {
  push();
  let {
    sessionUserId = null,
    post,
    editState = false,
    mode = null,
    // valid values are null, "feed", and "sample"
    userActionSuccess,
    collections = [],
    showCollectionsModal = false,
    showSaveSucessModal = false
  } = $$props;
  const permalinkTimestampString = (post?.created_at ?? post?.timestamp).toISOString();
  const permalinkTimestamp = Date.parse(permalinkTimestampString).toString();
  const permalink = `/posts/${post.username}/now-playing/${permalinkTimestamp}`;
  const embedInfo = {
    "id": post?.embed_id,
    "source": post?.embed_source,
    "title": post?.release_group_name ?? post?.recording_name ?? post?.episode_title,
    "artist": post?.artist_name,
    "account": post?.embed_account,
    "url": post?.listen_url
  };
  console.log(post?.reaction_user_ids.includes(sessionUserId));
  let reactionActiveFeed = post?.reaction_user_ids ? post?.reaction_user_ids.includes(sessionUserId) : null;
  let reactionActive = post?.reaction_active ?? null;
  let reactionCount = post?.reaction_count;
  let postId = post?.id ?? post?.post_id;
  let avatarItem = {
    "img_url": post.avatar_url,
    "last_fm_img_url": post.avatar_last_fm_img_url,
    "artist_name": post.avatar_artist_name,
    "release_group_name": post.avatar_release_group_name
  };
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="box svelte-nwi32j"><div class="double-border svelte-nwi32j"><div class="post-row"><div class="row-group-user-data">`;
    CoverArt($$payload2, {
      item: avatarItem,
      artistName: post.avatar_artist_name,
      releaseGroupName: post.avatar_release_group_name,
      altText: `${post.display_name}'s avatar`,
      imgClass: "avatar"
    });
    $$payload2.out += `<!----> <div class="row-group-column"><a${attr("href", `/user/${stringify(post.username)}`)}><span class="display-name">${escape_html(post.display_name)}</span></a> <a${attr("href", permalink)}><span class="date" aria-label="permalink">${escape_html(displayDate(post.created_at ?? post.timestamp))} `;
    Link_2($$payload2, {
      size: "15",
      color: "var(--freq-color-text-muted)"
    });
    $$payload2.out += `<!----></span></a></div></div> <div class="row-group">`;
    if (post.status === "edited") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<span class="status-badge">edited</span>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div></div> <div class="post-body">`;
    if (post.artist_name) {
      $$payload2.out += "<!--[-->";
      NowPlayingTag($$payload2, {
        artistName: post.artist_name,
        itemTitle: post.recording_name ?? post.release_group_name ?? post.episode_title,
        itemType: post.item_type
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (!editState) {
      $$payload2.out += "<!--[-->";
      InlineMarkdownText($$payload2, { text: post.text });
    } else {
      $$payload2.out += "<!--[!-->";
      EditPostBody($$payload2, {
        postData: post,
        get editState() {
          return editState;
        },
        set editState($$value) {
          editState = $$value;
          $$settled = false;
        }
      });
    }
    $$payload2.out += `<!--]--> `;
    if (embedInfo?.id != null) {
      $$payload2.out += "<!--[-->";
      ListenEmbed($$payload2, { embedInfo });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="post-row">`;
    if (mode != "sample") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="row-group-icons">`;
      LikeReact($$payload2, {
        postId,
        reactionActive: reactionActive ?? reactionActiveFeed,
        reactionCount
      });
      $$payload2.out += `<!----> `;
      if (mode == "feed") {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `<a${attr("href", permalink)}><div class="row-group-icon-description">`;
        Reply($$payload2, {
          size: "16",
          color: "var(--freq-color-text-muted)"
        });
        $$payload2.out += `<!----> <span class="descriptor">reply</span></div></a>`;
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--> `;
      if (post.artist_mbid || post.user_added_metadata_id) {
        $$payload2.out += "<!--[-->";
        SaveToCollection($$payload2, {
          postId,
          collections,
          get showCollectionsListModal() {
            return showCollectionsModal;
          },
          set showCollectionsListModal($$value) {
            showCollectionsModal = $$value;
            $$settled = false;
          },
          get showSuccessModal() {
            return showSaveSucessModal;
          },
          set showSuccessModal($$value) {
            showSaveSucessModal = $$value;
            $$settled = false;
          }
        });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div> <div class="row-group-icon-description">`;
      if (post.user_id == sessionUserId) {
        $$payload2.out += "<!--[-->";
        UserActionsMenu($$payload2, {
          mode: "sessionUserPostMenu",
          postId: post.id ?? post.now_playing_post_id,
          success: userActionSuccess,
          get editState() {
            return editState;
          },
          set editState($$value) {
            editState = $$value;
            $$settled = false;
          }
        });
      } else if (sessionUserId) {
        $$payload2.out += "<!--[1-->";
        UserActionsMenu($$payload2, {
          mode: "postMenu",
          postId: post.id ?? post.now_playing_post_id,
          success: userActionSuccess
        });
      } else {
        $$payload2.out += "<!--[!-->";
      }
      $$payload2.out += `<!--]--></div>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, {
    editState,
    showCollectionsModal,
    showSaveSucessModal
  });
  pop();
}
export {
  Link_2 as L,
  NowPlayingPost as N,
  UserActionsMenu as U
};

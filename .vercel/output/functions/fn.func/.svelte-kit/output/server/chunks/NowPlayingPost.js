import { c as create_ssr_component, v as validate_component, i as createEventDispatcher, d as add_attribute, f as escape } from "./ssr.js";
/* empty css      */
import "dequal";
import "./updater.js";
import "devalue";
import "./client.js";
import { P as Popover, a as Popover_trigger, b as Popover_content } from "./popover-trigger.js";
import { I as Icon } from "./Icon.js";
import { d as displayDate } from "./parseData.js";
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
const Ellipsis = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "1" }],
    ["circle", { "cx": "19", "cy": "12", "r": "1" }],
    ["circle", { "cx": "5", "cy": "12", "r": "1" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "ellipsis" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Pen_line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M12 20h9" }],
    [
      "path",
      {
        "d": "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "pen-line" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Trash_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M3 6h18" }],
    [
      "path",
      {
        "d": "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
      }
    ],
    [
      "path",
      {
        "d": "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
      }
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
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "trash-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Ban = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "m4.9 4.9 14.2 14.2" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "ban" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [["circle", { "cx": "12", "cy": "12", "r": "10" }]];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "circle" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Flag = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "flag" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const css$2 = {
  code: "dialog[open].svelte-17rjaxj.svelte-17rjaxj{display:flex;flex-direction:column;margin-top:35%;text-decoration:none;gap:var(--freq-height-spacer-gap)}dialog[open].svelte-17rjaxj.svelte-17rjaxj::backdrop{background-color:rgb(0 0 0 / 50%)}.dialog-options.svelte-17rjaxj.svelte-17rjaxj{display:flex;flex-direction:row;justify-content:space-between}dialog.svelte-17rjaxj button.svelte-17rjaxj{width:fit-content;text-transform:uppercase;padding:var(--freq-spacing-2x-small) var(--freq-spacing-x-small);font-weight:var(--freq-font-weight-bold);text-align:center}",
  map: `{"version":3,"file":"UserActionsMenu.svelte","sources":["UserActionsMenu.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { onMount, createEventDispatcher } from \\"svelte\\";\\nimport { enhance } from \\"$app/forms\\";\\nimport { Popover } from \\"bits-ui\\";\\nimport { flyAndScale } from \\"$lib/utils/transitions.ts\\";\\nimport Ban from \\"lucide-svelte/icons/ban\\";\\nimport Circle from \\"lucide-svelte/icons/circle\\";\\nimport Ellipsis from \\"lucide-svelte/icons/ellipsis\\";\\nimport Flag from \\"lucide-svelte/icons/flag\\";\\nimport PenLine from \\"lucide-svelte/icons/pen-line\\";\\nimport Trash2 from \\"lucide-svelte/icons/trash-2\\";\\nexport let editState = false;\\nexport let mode;\\nexport let profileUserId = null;\\nexport let blocked = false;\\nexport let flagged = false;\\nexport let postId = null;\\nexport let success = null;\\nlet popOverOpenState;\\nlet showModal = false;\\nlet dialog;\\nconst diaglogTitleOptions = {\\n  blockUser: \\"Block uesr?\\",\\n  deletePost: \\"Delete post?\\",\\n  flagPost: \\"Flag post?\\",\\n  reportUser: \\"Report user?\\",\\n  unblockUser: \\"Unblock user?\\"\\n};\\nconst dialogTextOptions = {\\n  blockUser: \\"This user will no longer be able to see or interact with your profile data, posts, or private collections. They will be able to see your public and open collections.\\",\\n  deletePost: \\"This post will be permanently removed.\\",\\n  flagPost: \\"This will notify site admins that something about this post is fishy.\\",\\n  reportUser: \\"This will notify site admins that something about this user is fishy.\\",\\n  unblockUser: \\"This grants this user the same permission to see your activity that everyone else has.\\"\\n};\\nconst dialogConfirmButtonOptions = {\\n  blockUser: \\"block\\",\\n  deletePost: \\"delete\\",\\n  flagPost: \\"flag\\",\\n  reportUser: \\"report\\",\\n  unblockUser: \\"unblock\\"\\n};\\nconst formIDs = {\\n  blockUser: \\"block\\",\\n  deletePost: \\"delete\\",\\n  flagPost: \\"flagPost\\",\\n  reportUser: \\"flag\\",\\n  unblockUser: \\"unblock\\"\\n};\\nconst formActions = {\\n  blockUser: \\"?/blockUser\\",\\n  deletePost: \\"?/deletePost\\",\\n  flagPost: \\"?/flagPost\\",\\n  reportUser: \\"?/reportUser\\",\\n  unblockUser: \\"?/blockUser\\"\\n};\\nlet dialogMode;\\n$: if (dialog && showModal == true) dialog.showModal();\\n$: if (dialog && !showModal) dialog.close();\\nfunction toggleEditState() {\\n  editState = !editState;\\n  popOverOpenState = !popOverOpenState;\\n}\\nfunction openDialog(mode2) {\\n  popOverOpenState = !popOverOpenState;\\n  dialogMode = mode2;\\n  showModal = true;\\n}\\nfunction closeDialog() {\\n  showModal = false;\\n}\\nonMount(() => {\\n  dialog.addEventListener(\\"click\\", (e) => {\\n    const dialogDimensions = dialog.getBoundingClientRect();\\n    if (e.clientX < dialogDimensions.left || e.clientX > dialogDimensions.right || e.clientY < dialogDimensions.top || e.clientY > dialogDimensions.bottom) {\\n      dialog.close();\\n    }\\n  });\\n});\\nconst dispatch = createEventDispatcher();\\n<\/script>\\n\\n<svelte:window\\n\\ton:keydown={(e) => {\\n\\t\\tif (e.key === 'Escape') {\\n\\t\\t\\tdispatch(dialog.close());\\n\\t\\t}\\n\\t}}\\n/>\\n\\n<Popover.Root\\n    closeOnEscape={true}\\n    closeOnOutsideClick={true}\\n    bind:open={popOverOpenState}\\n>\\n    <Popover.Trigger>\\n        <Ellipsis size=\\"16\\" color=\\"var(--freq-color-text-muted)\\"></Ellipsis>\\n    </Popover.Trigger>\\n    <Popover.Content transition={flyAndScale}>\\n        {#if mode == 'profileMenu'}\\n            {#if !blocked}\\n                <button \\n                    class=\\"popover-item\\" \\n                    on:click|preventDefault={() => openDialog('blockUser')}\\n                >\\n                    <Ban \\n                        size=\\"16\\" \\n                        color=\\"var(--freq-color-text-muted)\\"\\n                    ></Ban>\\n                    <span class=\\"descriptor\\">\\n                        block user\\n                    </span>\\n                </button>\\n            {:else if blocked}\\n                <button \\n                    class=\\"popover-item\\" \\n                    on:click|preventDefault={() => openDialog('unblockUser')}\\n                >\\n                    <Circle \\n                        size=\\"16\\" \\n                        color=\\"var(--freq-color-text-muted)\\"\\n                    ></Circle>\\n                    <span class=\\"descriptor\\">\\n                        unblock user\\n                    </span>\\n                </button>\\n            {/if}\\n            {#if !flagged}\\n                <button\\n                    class=\\"popover-item\\" \\n                    on:click|preventDefault={() => openDialog('reportUser')} \\n                >\\n                    <Flag \\n                        size=\\"16\\" \\n                        color=\\"var(--freq-color-text-muted)\\"\\n                    ></Flag>\\n                    <span class=\\"descriptor\\">\\n                        report user\\n                    </span>\\n                </button>\\n            {:else if flagged}\\n            <button\\n                class=\\"popover-item\\" \\n                on:click|preventDefault={() => openDialog('reportUser')} \\n                disabled\\n            >\\n                <Flag \\n                    size=\\"16\\" \\n                    color=\\"var(--freq-color-text-muted)\\"\\n                ></Flag>\\n                <span class=\\"descriptor\\">\\n                    user reported\\n                </span>\\n            </button>\\n            {/if}\\n        {:else if mode = 'postMenu'}\\n            <button\\n                class=\\"popover-item\\" \\n                on:click|preventDefault={() => openDialog('flagPost')} \\n            >\\n                <Flag \\n                    size=\\"16\\" \\n                    color=\\"var(--freq-color-text-muted)\\"\\n                ></Flag>\\n                <span class=\\"descriptor\\">\\n                    flag post\\n                </span>\\n            </button>\\n        {:else if mode == 'sessionUserPostMenu'}\\n            <button \\n                class=\\"popover-item\\" \\n                on:click|preventDefault={toggleEditState}\\n            >\\n                <PenLine \\n                    size=\\"16\\" \\n                    color=\\"var(--freq-color-text-muted)\\"\\n                ></PenLine>\\n                <span class=\\"descriptor\\">\\n                    edit\\n                </span>\\n            </button>\\n            <button\\n                class=\\"popover-item\\" \\n                on:click|preventDefault={() => openDialog('deletePost')} \\n            >\\n                <Trash2 \\n                    size=\\"16\\" \\n                    color=\\"var(--freq-color-text-muted)\\"\\n                ></Trash2>\\n                <span class=\\"descriptor\\">\\n                    delete\\n                </span>\\n            </button>\\n        {/if}\\n    </Popover.Content>\\n</Popover.Root>\\n\\n<dialog\\n    aria-label=\\"modal\\"\\n    bind:this={dialog}\\n\\ton:close={() => (showModal = false)}\\n>\\n    <form \\n        method=\\"POST\\" \\n        id={formIDs[dialogMode]} \\n        action={formActions[dialogMode]}\\n        use:enhance\\n    >\\n    <input\\n        type=\\"hidden\\"\\n        id=\\"profile-user-id\\"\\n        name=\\"profile-user-id\\"\\n        value={profileUserId}\\n    />\\n    <input\\n        type=\\"hidden\\"\\n        id=\\"post-id\\"\\n        name=\\"post-id\\"\\n        value={postId}\\n    />\\n    {#if success == null}\\n        <h2>{diaglogTitleOptions[dialogMode]}</h2>\\n        {dialogTextOptions[dialogMode]}\\n        <div class=\\"dialog-options\\">\\n            <button \\n                aria-label=\\"close modal\\" \\n                formmethod=\\"dialog\\" \\n                on:click={closeDialog}\\n            >\\n                cancel\\n            </button>\\n            <button \\n                aria-label=\\"submit\\" \\n                type=\\"submit\\"\\n                formaction={formActions[dialogMode]}\\n            >\\n                {dialogConfirmButtonOptions[dialogMode]}\\n            </button>\\n        </div>\\n    {:else if success == true}\\n        Successful submission\\n        <div class=\\"dialog-options\\">\\n            <button \\n                aria-label=\\"close modal\\" \\n                formmethod=\\"dialog\\" \\n                on:click={closeDialog}\\n            >\\n                close\\n            </button>\\n        </div>\\n    {:else if success == false}\\n        Something went wrong\\n        <div class=\\"dialog-options\\">\\n            <button \\n                aria-label=\\"close modal\\" \\n                formmethod=\\"dialog\\" \\n                on:click={closeDialog}\\n            >\\n                close\\n            </button>\\n        </div>\\n    {/if}\\n    </form>\\n</dialog>\\n\\n<style>\\n\\tdialog[open] {\\n        display: flex;\\n        flex-direction: column;\\n        margin-top: 35%;\\n        text-decoration: none;\\n        gap: var(--freq-height-spacer-gap);\\n    }\\n    dialog[open]::backdrop {\\n        background-color: rgb(0 0 0 / 50%);\\n    }\\n    .dialog-options {\\n        display: flex;\\n        flex-direction: row;\\n        justify-content: space-between;\\n    }\\n\\tdialog button {\\n\\t\\twidth: fit-content;\\n\\t\\ttext-transform: uppercase;\\n\\t\\tpadding: var(--freq-spacing-2x-small) var(--freq-spacing-x-small);\\n\\t\\tfont-weight: var(--freq-font-weight-bold);\\n\\t\\ttext-align: center;\\n\\t}\\n</style>"],"names":[],"mappings":"AAyQC,MAAM,CAAC,IAAI,+BAAE,CACN,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,UAAU,CAAE,GAAG,CACf,eAAe,CAAE,IAAI,CACrB,GAAG,CAAE,IAAI,wBAAwB,CACrC,CACA,MAAM,CAAC,IAAI,+BAAC,UAAW,CACnB,gBAAgB,CAAE,IAAI,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,GAAG,CACrC,CACA,6CAAgB,CACZ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,eAAe,CAAE,aACrB,CACH,qBAAM,CAAC,qBAAO,CACb,KAAK,CAAE,WAAW,CAClB,cAAc,CAAE,SAAS,CACzB,OAAO,CAAE,IAAI,uBAAuB,CAAC,CAAC,IAAI,sBAAsB,CAAC,CACjE,WAAW,CAAE,IAAI,uBAAuB,CAAC,CACzC,UAAU,CAAE,MACb"}`
};
const UserActionsMenu = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { editState = false } = $$props;
  let { mode } = $$props;
  let { profileUserId = null } = $$props;
  let { blocked = false } = $$props;
  let { flagged = false } = $$props;
  let { postId = null } = $$props;
  let { success = null } = $$props;
  let popOverOpenState;
  let dialog;
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
  let dialogMode;
  createEventDispatcher();
  if ($$props.editState === void 0 && $$bindings.editState && editState !== void 0) $$bindings.editState(editState);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  if ($$props.profileUserId === void 0 && $$bindings.profileUserId && profileUserId !== void 0) $$bindings.profileUserId(profileUserId);
  if ($$props.blocked === void 0 && $$bindings.blocked && blocked !== void 0) $$bindings.blocked(blocked);
  if ($$props.flagged === void 0 && $$bindings.flagged && flagged !== void 0) $$bindings.flagged(flagged);
  if ($$props.postId === void 0 && $$bindings.postId && postId !== void 0) $$bindings.postId(postId);
  if ($$props.success === void 0 && $$bindings.success && success !== void 0) $$bindings.success(success);
  $$result.css.add(css$2);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = ` ${validate_component(Popover, "Popover.Root").$$render(
      $$result,
      {
        closeOnEscape: true,
        closeOnOutsideClick: true,
        open: popOverOpenState
      },
      {
        open: ($$value) => {
          popOverOpenState = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(Popover_trigger, "Popover.Trigger").$$render($$result, {}, {}, {
            default: () => {
              return `${validate_component(Ellipsis, "Ellipsis").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )}`;
            }
          })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { transition: flyAndScale }, {}, {
            default: () => {
              return `${mode == "profileMenu" ? `${!blocked ? `<button class="popover-item">${validate_component(Ban, "Ban").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-zaapiu">block user</span></button>` : `${blocked ? `<button class="popover-item">${validate_component(Circle, "Circle").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-hwt3nh">unblock user</span></button>` : ``}`} ${!flagged ? `<button class="popover-item">${validate_component(Flag, "Flag").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-1bambbl">report user</span></button>` : `${flagged ? `<button class="popover-item" disabled>${validate_component(Flag, "Flag").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-pcrjmo">user reported</span></button>` : ``}`}` : `${(mode = "postMenu") ? `<button class="popover-item">${validate_component(Flag, "Flag").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-19jnfya">flag post</span></button>` : `${mode == "sessionUserPostMenu" ? `<button class="popover-item">${validate_component(Pen_line, "PenLine").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-vtulc2">edit</span></button> <button class="popover-item">${validate_component(Trash_2, "Trash2").$$render(
                $$result,
                {
                  size: "16",
                  color: "var(--freq-color-text-muted)"
                },
                {},
                {}
              )} <span class="descriptor" data-svelte-h="svelte-184ttx5">delete</span></button>` : ``}`}`}`;
            }
          })}`;
        }
      }
    )} <dialog aria-label="modal" class="svelte-17rjaxj"${add_attribute("this", dialog, 0)}><form method="POST"${add_attribute("id", formIDs[dialogMode], 0)}${add_attribute("action", formActions[dialogMode], 0)}><input type="hidden" id="profile-user-id" name="profile-user-id"${add_attribute("value", profileUserId, 0)}> <input type="hidden" id="post-id" name="post-id"${add_attribute("value", postId, 0)}> ${success == null ? `<h2>${escape(diaglogTitleOptions[dialogMode])}</h2> ${escape(dialogTextOptions[dialogMode])} <div class="dialog-options svelte-17rjaxj"><button aria-label="close modal" formmethod="dialog" class="svelte-17rjaxj" data-svelte-h="svelte-gp2y5i">cancel</button> <button aria-label="submit" type="submit"${add_attribute("formaction", formActions[dialogMode], 0)} class="svelte-17rjaxj">${escape(dialogConfirmButtonOptions[dialogMode])}</button></div>` : `${success == true ? `Successful submission
        <div class="dialog-options svelte-17rjaxj"><button aria-label="close modal" formmethod="dialog" class="svelte-17rjaxj" data-svelte-h="svelte-f8e6nc">close</button></div>` : `${success == false ? `Something went wrong
        <div class="dialog-options svelte-17rjaxj"><button aria-label="close modal" formmethod="dialog" class="svelte-17rjaxj" data-svelte-h="svelte-f8e6nc">close</button></div>` : ``}`}`}</form> </dialog>`;
  } while (!$$settled);
  return $$rendered;
});
const css$1 = {
  code: ".edit-submit-options.svelte-1hf0syz{display:flex;flex-direction:row;justify-content:space-between}",
  map: '{"version":3,"file":"EditPostBody.svelte","sources":["EditPostBody.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let postData;\\nexport let editState = false;\\nfunction toggleEditState() {\\n  editState = !editState;\\n}\\n<\/script>\\n\\n<form name=\\"editPostText\\" class=\\"vertical\\" action=\\"?/editPost\\">\\n    <input \\n        id=\\"post-data\\"\\n        name=\\"post-data\\"\\n        type=\\"hidden\\"\\n        value={postData}\\n    />\\n    <textarea\\n        cols=\\"1\\"\\n        rows=\\"4\\"\\n        id = \\"edited-text\\"\\n        name=\\"edited-text\\"\\n        spellcheck=true \\n        required\\n    >{postData.text}</textarea>\\n    <div class=\\"edit-submit-options\\">\\n        <button class=\\"standard\\" on:click|preventDefault={toggleEditState}>\\n            cancel\\n        </button>\\n        <button class=\\"standard\\" formaction=\\"?/editPost\\">\\n            submit edit\\n        </button>\\n    </div>\\n</form>\\n\\n<style>\\n    .edit-submit-options {\\n        display: flex;\\n        flex-direction: row;\\n        justify-content: space-between;\\n    }\\n</style>"],"names":[],"mappings":"AAiCI,mCAAqB,CACjB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,eAAe,CAAE,aACrB"}'
};
const EditPostBody = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { postData } = $$props;
  let { editState = false } = $$props;
  if ($$props.postData === void 0 && $$bindings.postData && postData !== void 0) $$bindings.postData(postData);
  if ($$props.editState === void 0 && $$bindings.editState && editState !== void 0) $$bindings.editState(editState);
  $$result.css.add(css$1);
  return `<form name="editPostText" class="vertical" action="?/editPost"><input id="post-data" name="post-data" type="hidden"${add_attribute("value", postData, 0)}> <textarea cols="1" rows="4" id="edited-text" name="edited-text" spellcheck="true" required>${escape(postData.text, false)}</textarea> <div class="edit-submit-options svelte-1hf0syz"><button class="standard" data-svelte-h="svelte-1aodm5e">cancel</button> <button class="standard" formaction="?/editPost" data-svelte-h="svelte-nvbt7d">submit edit</button></div> </form>`;
});
const Heart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "path",
      {
        "d": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "heart" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const LikeReact = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { postId } = $$props;
  let { reactionActive } = $$props;
  if ($$props.postId === void 0 && $$bindings.postId && postId !== void 0) $$bindings.postId(postId);
  if ($$props.reactionActive === void 0 && $$bindings.reactionActive && reactionActive !== void 0) $$bindings.reactionActive(reactionActive);
  return `  <form method="POST" action="?/submitReaction"><input type="hidden" name="post-id" id="post-id"${add_attribute("value", postId, 0)}> <input type="hidden" name="reaction-type" id="reaction-type" value="like"> <button class="like" formaction="?/submitReaction"><div class="row-group-icon-description">${!reactionActive ? `${validate_component(Heart, "Heart").$$render(
    $$result,
    {
      class: "icon",
      size: "16",
      color: "var(--freq-color-text-muted)"
    },
    {},
    {}
  )}` : `${validate_component(Heart, "Heart").$$render(
    $$result,
    {
      class: "icon",
      size: "16",
      color: "var(--freq-color-text-muted)",
      fill: "var(--freq-color-text-muted)"
    },
    {},
    {}
  )}`} <span class="descriptor" data-svelte-h="svelte-1863h6x">like</span></div> </button></form>`;
});
const Reply = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["polyline", { "points": "9 17 4 12 9 7" }],
    ["path", { "d": "M20 18v-2a4 4 0 0 0-4-4H4" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "reply" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Link_2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
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
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "link-2" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Music = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["path", { "d": "M9 18V5l12-2v13" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    ["circle", { "cx": "18", "cy": "16", "r": "3" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "music" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const ListenEmbed = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { embedInfo } = $$props;
  const url = embedInfo.url;
  const id = embedInfo.id;
  const source = embedInfo.source;
  const title = embedInfo.title;
  const artist = embedInfo.artist;
  if ($$props.embedInfo === void 0 && $$bindings.embedInfo && embedInfo !== void 0) $$bindings.embedInfo(embedInfo);
  return `${source == "bandcamp" ? `<iframe style="border: 0; width: 100%; height: 42px;" src="${"https://bandcamp.com/EmbeddedPlayer/" + escape(id, true) + "/size=small/bgcol=333333/linkcol=ffffff/transparent=true/"}" title="Bandcamp player" seamless><a${add_attribute("href", url, 0)}>${escape(title)} by ${escape(artist)}</a></iframe>` : `${source == "soundcloud" ? `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="${"https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/" + escape(id, true) + "&amp;color=%23ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;show_teaser=true"}" title="Soundcloud player"></iframe>` : `${source == "youtube" ? `<iframe width="560" height="315" src="${"https://www.youtube.com/embed/" + escape(id, true)}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>` : `${source == "mixcloud" ? `<iframe width="100%" height="120" src="${"https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&amp;feed=" + escape(id, true)}" frameborder="0" title="Mixcloud player"></iframe>` : ``}`}`}`}`;
});
const css = {
  code: ".box.svelte-oprcbh{border:var(--freq-border-panel)}.double-border.svelte-oprcbh{border-top:var(--freq-border-panel);border-bottom:var(--freq-border-panel);margin:var(--freq-spacing-2x-small) 0}",
  map: '{"version":3,"file":"NowPlayingPost.svelte","sources":["NowPlayingPost.svelte"],"sourcesContent":["<script lang=\\"ts\\">import \\"$lib/styles/posts.css\\";\\nimport PostMenuSessionUser from \\"src/lib/components/menus/PostMenuSessionUser.svelte\\";\\nimport UserActionsMenu from \\"$lib/components/menus/UserActionsMenu.svelte\\";\\nimport EditPostBody from \\"$lib/components/Posts/EditPostBody.svelte\\";\\nimport LikeReact from \\"$lib/components/Posts/LikeReact.svelte\\";\\nimport { displayDate } from \\"$lib/resources/parseData\\";\\nimport Reply from \\"lucide-svelte/icons/reply\\";\\nimport Link from \\"lucide-svelte/icons/link-2\\";\\nimport Music from \\"lucide-svelte/icons/music\\";\\nimport ListenEmbed from \\"./ListenEmbed.svelte\\";\\nexport let sessionUserId = null;\\nexport let post;\\nexport let formData = null;\\nexport let reactionActive = null;\\nexport let editState = null;\\nexport let mode = null;\\n$: editState;\\nconst permalink = `/posts/${post.username}/now-playing/${(post.created_at ?? post.feed_item_timestamp).toISOString()}`;\\nconst embedInfo = {\\n  \\"id\\": post?.embed_id,\\n  \\"source\\": post?.embed_source,\\n  \\"title\\": post?.release_group_name ?? post?.recording_name ?? post?.episode_title,\\n  \\"artist\\": post?.artist_name,\\n  \\"account\\": post?.embed_account\\n};\\nfunction toggleEditState() {\\n  editState = !editState;\\n}\\n<\/script>\\n\\n<div class=\\"box\\">\\n    <div class=\\"double-border\\">\\n        <div class=\\"post-row\\">\\n            <div class=\\"row-group-user-data\\">\\n                <img class=\\"avatar\\" src={post.avatar_url} alt={`${post.display_name}\'s avatar`}/>\\n                <div class=\\"row-group-column\\">\\n                    <a href=\\"/user/{post.username}\\">\\n                        <span class=\\"display-name\\">\\n                            {post.display_name}\\n                        </span>\\n                    </a>\\n                    <a href={permalink}>\\n                        <span class=\\"date\\" aria-label=\\"permalink\\">\\n                            {displayDate(post.created_at ?? post.feed_item_timestamp)}\\n                            <Link size=\\"15\\" color=var(--freq-color-text-muted)></Link>\\n                        </span>\\n                    </a>\\n                </div>\\n            </div>\\n            <div class=\\"row-group\\">\\n                {#if post.status === \\"edited\\"}\\n                    <span class=\\"status-badge\\">\\n                        edited\\n                    </span>\\n                {/if}\\n            </div>\\n        </div>\\n        <div class=\\"post-body\\">\\n            <span class=\\"now-playing-text\\">\\n                <Music size=\\"16\\" color=\\"var(--freq-color-text-medium-dark)\\"></Music>\\n                {post.artist_name} • {post.recording_name ?? post.release_group_name ?? post.episode_title}\\n                <Music size=\\"16\\" color=\\"var(--freq-color-text-medium-dark)\\"></Music>\\n            </span>\\n            {#if !editState}\\n                <p class=\\"post-text\\">\\n                    {post.text}\\n                </p>\\n            {:else}\\n                <EditPostBody\\n                    postData={post}\\n                    bind:editState={editState}\\n                ></EditPostBody>\\n            {/if}\\n            {#if formData == true }\\n                <p>edited!</p>\\n            {:else if formData == false}\\n                <p>edit failed</p>\\n            {/if}\\n            <ListenEmbed\\n                embedInfo={embedInfo}\\n            ></ListenEmbed>\\n        </div>\\n        <div class=\\"post-row\\">\\n            <div class=\\"row-group-icons\\">\\n                <LikeReact\\n                postId={post.id}\\n                reactionActive={reactionActive ?? false}\\n                ></LikeReact>\\n                {#if mode == \\"feed\\"}\\n                    <a href={permalink}>\\n                        \\n                            <Reply size=\\"16\\" color=\\"var(--freq-color-text-muted)\\"></Reply>\\n                            <span class=\\"descriptor\\">\\n                                reply\\n                            </span>\\n                    \\n                    </a>\\n                {/if}\\n            </div>\\n            <div class=\\"row-group-icon-description\\">\\n                {#if post.user_id == sessionUserId }\\n                    <UserActionsMenu\\n                        mode=\'sessionUserPostMenu\'\\n                        bind:editState={editState}\\n                    ></UserActionsMenu>\\n                {:else if sessionUserId}\\n                    <UserActionsMenu\\n                        mode=\'postMenu\'\\n                    ></UserActionsMenu>\\n                {/if}\\n            </div>\\n        </div>\\n    </div>\\n</div>\\n\\n\\n<style>\\n    .box {\\n        border: var(--freq-border-panel);\\n    }\\n    .double-border {\\n        border-top: var(--freq-border-panel);\\n        border-bottom: var(--freq-border-panel);\\n        margin:  var(--freq-spacing-2x-small) 0;\\n    }\\n    .edit-submit-options {\\n        display: flex;\\n        flex-direction: row;\\n        justify-content: space-between;\\n    }\\n</style>"],"names":[],"mappings":"AAqHI,kBAAK,CACD,MAAM,CAAE,IAAI,mBAAmB,CACnC,CACA,4BAAe,CACX,UAAU,CAAE,IAAI,mBAAmB,CAAC,CACpC,aAAa,CAAE,IAAI,mBAAmB,CAAC,CACvC,MAAM,CAAG,IAAI,uBAAuB,CAAC,CAAC,CAC1C"}'
};
const NowPlayingPost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { sessionUserId = null } = $$props;
  let { post } = $$props;
  let { formData = null } = $$props;
  let { reactionActive = null } = $$props;
  let { editState = null } = $$props;
  let { mode = null } = $$props;
  const permalink = `/posts/${post.username}/now-playing/${(post.created_at ?? post.feed_item_timestamp).toISOString()}`;
  const embedInfo = {
    "id": post?.embed_id,
    "source": post?.embed_source,
    "title": post?.release_group_name ?? post?.recording_name ?? post?.episode_title,
    "artist": post?.artist_name,
    "account": post?.embed_account
  };
  if ($$props.sessionUserId === void 0 && $$bindings.sessionUserId && sessionUserId !== void 0) $$bindings.sessionUserId(sessionUserId);
  if ($$props.post === void 0 && $$bindings.post && post !== void 0) $$bindings.post(post);
  if ($$props.formData === void 0 && $$bindings.formData && formData !== void 0) $$bindings.formData(formData);
  if ($$props.reactionActive === void 0 && $$bindings.reactionActive && reactionActive !== void 0) $$bindings.reactionActive(reactionActive);
  if ($$props.editState === void 0 && $$bindings.editState && editState !== void 0) $$bindings.editState(editState);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0) $$bindings.mode(mode);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="box svelte-oprcbh"><div class="double-border svelte-oprcbh"><div class="post-row"><div class="row-group-user-data"><img class="avatar"${add_attribute("src", post.avatar_url, 0)}${add_attribute("alt", `${post.display_name}'s avatar`, 0)}> <div class="row-group-column"><a href="${"/user/" + escape(post.username, true)}"><span class="display-name">${escape(post.display_name)}</span></a> <a${add_attribute("href", permalink, 0)}><span class="date" aria-label="permalink">${escape(displayDate(post.created_at ?? post.feed_item_timestamp))} ${validate_component(Link_2, "Link").$$render(
      $$result,
      {
        size: "15",
        color: "var(--freq-color-text-muted)"
      },
      {},
      {}
    )}</span></a></div></div> <div class="row-group">${post.status === "edited" ? `<span class="status-badge" data-svelte-h="svelte-8r9s0c">edited</span>` : ``}</div></div> <div class="post-body"><span class="now-playing-text">${validate_component(Music, "Music").$$render(
      $$result,
      {
        size: "16",
        color: "var(--freq-color-text-medium-dark)"
      },
      {},
      {}
    )} ${escape(post.artist_name)} • ${escape(post.recording_name ?? post.release_group_name ?? post.episode_title)} ${validate_component(Music, "Music").$$render(
      $$result,
      {
        size: "16",
        color: "var(--freq-color-text-medium-dark)"
      },
      {},
      {}
    )}</span> ${!editState ? `<p class="post-text">${escape(post.text)}</p>` : `${validate_component(EditPostBody, "EditPostBody").$$render(
      $$result,
      { postData: post, editState },
      {
        editState: ($$value) => {
          editState = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${formData == true ? `<p data-svelte-h="svelte-131au2c">edited!</p>` : `${formData == false ? `<p data-svelte-h="svelte-132trq5">edit failed</p>` : ``}`} ${validate_component(ListenEmbed, "ListenEmbed").$$render($$result, { embedInfo }, {}, {})}</div> <div class="post-row"><div class="row-group-icons">${validate_component(LikeReact, "LikeReact").$$render(
      $$result,
      {
        postId: post.id,
        reactionActive: reactionActive ?? false
      },
      {},
      {}
    )} ${mode == "feed" ? `<a${add_attribute("href", permalink, 0)}>${validate_component(Reply, "Reply").$$render(
      $$result,
      {
        size: "16",
        color: "var(--freq-color-text-muted)"
      },
      {},
      {}
    )} <span class="descriptor" data-svelte-h="svelte-icuw6m">reply</span></a>` : ``}</div> <div class="row-group-icon-description">${post.user_id == sessionUserId ? `${validate_component(UserActionsMenu, "UserActionsMenu").$$render(
      $$result,
      { mode: "sessionUserPostMenu", editState },
      {
        editState: ($$value) => {
          editState = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : `${sessionUserId ? `${validate_component(UserActionsMenu, "UserActionsMenu").$$render($$result, { mode: "postMenu" }, {}, {})}` : ``}`}</div></div></div> </div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  NowPlayingPost as N,
  UserActionsMenu as U,
  cubicOut as c
};

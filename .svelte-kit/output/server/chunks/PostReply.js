import { u as setContext, q as getContext, k as sanitize_props, r as rest_props, b as push, v as store_get, n as slot, l as spread_attributes, w as unsubscribe_stores, j as bind_props, p as pop, c as copy_payload, a as assign_payload, f as attr, e as escape_html, s as stringify } from "./index2.js";
import "clsx";
/* empty css                                                  */
import "dequal";
import { o as omit, m as makeElement, j as disabledAttr, d as createElHelpers, g as addMeltEventListener, c as styleToString } from "./create.js";
import { f as fallback } from "./utils.js";
import { d as derived, w as writable } from "./index3.js";
import { t as toWritableStores, o as overridable, c as createBitAttrs, e as removeUndefined, f as getOptionUpdater } from "./helpers.js";
import "./client.js";
import { L as Link_2, U as UserActionsMenu } from "./NowPlayingPost.js";
import { I as InlineMarkdownText } from "./InlineMarkdownText.js";
import { e as displayDate } from "./parseData.js";
const defaults = {
  defaultOpen: false,
  disabled: false,
  forceVisible: false
};
const { name } = createElHelpers("collapsible");
function createCollapsible(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "open", "defaultOpen", "onOpenChange"));
  const { disabled, forceVisible } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const root = makeElement(name(), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": disabledAttr($disabled)
    })
  });
  const trigger = makeElement(name("trigger"), {
    stores: [open, disabled],
    returned: ([$open, $disabled]) => ({
      "data-state": $open ? "open" : "closed",
      "data-disabled": disabledAttr($disabled),
      disabled: disabledAttr($disabled)
    }),
    action: (node) => {
      const unsub = addMeltEventListener(node, "click", () => {
        const disabled2 = node.dataset.disabled !== void 0;
        if (disabled2)
          return;
        open.update(($open) => !$open);
      });
      return {
        destroy: unsub
      };
    }
  });
  const isVisible = derived([open, forceVisible], ([$open, $forceVisible]) => $open || $forceVisible);
  const content = makeElement(name("content"), {
    stores: [isVisible, disabled],
    returned: ([$isVisible, $disabled]) => ({
      "data-state": $isVisible ? "open" : "closed",
      "data-disabled": disabledAttr($disabled),
      hidden: $isVisible ? void 0 : true,
      style: styleToString({
        display: $isVisible ? void 0 : "none"
      })
    })
  });
  return {
    elements: {
      root,
      trigger,
      content
    },
    states: {
      open
    },
    options
  };
}
function getCollapsibleData() {
  const NAME = "collapsible";
  const PARTS = ["root", "content", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getCollapsibleData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const collapsible = { ...createCollapsible(removeUndefined(props)), getAttrs };
  setContext(NAME, collapsible);
  return {
    ...collapsible,
    updateOption: getOptionUpdater(collapsible.options)
  };
}
function getCtx() {
  const { NAME } = getCollapsibleData();
  return getContext(NAME);
}
function Collapsible($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "disabled",
    "open",
    "onOpenChange",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let disabled = fallback($$props["disabled"], () => void 0, true);
  let open = fallback($$props["open"], () => void 0, true);
  let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { root },
    states: { open: localOpen },
    updateOption,
    getAttrs
  } = setCtx({
    disabled,
    forceVisible: true,
    defaultOpen: open,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    }
  });
  const attrs = getAttrs("root");
  open !== void 0 && localOpen.set(open);
  updateOption("disabled", disabled);
  builder = store_get($$store_subs ??= {}, "$root", root);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { disabled, open, onOpenChange, asChild, el });
  pop();
}
function Collapsible_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let transition = fallback($$props["transition"], () => void 0, true);
  let transitionConfig = fallback($$props["transitionConfig"], () => void 0, true);
  let inTransition = fallback($$props["inTransition"], () => void 0, true);
  let inTransitionConfig = fallback($$props["inTransitionConfig"], () => void 0, true);
  let outTransition = fallback($$props["outTransition"], () => void 0, true);
  let outTransitionConfig = fallback($$props["outTransitionConfig"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { content },
    states: { open },
    getAttrs
  } = getCtx();
  const attrs = getAttrs("content");
  builder = store_get($$store_subs ??= {}, "$content", content);
  Object.assign(builder, attrs);
  if (asChild && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else if (transition && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  } else if (inTransition && outTransition && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[2-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  } else if (inTransition && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[3-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  } else if (outTransition && store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[4-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  } else if (store_get($$store_subs ??= {}, "$open", open)) {
    $$payload.out += "<!--[5-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></div>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    transition,
    transitionConfig,
    inTransition,
    inTransitionConfig,
    outTransition,
    outTransitionConfig,
    asChild,
    el
  });
  pop();
}
function cubic_out(t) {
  const f = t - 1;
  return f * f * f + 1;
}
function slide(node, { delay = 0, duration = 400, easing = cubic_out, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => (
      /** @type {'Left' | 'Right' | 'Top' | 'Bottom'} */
      `${e[0].toUpperCase()}${e.slice(1)}`
    )
  );
  const padding_start_value = parseFloat(style[`padding${capitalized_secondary_properties[0]}`]);
  const padding_end_value = parseFloat(style[`padding${capitalized_secondary_properties[1]}`]);
  const margin_start_value = parseFloat(style[`margin${capitalized_secondary_properties[0]}`]);
  const margin_end_value = parseFloat(style[`margin${capitalized_secondary_properties[1]}`]);
  const border_width_start_value = parseFloat(
    style[`border${capitalized_secondary_properties[0]}Width`]
  );
  const border_width_end_value = parseFloat(
    style[`border${capitalized_secondary_properties[1]}Width`]
  );
  return {
    delay,
    duration,
    easing,
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;min-${primary_property}: 0`
  };
}
function PostReplyEditor($$payload) {
  $$payload.out += `<div class="reply-editor"><form name="submitReply" id="submitReply" class="reply" method="post" action="?/submitReply"><textarea rows="4" cols="1" id="reply-text" name="reply-text" spellcheck="true" placeholder="Reply..." required></textarea> <button class="standard svelte-zeyi1k" formaction="?/submitReply">submit</button></form></div>`;
}
function PostReply($$payload, $$props) {
  push();
  let {
    reply,
    sessionUserId,
    editState = false,
    userActionSuccess = null
  } = $$props;
  let openState = void 0;
  const originalPostTimestampString = reply?.original_post_date.toISOString();
  const originalPostTimestamp = Date.parse(originalPostTimestampString).toString();
  const permalinkTimestampString = reply?.created_at.toISOString();
  const permalinkTimestamp = Date.parse(permalinkTimestampString).toString();
  const permalink = `/posts/${reply.original_poster_username}/now-playing/${originalPostTimestamp}#${reply.username?.concat(permalinkTimestamp)}`;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<input type="hidden" name="post-reply-id" id="post-reply-id" form="delete"${attr("value", reply.id)}> <input type="hidden" name="post-reply-id" id="post-reply-id" form="flagPost"${attr("value", reply.id)}> <div class="comment-panel"><div class="comment"><div class="comment-metadata"><div class="row-group-user-data"><img class="comment-avatar"${attr("src", reply.avatar_url)}${attr("alt", `${reply.display_name}'s avatar`)}> <div class="row-group-column"><a${attr("href", `/user/${stringify(reply.username)}`)}><span class="comment-display-name">${escape_html(reply.display_name)}</span></a> <a${attr("href", permalink)}><span class="date" aria-label="permalink">${escape_html(displayDate(reply.created_at))} `;
    Link_2($$payload2, {
      size: "15",
      color: "var(--freq-color-text-muted)"
    });
    $$payload2.out += `<!----></span></a></div></div> <div class="row-group">`;
    if (reply.status === "edited") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<span class="status-badge">edited</span>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div></div> <div class="comment-text">`;
    InlineMarkdownText($$payload2, { text: reply.text });
    $$payload2.out += `<!----></div> <div class="comment-reaction-row"><div class="row-group"></div> <div class="row-group-icon-description">`;
    if (reply.user_id == sessionUserId) {
      $$payload2.out += "<!--[-->";
      UserActionsMenu($$payload2, {
        mode: "sessionUserPostMenu",
        postId: reply.id,
        success: userActionSuccess,
        get editState() {
          return editState;
        },
        set editState($$value) {
          editState = $$value;
          $$settled = false;
        }
      });
    } else if (reply.user_id != sessionUserId) {
      $$payload2.out += "<!--[1-->";
      UserActionsMenu($$payload2, { mode: "postMenu", success: userActionSuccess });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div></div></div> <!---->`;
    Collapsible($$payload2, {
      open: openState,
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Collapsible_content($$payload3, {
          transition: slide,
          children: ($$payload4) => {
            PostReplyEditor($$payload4);
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { editState, userActionSuccess });
  pop();
}
export {
  PostReplyEditor as P,
  PostReply as a
};

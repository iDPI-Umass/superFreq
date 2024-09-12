import { s as setContext, g as getContext, c as create_ssr_component, a as spread, b as escape_object, d as add_attribute, f as escape, v as validate_component, h as each } from "../../../../../../chunks/ssr.js";
import "../../../../../../chunks/client.js";
import { c as cubicOut, U as UserActionsMenu, N as NowPlayingPost } from "../../../../../../chunks/NowPlayingPost.js";
/* empty css                             */
import "dequal";
import { t as toWritableStores, q as omit, o as overridable, m as makeElement, l as disabledAttr, b as addMeltEventListener, s as styleToString, j as createElHelpers, r as createBitAttrs, v as removeUndefined, x as getOptionUpdater } from "../../../../../../chunks/updater.js";
import { c as compute_rest_props, s as subscribe } from "../../../../../../chunks/utils.js";
import { d as derived, w as writable } from "../../../../../../chunks/index2.js";
import { d as displayDate } from "../../../../../../chunks/parseData.js";
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
const Collapsible = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["disabled", "open", "onOpenChange", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { disabled = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { open: localOpen }, updateOption, getAttrs } = setCtx({
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
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  const attrs = getAttrs("root");
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("disabled", disabled);
  }
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Collapsible_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "el"
  ]);
  let $content, $$unsubscribe_content;
  let $open, $$unsubscribe_open;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, getAttrs } = getCtx();
  $$unsubscribe_content = subscribe(content, (value) => $content = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  const attrs = getAttrs("content");
  if ($$props.transition === void 0 && $$bindings.transition && transition !== void 0) $$bindings.transition(transition);
  if ($$props.transitionConfig === void 0 && $$bindings.transitionConfig && transitionConfig !== void 0) $$bindings.transitionConfig(transitionConfig);
  if ($$props.inTransition === void 0 && $$bindings.inTransition && inTransition !== void 0) $$bindings.inTransition(inTransition);
  if ($$props.inTransitionConfig === void 0 && $$bindings.inTransitionConfig && inTransitionConfig !== void 0) $$bindings.inTransitionConfig(inTransitionConfig);
  if ($$props.outTransition === void 0 && $$bindings.outTransition && outTransition !== void 0) $$bindings.outTransition(outTransition);
  if ($$props.outTransitionConfig === void 0 && $$bindings.outTransitionConfig && outTransitionConfig !== void 0) $$bindings.outTransitionConfig(outTransitionConfig);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_content();
  $$unsubscribe_open();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
function slide(node, { delay = 0, duration = 400, easing = cubicOut, axis = "y" } = {}) {
  const style = getComputedStyle(node);
  const opacity = +style.opacity;
  const primary_property = axis === "y" ? "height" : "width";
  const primary_property_value = parseFloat(style[primary_property]);
  const secondary_properties = axis === "y" ? ["top", "bottom"] : ["left", "right"];
  const capitalized_secondary_properties = secondary_properties.map(
    (e) => `${e[0].toUpperCase()}${e.slice(1)}`
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
    css: (t) => `overflow: hidden;opacity: ${Math.min(t * 20, 1) * opacity};${primary_property}: ${t * primary_property_value}px;padding-${secondary_properties[0]}: ${t * padding_start_value}px;padding-${secondary_properties[1]}: ${t * padding_end_value}px;margin-${secondary_properties[0]}: ${t * margin_start_value}px;margin-${secondary_properties[1]}: ${t * margin_end_value}px;border-${secondary_properties[0]}-width: ${t * border_width_start_value}px;border-${secondary_properties[1]}-width: ${t * border_width_end_value}px;`
  };
}
const css = {
  code: ".standard.svelte-zeyi1k{margin-left:auto;margin-right:0}",
  map: '{"version":3,"file":"PostReplyEditor.svelte","sources":["PostReplyEditor.svelte"],"sourcesContent":["<div class=\\"reply-editor\\">\\n    <form class=\\"reply\\" method=\\"post\\" action=\\"?/submitReply\\">\\n        <textarea\\n            rows=\\"4\\"\\n            cols=\\"1\\"\\n            id=\\"reply-text\\"\\n            name=\\"reply-text\\"\\n            spellcheck=true \\n            placeholder=\\"Reply...\\"\\n            required\\n        ></textarea>\\n        <button class=\\"standard\\" formaction=\\"?/submitReply\\">\\n            submit\\n        </button>\\n    </form>\\n</div>\\n\\n<style>\\n    .standard {\\n        margin-left: auto;\\n        margin-right: 0;\\n    }\\n</style>"],"names":[],"mappings":"AAkBI,uBAAU,CACN,WAAW,CAAE,IAAI,CACjB,YAAY,CAAE,CAClB"}'
};
const PostReplyEditor = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="reply-editor" data-svelte-h="svelte-pitdg8"><form class="reply" method="post" action="?/submitReply"><textarea rows="4" cols="1" id="reply-text" name="reply-text" spellcheck="true" placeholder="Reply..." required></textarea> <button class="standard svelte-zeyi1k" formaction="?/submitReply">submit</button></form> </div>`;
});
const PostReply = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { reply } = $$props;
  let { sessionUserId } = $$props;
  let { editState = false } = $$props;
  let openState;
  if ($$props.reply === void 0 && $$bindings.reply && reply !== void 0) $$bindings.reply(reply);
  if ($$props.sessionUserId === void 0 && $$bindings.sessionUserId && sessionUserId !== void 0) $$bindings.sessionUserId(sessionUserId);
  if ($$props.editState === void 0 && $$bindings.editState && editState !== void 0) $$bindings.editState(editState);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="comment-panel"><div class="comment"><div class="comment-metadata"><div class="row-group-user-data"><img class="comment-avatar"${add_attribute("src", reply.avatar_url, 0)}${add_attribute("alt", `${reply.display_name}'s avatar`, 0)}> <div class="row-group-column"><span class="comment-display-name">${escape(reply.display_name)}</span> <span class="comment-date"><a${add_attribute("href", `/${reply.original_poster_username}/now-playing/${reply.original_post_date}#${reply.username?.concat(reply.created_at.valueOf().toString())}`, 0)}>${escape(displayDate(reply.created_at))}</a></span></div></div> <div class="row-group">${reply.status === "edited" ? `<span class="status-badge" data-svelte-h="svelte-1f8ii9m">edited</span>` : ``}</div></div> <p class="comment-text">${escape(reply.text)}</p> <div class="comment-reaction-row"><div class="row-group" data-svelte-h="svelte-asnvvb"> </div> <div class="row-group-icon-description">${reply.userId == sessionUserId ? `${validate_component(UserActionsMenu, "UserActionsMenu").$$render(
      $$result,
      { mode: "sessionUserPostMenu", editState },
      {
        editState: ($$value) => {
          editState = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : `${validate_component(UserActionsMenu, "UserActionsMenu").$$render($$result, { mode: "postMenu" }, {}, {})}`}</div></div></div> ${validate_component(Collapsible, "Collapsible.Root").$$render($$result, { open: openState }, {}, {
      default: () => {
        return `${validate_component(Collapsible_content, "Collapsible.Content").$$render($$result, { transition: slide }, {}, {
          default: () => {
            return `${validate_component(PostReplyEditor, "PostReplyEditor").$$render($$result, {}, {}, {})}`;
          }
        })}`;
      }
    })}</div>`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let { sessionUserId, post, postReactionActive } = data;
  let replies = data?.replies;
  const postId = post?.id;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  ({ sessionUserId, post, postReactionActive } = data);
  return `${$$result.head += `<!-- HEAD_svelte-1trb7xo_START -->${$$result.title = `<title> ${escape(post?.display_name)}&#39;s Now Playing Post
	</title>`, ""}<!-- HEAD_svelte-1trb7xo_END -->`, ""} <div class="post-panel">${sessionUserId ? `<input type="hidden" name="post-id" id="post-id" form="submitReply"${add_attribute("value", postId, 0)}> <input type="hidden" name="post-id" id="post-id" form="deletePost"${add_attribute("value", postId, 0)}> <input type="hidden" name="post-id" id="post-id" form="flagPost"${add_attribute("value", postId, 0)}> ${validate_component(NowPlayingPost, "NowPlayingPost").$$render(
    $$result,
    {
      sessionUserId,
      post,
      formData: form?.success ?? null,
      editState: form?.editState ?? false,
      reactionActive: postReactionActive ?? false
    },
    {},
    {}
  )} ${validate_component(PostReplyEditor, "PostReplyEditor").$$render($$result, {}, {}, {})} ${each(replies, (reply) => {
    return `<input type="hidden" name="post-id" id="post-id" form="deletePost"${add_attribute("value", reply.id, 0)}> <input type="hidden" name="post-id" id="post-id" form="flagPost"${add_attribute("value", reply.id, 0)}> <div${add_attribute("id", reply.username?.concat(reply.created_at.valueOf().toString()), 0)}>${validate_component(PostReply, "PostReply").$$render($$result, { reply, sessionUserId }, {}, {})} </div>`;
  })}` : ``}</div>`;
});
export {
  Page as default
};

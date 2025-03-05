import { o as once, b as push, k as spread_attributes, j as bind_props, p as pop, c as copy_payload, a as assign_payload, f as attr, e as escape_html, s as stringify } from "./index2.js";
import "clsx";
/* empty css                                                  */
import "./client.js";
import { L as Link_2, U as UserActionsMenu } from "./NowPlayingPost.js";
import { I as InlineMarkdownText } from "./InlineMarkdownText.js";
import { e as displayDate } from "./parseData.js";
import { C as Context, u as useRefById, w as watch, p as getDataDisabled, g as getDataOpenClosed, q as afterTick, j as useId, d as box, n as noop, m as mergeProps, r as Presence_layer } from "./popper-layer-force-mount.js";
import "style-to-object";
const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
class CollapsibleRootState {
  opts;
  contentNode = null;
  constructor(opts) {
    this.opts = opts;
    this.toggleOpen = this.toggleOpen.bind(this);
    useRefById(opts);
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "data-state": getDataOpenClosed(this.opts.open.current),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    [COLLAPSIBLE_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class CollapsibleContentState {
  opts;
  root;
  #originalStyles;
  #isMountAnimationPrevented = false;
  #width = 0;
  #height = 0;
  #present = once(() => this.opts.forceMount.current || this.root.opts.open.current);
  get present() {
    return this.#present();
  }
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    this.#isMountAnimationPrevented = root.opts.open.current;
    useRefById({
      ...opts,
      deps: () => this.present,
      onRefChange: (node) => {
        this.root.contentNode = node;
      }
    });
    watch(
      [
        () => this.opts.ref.current,
        () => this.present
      ],
      ([node]) => {
        if (!node) return;
        afterTick(() => {
          if (!this.opts.ref.current) return;
          this.#originalStyles = this.#originalStyles || {
            transitionDuration: node.style.transitionDuration,
            animationName: node.style.animationName
          };
          node.style.transitionDuration = "0s";
          node.style.animationName = "none";
          const rect = node.getBoundingClientRect();
          this.#height = rect.height;
          this.#width = rect.width;
          if (!this.#isMountAnimationPrevented) {
            const { animationName, transitionDuration } = this.#originalStyles;
            node.style.transitionDuration = transitionDuration;
            node.style.animationName = animationName;
          }
        });
      }
    );
  }
  #snippetProps = once(() => ({ open: this.root.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    id: this.opts.id.current,
    style: {
      "--bits-collapsible-content-height": this.#height ? `${this.#height}px` : void 0,
      "--bits-collapsible-content-width": this.#width ? `${this.#width}px` : void 0
    },
    "data-state": getDataOpenClosed(this.root.opts.open.current),
    "data-disabled": getDataDisabled(this.root.opts.disabled.current),
    [COLLAPSIBLE_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
const CollapsibleRootContext = new Context("Collapsible.Root");
function useCollapsibleRoot(props) {
  return CollapsibleRootContext.set(new CollapsibleRootState(props));
}
function useCollapsibleContent(props) {
  return new CollapsibleContentState(props, CollapsibleRootContext.get());
}
function Collapsible($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    open = false,
    disabled = false,
    onOpenChange = noop,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useCollapsibleRoot({
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    }),
    disabled: box.with(() => disabled),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, rootState.props);
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref, open });
  pop();
}
function Collapsible_content($$payload, $$props) {
  push();
  let {
    child,
    ref = null,
    forceMount = false,
    children,
    id = useId(),
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useCollapsibleContent({
    id: box.with(() => id),
    forceMount: box.with(() => forceMount),
    ref: box.with(() => ref, (v) => ref = v)
  });
  {
    let presence = function($$payload2, { present }) {
      const mergedProps = mergeProps(restProps, contentState.props, {
        hidden: forceMount ? void 0 : !present.current
      });
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, {
          ...contentState.snippetProps,
          props: mergedProps
        });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<div${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></div>`;
      }
      $$payload2.out += `<!--]-->`;
    };
    Presence_layer($$payload, {
      forceMount: true,
      present: contentState.present,
      id,
      presence
    });
  }
  bind_props($$props, { ref });
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

import { u as setContext, q as getContext, k as sanitize_props, r as rest_props, b as push, v as store_get, n as slot, l as spread_attributes, w as unsubscribe_stores, j as bind_props, p as pop, c as copy_payload, a as assign_payload, f as attr, e as escape_html } from "./index2.js";
import "./client.js";
import { P as PanelHeader } from "./PanelHeader.js";
import { M as MusicBrainzSearch } from "./MusicBrainzSearch.js";
import { T as Tooltip } from "./Tooltip.js";
import "dequal";
import { o as omit, m as makeElement, d as createElHelpers, f as executeCallbacks, g as addMeltEventListener, j as disabledAttr, b as isBrowser, a as isHTMLElement, l as getDirectionalKeys, k as kbd } from "./create.js";
import { f as fallback } from "./utils.js";
import "clsx";
import { t as toWritableStores, o as overridable, n as next, p as prev, l as last, c as createBitAttrs, e as removeUndefined, f as getOptionUpdater } from "./helpers.js";
import { w as writable } from "./index3.js";
function getElemDirection(elem) {
  const style = window.getComputedStyle(elem);
  const direction = style.getPropertyValue("direction");
  return direction;
}
const defaults = {
  orientation: "horizontal",
  activateOnFocus: true,
  loop: true,
  autoSet: true
};
const { name, selector } = createElHelpers("tabs");
function createTabs(props) {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(omit(withDefaults, "defaultValue", "value", "onValueChange", "autoSet"));
  const { orientation, activateOnFocus, loop } = options;
  const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
  const value = overridable(valueWritable, withDefaults?.onValueChange);
  let ssrValue = withDefaults.defaultValue ?? value.get();
  const root = makeElement(name(), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        "data-orientation": $orientation
      };
    }
  });
  const list = makeElement(name("list"), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "tablist",
        "aria-orientation": $orientation,
        "data-orientation": $orientation
      };
    }
  });
  const parseTriggerProps = (props2) => {
    if (typeof props2 === "string") {
      return { value: props2 };
    } else {
      return props2;
    }
  };
  const trigger = makeElement(name("trigger"), {
    stores: [value, orientation],
    returned: ([$value, $orientation]) => {
      return (props2) => {
        const { value: tabValue, disabled } = parseTriggerProps(props2);
        if (!$value && !ssrValue && withDefaults.autoSet) {
          ssrValue = tabValue;
          $value = tabValue;
          value.set(tabValue);
        }
        const sourceOfTruth = isBrowser ? $value : ssrValue;
        const isActive = sourceOfTruth === tabValue;
        return {
          type: "button",
          role: "tab",
          "data-state": isActive ? "active" : "inactive",
          tabindex: isActive ? 0 : -1,
          "data-value": tabValue,
          "data-orientation": $orientation,
          "data-disabled": disabledAttr(disabled),
          disabled: disabledAttr(disabled)
        };
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "focus", () => {
        const disabled = node.dataset.disabled === "true";
        const tabValue = node.dataset.value;
        if (activateOnFocus.get() && !disabled && tabValue !== void 0) {
          value.set(tabValue);
        }
      }), addMeltEventListener(node, "click", (e) => {
        node.focus();
        e.preventDefault();
        const disabled = node.dataset.disabled === "true";
        if (disabled)
          return;
        const tabValue = node.dataset.value;
        node.focus();
        if (tabValue !== void 0) {
          value.set(tabValue);
        }
      }), addMeltEventListener(node, "keydown", (e) => {
        const tabValue = node.dataset.value;
        if (!tabValue)
          return;
        const el = e.currentTarget;
        if (!isHTMLElement(el))
          return;
        const rootEl = el.closest(selector());
        if (!isHTMLElement(rootEl))
          return;
        const $loop = loop.get();
        const triggers = Array.from(rootEl.querySelectorAll('[role="tab"]')).filter((trigger2) => isHTMLElement(trigger2));
        const enabledTriggers = triggers.filter((el2) => !el2.hasAttribute("data-disabled"));
        const triggerIdx = enabledTriggers.findIndex((el2) => el2 === e.target);
        const dir = getElemDirection(rootEl);
        const { nextKey, prevKey } = getDirectionalKeys(dir, orientation.get());
        if (e.key === nextKey) {
          e.preventDefault();
          const nextEl = next(enabledTriggers, triggerIdx, $loop);
          nextEl.focus();
        } else if (e.key === prevKey) {
          e.preventDefault();
          const prevEl = prev(enabledTriggers, triggerIdx, $loop);
          prevEl.focus();
        } else if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
          e.preventDefault();
          value.set(tabValue);
        } else if (e.key === kbd.HOME) {
          e.preventDefault();
          const firstTrigger = enabledTriggers[0];
          firstTrigger.focus();
        } else if (e.key === kbd.END) {
          e.preventDefault();
          const lastTrigger = last(enabledTriggers);
          lastTrigger.focus();
        }
      }));
      return {
        destroy: unsub
      };
    }
  });
  const content = makeElement(name("content"), {
    stores: value,
    returned: ($value) => {
      return (tabValue) => {
        return {
          role: "tabpanel",
          // TODO: improve
          "aria-labelledby": tabValue,
          hidden: isBrowser ? $value === tabValue ? void 0 : true : ssrValue === tabValue ? void 0 : true,
          tabindex: 0
        };
      };
    }
  });
  return {
    elements: {
      root,
      list,
      trigger,
      content
    },
    states: {
      value
    },
    options
  };
}
function getTabsData() {
  const NAME = "tabs";
  const PARTS = ["root", "content", "list", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getTabsData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const tabs = { ...createTabs(removeUndefined(props)), getAttrs };
  setContext(NAME, tabs);
  return {
    ...tabs,
    updateOption: getOptionUpdater(tabs.options)
  };
}
function getCtx() {
  const { NAME } = getTabsData();
  return getContext(NAME);
}
function Tabs($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "orientation",
    "activateOnFocus",
    "loop",
    "autoSet",
    "value",
    "onValueChange",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let orientation = fallback($$props["orientation"], () => void 0, true);
  let activateOnFocus = fallback($$props["activateOnFocus"], () => void 0, true);
  let loop = fallback($$props["loop"], () => void 0, true);
  let autoSet = fallback($$props["autoSet"], () => void 0, true);
  let value = fallback($$props["value"], () => void 0, true);
  let onValueChange = fallback($$props["onValueChange"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { root },
    states: { value: localValue },
    updateOption,
    getAttrs
  } = setCtx({
    orientation,
    activateOnFocus,
    loop,
    autoSet,
    defaultValue: value,
    onValueChange: ({ next: next2 }) => {
      if (value !== next2) {
        onValueChange?.(next2);
        value = next2;
      }
      return next2;
    }
  });
  const attrs = getAttrs("root");
  value !== void 0 && localValue.set(value);
  updateOption("orientation", orientation);
  updateOption("activateOnFocus", activateOnFocus);
  updateOption("loop", loop);
  updateOption("autoSet", autoSet);
  builder = store_get($$store_subs ??= {}, "$root", root);
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot(
      $$payload,
      $$props,
      "default",
      {
        builder,
        value: store_get($$store_subs ??= {}, "$localValue", localValue)
      },
      null
    );
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot(
      $$payload,
      $$props,
      "default",
      {
        builder,
        value: store_get($$store_subs ??= {}, "$localValue", localValue)
      },
      null
    );
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    orientation,
    activateOnFocus,
    loop,
    autoSet,
    value,
    onValueChange,
    asChild,
    el
  });
  pop();
}
function Tabs_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { content }, getAttrs } = getCtx();
  const attrs = getAttrs("content");
  builder = store_get($$store_subs ??= {}, "$content", content)(value);
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
  bind_props($$props, { value, asChild, el });
  pop();
}
function Tabs_list($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { list }, getAttrs } = getCtx();
  const attrs = getAttrs("list");
  builder = store_get($$store_subs ??= {}, "$list", list);
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
  bind_props($$props, { asChild, el });
  pop();
}
function Tabs_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "disabled", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let value = $$props["value"];
  let disabled = fallback($$props["disabled"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { trigger }, getAttrs } = getCtx();
  const attrs = getAttrs("trigger");
  builder = store_get($$store_subs ??= {}, "$trigger", trigger)({ value, disabled });
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, type: "button", ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { value, disabled, asChild, el });
  pop();
}
function NewNowPlayingPost($$payload, $$props) {
  push();
  let {
    addedItem = {},
    newItemAdded = false,
    imgPromise = null
  } = $$props;
  let imgUrl = addedItem["img_url"];
  let lastFmImgUrl = addedItem["last_fm_img_url"];
  function postForm($$payload2, itemType, addedItem2) {
    $$payload2.out += `<form method="POST" action="?/post" class="vertical"><input id="item-type" name="item-type" type="hidden"${attr("value", itemType)}> <input id="artist-mbid" name="artist-mbid" type="hidden"${attr("value", addedItem2?.artist_mbid ?? null)}> <input id="release-group-mbid" name="release-group-mbid" type="hidden"${attr("value", addedItem2?.release_group_mbid ?? null)}> <input id="recording-mbid" name="recording-mbid" type="hidden"${attr("value", addedItem2?.recording_mbid ?? null)}> <input id="remixer-artist-mbid" name="remixer-artist-mbid" type="hidden"${attr("value", addedItem2?.remixer_artist_mbid ?? null)}> <input id="release-date" name="release-date" type="hidden"${attr("value", addedItem2?.release_date ?? null)}> <input id="label" name="label" type="hidden"${attr("value", addedItem2?.label ?? null)}> <input id="img-url" name="img-url" type="hidden"${attr("value", imgUrl)}> <input id="last-fm-img-url" name="last-fm-img-url" type="hidden"${attr("value", lastFmImgUrl)}> <div class="tooltip-group"><label class="text-label" for="listen-url">listen link</label> `;
    Tooltip($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->A link from Bandcamp, Soundcloud, or YouTube can be embedded in your post.`;
      }
    });
    $$payload2.out += `<!----></div> <input class="text" id="listen-url" name="listen-url" type="url" placeholder="paste link"> <div class="label-group"><label class="text-label" for="artist-name">${escape_html(itemType == "episode" ? "host / dj" : "artist name")}</label> <span class="label-explainer">* required</span></div> <input class="text" id="artist-name" name="artist-name" type="text" placeholder="artist name"${attr("value", addedItem2?.artist_name ?? null)} required> `;
    if (itemType == "release_group") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="label-group"><label class="text-label" for="release-group-name">album name</label> <span class="label-explainer">* required</span></div> <input class="text" id="release-group-name" name="release-group-name" type="text" placeholder="album name"${attr("value", addedItem2?.release_group_name ?? null)} required>`;
    } else if (itemType == "recording") {
      $$payload2.out += "<!--[1-->";
      $$payload2.out += `<div class="label-group"><label class="text-label" for="release-group-name">album name</label></div> <input class="text" id="release-group-name" name="release-group-name" type="text" placeholder="album name"${attr("value", addedItem2?.release_group_name ?? null)}>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (itemType == "recording") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="label-group"><label class="text-label" for="recording-name">track name</label> <span class="label-explainer">* required</span></div> <input class="text" id="recording-name" name="recording-name" type="text" placeholder="track title"${attr("value", addedItem2?.recording_name ?? null)} required>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (itemType == "episode") {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<div class="label-group"><label class="text-label" for="episode">episode / mix title</label> <span class="label-explainer">* required</span></div> <input class="text" id="episode" name="episode" type="text" placeholder="episode"${attr("value", addedItem2?.episode_name ?? null)} required> <label class="text-label" for="show">show name / mix series</label> <input class="text" id="show" name="show" type="text" placeholder="show"${attr("value", addedItem2?.show_title ?? null)}>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> <label class="text-label" for="post-text">thoughts</label> <textarea cols="1" rows="5" id="post-text" name="post-text" spellcheck="true" placeholder="Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?"></textarea> <button class="standard" formaction="?/post" type="submit">submit</button></form>`;
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="border svelte-15h1nys">`;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<span>what are you listening to?</span>`;
      };
      PanelHeader($$payload2, { headerText });
    }
    $$payload2.out += `<!----> <!---->`;
    Tabs($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Tabs_list($$payload3, {
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Tabs_trigger($$payload4, {
              value: "album",
              children: ($$payload5) => {
                $$payload5.out += `<!---->album`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Tabs_trigger($$payload4, {
              value: "track",
              children: ($$payload5) => {
                $$payload5.out += `<!---->track`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Tabs_trigger($$payload4, {
              value: "mix",
              children: ($$payload5) => {
                $$payload5.out += `<!---->episode / mix`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Tabs_content($$payload3, {
          value: "album",
          children: ($$payload4) => {
            $$payload4.out += `<div class="search svelte-15h1nys">`;
            MusicBrainzSearch($$payload4, {
              searchCategory: "release_groups",
              searchButtonText: "search",
              searchPlaceholder: "look up an album",
              mode: "single",
              limit: "10",
              get addedItems() {
                return addedItem;
              },
              set addedItems($$value) {
                addedItem = $$value;
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
            $$payload4.out += `<!----> `;
            Tooltip($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->Search for an album to autofill this form. If it's not coming up search: "album name" artist (using the quotation marks).`;
              }
            });
            $$payload4.out += `<!----></div> `;
            postForm($$payload4, "release_group", addedItem);
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Tabs_content($$payload3, {
          value: "track",
          children: ($$payload4) => {
            $$payload4.out += `<div class="search svelte-15h1nys">`;
            MusicBrainzSearch($$payload4, {
              searchCategory: "recordings",
              searchButtonText: "search",
              searchPlaceholder: "look up a track",
              mode: "single",
              get addedItems() {
                return addedItem;
              },
              set addedItems($$value) {
                addedItem = $$value;
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
            $$payload4.out += `<!----> `;
            Tooltip($$payload4, {
              children: ($$payload5) => {
                $$payload5.out += `<!---->Search for a track to autofill this form. If it's not coming up search: "track name" artist (using the quotation marks).`;
              }
            });
            $$payload4.out += `<!----></div> `;
            postForm($$payload4, "recording", addedItem);
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Tabs_content($$payload3, {
          value: "mix",
          children: ($$payload4) => {
            postForm($$payload4, "episode", addedItem);
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
  bind_props($$props, { addedItem, newItemAdded, imgPromise });
  pop();
}
export {
  NewNowPlayingPost as N
};

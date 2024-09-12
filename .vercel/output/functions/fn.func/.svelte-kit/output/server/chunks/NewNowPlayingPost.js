import { s as setContext, g as getContext, c as create_ssr_component, a as spread, b as escape_object, d as add_attribute, v as validate_component } from "./ssr.js";
import "devalue";
import "./client.js";
import { P as PanelHeader } from "./PanelHeader.js";
import { M as MusicBrainzSearch } from "./MusicBrainzSearch.js";
import { T as Tooltip } from "./Tooltip.js";
import { u as username } from "./localStorage.js";
import "dequal";
import { t as toWritableStores, q as omit, o as overridable, m as makeElement, l as disabledAttr, a as executeCallbacks, b as addMeltEventListener, h as isBrowser, j as createElHelpers, i as isHTMLElement, C as getDirectionalKeys, k as kbd, r as createBitAttrs, v as removeUndefined, x as getOptionUpdater, y as createDispatcher } from "./updater.js";
import { c as compute_rest_props, s as subscribe } from "./utils.js";
import { n as next, p as prev, l as last } from "./helpers.js";
import { w as writable } from "./index2.js";
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
const Tabs = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
    "orientation",
    "activateOnFocus",
    "loop",
    "autoSet",
    "value",
    "onValueChange",
    "asChild",
    "el"
  ]);
  let $root, $$unsubscribe_root;
  let $localValue, $$unsubscribe_localValue;
  let { orientation = void 0 } = $$props;
  let { activateOnFocus = void 0 } = $$props;
  let { loop = void 0 } = $$props;
  let { autoSet = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, states: { value: localValue }, updateOption, getAttrs } = setCtx({
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
  $$unsubscribe_root = subscribe(root, (value2) => $root = value2);
  $$unsubscribe_localValue = subscribe(localValue, (value2) => $localValue = value2);
  const attrs = getAttrs("root");
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  if ($$props.activateOnFocus === void 0 && $$bindings.activateOnFocus && activateOnFocus !== void 0) $$bindings.activateOnFocus(activateOnFocus);
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.autoSet === void 0 && $$bindings.autoSet && autoSet !== void 0) $$bindings.autoSet(autoSet);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  value !== void 0 && localValue.set(value);
  {
    updateOption("orientation", orientation);
  }
  {
    updateOption("activateOnFocus", activateOnFocus);
  }
  {
    updateOption("loop", loop);
  }
  {
    updateOption("autoSet", autoSet);
  }
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  $$unsubscribe_localValue();
  return `${asChild ? `${slots.default ? slots.default({ builder, value: $localValue }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder, value: $localValue }) : ``}</div>`}`;
});
const Tabs_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["value", "asChild", "el"]);
  let $content, $$unsubscribe_content;
  let { value } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, getAttrs } = getCtx();
  $$unsubscribe_content = subscribe(content, (value2) => $content = value2);
  const attrs = getAttrs("content");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $content(value);
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_content();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Tabs_list = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "el"]);
  let $list, $$unsubscribe_list;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { list }, getAttrs } = getCtx();
  $$unsubscribe_list = subscribe(list, (value) => $list = value);
  const attrs = getAttrs("list");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $list;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_list();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Tabs_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "asChild", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let { value } = $$props;
  let { disabled = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, getAttrs } = getCtx();
  $$unsubscribe_trigger = subscribe(trigger, (value2) => $trigger = value2);
  createDispatcher();
  const attrs = getAttrs("trigger");
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  builder = $trigger({ value, disabled });
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const css = {
  code: ".border.svelte-15h1nys{display:flex;flex-direction:column;width:calc( 0.75 * var(--freq-max-width-primary));margin:var(--freq-spacing-large) auto;border:var(--freq-border-panel)}.search.svelte-15h1nys{display:flex;flex-direction:row;margin:var(--freq-height-spacer) var(--freq-width-spacer);align-items:center;gap:var(--freq-height-spacer-gap-quarter)}",
  map: '{"version":3,"file":"NewNowPlayingPost.svelte","sources":["NewNowPlayingPost.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { enhance } from \\"$app/forms\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport MusicBrainzSearch from \\"$lib/components/MusicBrainzSearch.svelte\\";\\nimport Tooltip from \\"$lib/components/Tooltip.svelte\\";\\nimport { username } from \\"$lib/resources/localStorage.ts\\";\\nimport { Tabs } from \\"bits-ui\\";\\nexport let form = null;\\nlet addedItem;\\nlet newItemAdded;\\nlet type;\\nlet listenUrl;\\n$: listenUrl;\\n<\/script>\\n\\n\\n<div class=\\"border\\">\\n    <PanelHeader>\\n        what are you listening to?\\n    </PanelHeader>\\n    <Tabs.Root>\\n        <Tabs.List>\\n            <Tabs.Trigger value=\\"album\\">\\n                album\\n            </Tabs.Trigger>\\n            <Tabs.Trigger value=\\"track\\">\\n                track\\n            </Tabs.Trigger>\\n            <Tabs.Trigger value=\\"mix\\">\\n                show episode / dj mix\\n            </Tabs.Trigger>\\n        </Tabs.List>\\n        <Tabs.Content value=\\"album\\">\\n            <div class=\\"search\\">\\n                <MusicBrainzSearch\\n                    searchCategory=\\"release_groups\\"\\n                    searchButtonText=\\"search\\"\\n                    searchPlaceholder=\\"look up an album\\"\\n                    bind:addedItems={addedItem}\\n                    bind:newItemAdded={newItemAdded}\\n                    mode=\\"single\\"\\n                    limit=\\"10\\"\\n                ></MusicBrainzSearch>\\n                <Tooltip>\\n                    Search for an album to autofill this form.\\n                </Tooltip>\\n            </div>\\n            <form method=\\"POST\\" action=\\"?/postAlbum\\" name=\\"album\\" class=\\"vertical\\" use:enhance>\\n                <input\\n                    id=\\"username\\"\\n                    name=\\"username\\"\\n                    type=\\"hidden\\"\\n                    value={username}\\n                />\\n                <input\\n                    id=\\"item-type\\" \\n                    name=\\"item-type\\" \\n                    type=\\"hidden\\" \\n                    value=\\"release_group\\"\\n                />\\n                <input\\n                    id=\\"mbid\\" \\n                    name=\\"mbid\\" \\n                    type=\\"hidden\\" \\n                    value={addedItem?.releaseGroupMbid ?? null} \\n                />\\n                <!-- <input\\n                    id=\\"listen-url\\" \\n                    name=\\"listen-url\\" \\n                    type=\\"hidden\\" \\n                    value={form?.embedInfo.url ?? null}\\n                /> -->\\n                <div class=\\"tooltip-group\\">\\n                    <label \\n                        class=\\"text-label\\" \\n                        for=\\"listen-url\\"\\n                    >\\n                        listen link\\n                    </label>\\n                    <Tooltip>\\n                        A link from Bandcamp, Soundcloud, or YouTube can be embedded in your post. \\n                    </Tooltip>\\n                </div>\\n                <!-- <form method=\\"POST\\" action=\\"?/parseListenUrl\\"> -->\\n                    <input \\n                        class=\\"text\\" \\n                        id=\\"listen-url\\" \\n                        name=\\"listen-url\\" \\n                        type=\\"text\\"\\n                        placeholder=\\"paste link\\" \\n                    />\\n<!-- \\n                    <button formaction=\\"?/parseListenUrl\\">\\n                        get data\\n                    </button>\\n                </form> -->\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"artist-name\\"\\n                >\\n                    artist name\\n                </label>\\n                <input  \\n                    id=\\"artist-mbid\\" \\n                    name=\\"artist-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.artistMbid ?? null}\\n                />\\n                <input\\n                    class=\\"text\\"  \\n                    id=\\"artist-name\\" \\n                    name=\\"artist-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"artist name\\" \\n                    value={addedItem?.artist_name ?? null}\\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"album-name\\"\\n                >\\n                    album name\\n                </label>\\n                <input \\n                    class=\\"text\\" \\n                    id=\\"album-name\\" \\n                    name=\\"album-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"album name\\"\\n                    value={addedItem?.release_group_name ?? null}\\n                />\\n                <input  \\n                    id=\\"release-group-mbid\\" \\n                    name=\\"release-group-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.release_group_mbid ?? null}\\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"post-text\\"\\n                >\\n                    thoughts\\n                </label>\\n                <textarea\\n                    cols=\\"1\\"\\n                    rows=\\"5\\"\\n                    id=\\"post-text\\"\\n                    name=\\"post-text\\"\\n                    spellcheck=true \\n                    placeholder=\\"Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?\\"\\n                />\\n                <button class=\\"standard\\" formaction=\\"?/postAlbum\\" type=\\"submit\\">\\n                    submit\\n                </button>\\n            </form>\\n        </Tabs.Content>\\n        <Tabs.Content value=\\"track\\">\\n            <div class=\\"search\\">\\n                <MusicBrainzSearch\\n                    searchCategory=\\"recordings\\"\\n                    searchButtonText=\\"search\\"\\n                    searchPlaceholder=\\"look up a track\\"\\n                    bind:addedItems={addedItem}\\n                    bind:newItemAdded={newItemAdded}\\n                    mode=\\"single\\"\\n                ></MusicBrainzSearch>\\n                <Tooltip>\\n                    Search for a track to autofill this form.\\n                </Tooltip>\\n            </div>\\n            <form name=\\"track\\" class=\\"vertical\\">\\n                <input\\n                    id=\\"username\\"\\n                    name=\\"username\\"\\n                    type=\\"hidden\\"\\n                    value={username}\\n                />\\n                <input\\n                    id=\\"mbid-type\\" \\n                    name=\\"mbid-type\\" \\n                    type=\\"hidden\\" \\n                    value=\\"recording\\"\\n                />\\n                <input\\n                    id=\\"mbid\\" \\n                    name=\\"mbid\\" \\n                    type=\\"hidden\\" \\n                    value={addedItem?.recording_mbid ?? null} \\n                />\\n                <div class=\\"tooltip-group\\">\\n                    <label \\n                        class=\\"text-label\\" \\n                        for=\\"listen-url\\"\\n                    >\\n                        listen link\\n                    </label>\\n                    <Tooltip>\\n                        A link from Bandcamp, Soundcloud, Mixcloud, or YouTube can be embedded in your post. \\n                    </Tooltip>\\n                </div>\\n                <input \\n                    class=\\"text\\" \\n                    id=\\"listen-url\\" \\n                    name=\\"listen-url\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"paste link\\" \\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"artist-name\\"\\n                >\\n                    artist name\\n                </label>\\n                <input\\n                    class=\\"text\\"  \\n                    id=\\"artist-name\\" \\n                    name=\\"artist-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"artist name\\" \\n                    value={addedItem?.artist_name ?? null}\\n                />\\n                <input  \\n                    id=\\"artist-mbid\\" \\n                    name=\\"artist-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.artist_mbid ?? null}\\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"album-name\\"\\n                >\\n                    album name\\n                </label>\\n                <input \\n                    class=\\"text\\" \\n                    id=\\"album-name\\" \\n                    name=\\"album-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"album name\\" \\n                    value={addedItem?.release_group_name ?? null}\\n                />\\n                <input  \\n                    id=\\"release-group-mbid\\" \\n                    name=\\"release-group-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.release_group_mbid ?? null}\\n                />\\n                <label\\n                    class=\\"text-label\\" \\n                    for=\\"track-name\\"\\n                >\\n                    track name\\n                </label>\\n                <input \\n                    class=\\"text\\"    \\n                    id=\\"track-name\\" \\n                    name=\\"track-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"track title\\" \\n                    value={addedItem?.recording_name ?? null}\\n                />\\n                <input  \\n                    id=\\"recording-mbid\\" \\n                    name=\\"recording-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.recording_mbid ?? null}\\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"postText\\"\\n                >\\n                    thoughts\\n                </label>\\n                <textarea\\n                    cols=\\"1\\"\\n                    rows=\\"5\\"\\n                    id=\\"postText\\"\\n                    name=\\"postText\\"\\n                    spellcheck=true \\n                    placeholder=\\"Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?\\"\\n                />\\n                <button class=\\"standard\\" type=\\"submit\\">\\n                    submit\\n                </button>\\n            </form>\\n        </Tabs.Content>\\n        <Tabs.Content value=\\"mix\\">\\n            <!-- <MusicBrainzSearch\\n                searchCategory=\\"artists\\"\\n                searchButtonText=\\"search\\"\\n                searchPlaceholder=\\"look it up\\"\\n                bind:addedItems={addedItem}\\n                bind:newItemAdded={newItemAdded}\\n                mode=\\"single\\"\\n            ></MusicBrainzSearch> -->\\n            <form name=\\"mix\\" class=\\"vertical\\">\\n                <input\\n                    id=\\"username\\"\\n                    name=\\"username\\"\\n                    type=\\"hidden\\"\\n                    value={username}\\n                />\\n                <input\\n                    id=\\"item-type\\" \\n                    name=\\"item-type\\" \\n                    type=\\"hidden\\" \\n                    value=\\"artist\\"\\n                />\\n                <input\\n                    id=\\"mbid\\" \\n                    name=\\"mbid\\" \\n                    type=\\"hidden\\" \\n                    value={addedItem?.artist_mbid ?? null} \\n                />\\n                <div class=\\"tooltip-group\\">\\n                    <label \\n                        class=\\"text-label\\" \\n                        for=\\"listen-url\\"\\n                    >\\n                        listen link\\n                    </label>\\n                    <Tooltip>\\n                        A link from Bandcamp, Soundcloud, Mixcloud, or YouTube can be embedded in your post. \\n                    </Tooltip>\\n                </div>\\n                <input \\n                    class=\\"text\\" \\n                    id=\\"listen-url\\" \\n                    name=\\"listen-url\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"paste link\\" \\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"artist-name\\"\\n                >\\n                    host / dj\\n                </label>\\n                <input\\n                    class=\\"text\\"  \\n                    id=\\"artist-name\\" \\n                    name=\\"artist-name\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"artist name\\" \\n                    value={addedItem?.artist_name ?? null}\\n                />\\n                <input  \\n                    id=\\"artist-mbid\\" \\n                    name=\\"artist-mbid\\" \\n                    type=\\"hidden\\"\\n                    value={addedItem?.artist_mbid ?? null}\\n                />\\n                <label\\n                    class=\\"text-label\\" \\n                    for=\\"episode\\"\\n                >\\n                    episode / mix title\\n                </label>\\n                <input \\n                    class=\\"text\\"    \\n                    id=\\"episode\\" \\n                    name=\\"episode\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"episode\\" \\n                    value={addedItem?.episode_name ?? null}\\n                />\\n                <label\\n                    class=\\"text-label\\" \\n                    for=\\"show\\"\\n                >\\n                    show name / mix series\\n                </label>\\n                <input \\n                    class=\\"text\\"    \\n                    id=\\"show\\" \\n                    name=\\"show\\" \\n                    type=\\"text\\"\\n                    placeholder=\\"show\\" \\n                    value={addedItem?.show_name ?? null}\\n                />\\n                <label \\n                    class=\\"text-label\\" \\n                    for=\\"post-text\\"\\n                >\\n                    thoughts\\n                </label>\\n                <textarea\\n                    cols=\\"1\\"\\n                    rows=\\"5\\"\\n                    id=\\"post-text\\"\\n                    name=\\"post-text\\"\\n                    spellcheck=true \\n                    placeholder=\\"Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?\\"\\n                />\\n                <button class=\\"standard\\" type=\\"submit\\">\\n                    submit\\n                </button>\\n            </form>\\n        </Tabs.Content>\\n    </Tabs.Root>\\n</div>\\n\\n\\n<style>\\n    .border {\\n        display: flex;\\n        flex-direction: column;\\n        width: calc( 0.75 * var(--freq-max-width-primary));\\n        margin: var(--freq-spacing-large) auto;\\n        border: var(--freq-border-panel);\\n    }\\n    .search {\\n        display: flex;\\n        flex-direction: row;\\n        margin: var(--freq-height-spacer) var(--freq-width-spacer);\\n        align-items: center;\\n        gap: var(--freq-height-spacer-gap-quarter);\\n    }\\n</style>"],"names":[],"mappings":"AAkZI,sBAAQ,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,KAAK,CAAE,MAAM,IAAI,CAAC,CAAC,CAAC,IAAI,wBAAwB,CAAC,CAAC,CAClD,MAAM,CAAE,IAAI,oBAAoB,CAAC,CAAC,IAAI,CACtC,MAAM,CAAE,IAAI,mBAAmB,CACnC,CACA,sBAAQ,CACJ,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,MAAM,CAAE,IAAI,oBAAoB,CAAC,CAAC,IAAI,mBAAmB,CAAC,CAC1D,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IAAI,gCAAgC,CAC7C"}'
};
const NewNowPlayingPost = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form = null } = $$props;
  let addedItem;
  let newItemAdded;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    $$rendered = `<div class="border svelte-15h1nys">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
      default: () => {
        return `what are you listening to?`;
      }
    })} ${validate_component(Tabs, "Tabs.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Tabs_list, "Tabs.List").$$render($$result, {}, {}, {
          default: () => {
            return `${validate_component(Tabs_trigger, "Tabs.Trigger").$$render($$result, { value: "album" }, {}, {
              default: () => {
                return `album`;
              }
            })} ${validate_component(Tabs_trigger, "Tabs.Trigger").$$render($$result, { value: "track" }, {}, {
              default: () => {
                return `track`;
              }
            })} ${validate_component(Tabs_trigger, "Tabs.Trigger").$$render($$result, { value: "mix" }, {}, {
              default: () => {
                return `show episode / dj mix`;
              }
            })}`;
          }
        })} ${validate_component(Tabs_content, "Tabs.Content").$$render($$result, { value: "album" }, {}, {
          default: () => {
            return `<div class="search svelte-15h1nys">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
              $$result,
              {
                searchCategory: "release_groups",
                searchButtonText: "search",
                searchPlaceholder: "look up an album",
                mode: "single",
                limit: "10",
                addedItems: addedItem,
                newItemAdded
              },
              {
                addedItems: ($$value) => {
                  addedItem = $$value;
                  $$settled = false;
                },
                newItemAdded: ($$value) => {
                  newItemAdded = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
              default: () => {
                return `Search for an album to autofill this form.`;
              }
            })}</div> <form method="POST" action="?/postAlbum" name="album" class="vertical"><input id="username" name="username" type="hidden"${add_attribute("value", username, 0)}> <input id="item-type" name="item-type" type="hidden" value="release_group"> <input id="mbid" name="mbid" type="hidden"${add_attribute("value", addedItem?.releaseGroupMbid ?? null, 0)}>  <div class="tooltip-group"><label class="text-label" for="listen-url" data-svelte-h="svelte-12su7kr">listen link</label> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
              default: () => {
                return `A link from Bandcamp, Soundcloud, or YouTube can be embedded in your post.`;
              }
            })}</div>  <input class="text" id="listen-url" name="listen-url" type="text" placeholder="paste link">  <label class="text-label" for="artist-name" data-svelte-h="svelte-twuhtk">artist name</label> <input id="artist-mbid" name="artist-mbid" type="hidden"${add_attribute("value", addedItem?.artistMbid ?? null, 0)}> <input class="text" id="artist-name" name="artist-name" type="text" placeholder="artist name"${add_attribute("value", addedItem?.artist_name ?? null, 0)}> <label class="text-label" for="album-name" data-svelte-h="svelte-1owkr8a">album name</label> <input class="text" id="album-name" name="album-name" type="text" placeholder="album name"${add_attribute("value", addedItem?.release_group_name ?? null, 0)}> <input id="release-group-mbid" name="release-group-mbid" type="hidden"${add_attribute("value", addedItem?.release_group_mbid ?? null, 0)}> <label class="text-label" for="post-text" data-svelte-h="svelte-1csbhr7">thoughts</label> <textarea cols="1" rows="5" id="post-text" name="post-text" spellcheck="true" placeholder="Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?"></textarea> <button class="standard" formaction="?/postAlbum" type="submit" data-svelte-h="svelte-1mynbmz">submit</button></form>`;
          }
        })} ${validate_component(Tabs_content, "Tabs.Content").$$render($$result, { value: "track" }, {}, {
          default: () => {
            return `<div class="search svelte-15h1nys">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
              $$result,
              {
                searchCategory: "recordings",
                searchButtonText: "search",
                searchPlaceholder: "look up a track",
                mode: "single",
                addedItems: addedItem,
                newItemAdded
              },
              {
                addedItems: ($$value) => {
                  addedItem = $$value;
                  $$settled = false;
                },
                newItemAdded: ($$value) => {
                  newItemAdded = $$value;
                  $$settled = false;
                }
              },
              {}
            )} ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
              default: () => {
                return `Search for a track to autofill this form.`;
              }
            })}</div> <form name="track" class="vertical"><input id="username" name="username" type="hidden"${add_attribute("value", username, 0)}> <input id="mbid-type" name="mbid-type" type="hidden" value="recording"> <input id="mbid" name="mbid" type="hidden"${add_attribute("value", addedItem?.recording_mbid ?? null, 0)}> <div class="tooltip-group"><label class="text-label" for="listen-url" data-svelte-h="svelte-12su7kr">listen link</label> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
              default: () => {
                return `A link from Bandcamp, Soundcloud, Mixcloud, or YouTube can be embedded in your post.`;
              }
            })}</div> <input class="text" id="listen-url" name="listen-url" type="text" placeholder="paste link"> <label class="text-label" for="artist-name" data-svelte-h="svelte-twuhtk">artist name</label> <input class="text" id="artist-name" name="artist-name" type="text" placeholder="artist name"${add_attribute("value", addedItem?.artist_name ?? null, 0)}> <input id="artist-mbid" name="artist-mbid" type="hidden"${add_attribute("value", addedItem?.artist_mbid ?? null, 0)}> <label class="text-label" for="album-name" data-svelte-h="svelte-1owkr8a">album name</label> <input class="text" id="album-name" name="album-name" type="text" placeholder="album name"${add_attribute("value", addedItem?.release_group_name ?? null, 0)}> <input id="release-group-mbid" name="release-group-mbid" type="hidden"${add_attribute("value", addedItem?.release_group_mbid ?? null, 0)}> <label class="text-label" for="track-name" data-svelte-h="svelte-jaj7vm">track name</label> <input class="text" id="track-name" name="track-name" type="text" placeholder="track title"${add_attribute("value", addedItem?.recording_name ?? null, 0)}> <input id="recording-mbid" name="recording-mbid" type="hidden"${add_attribute("value", addedItem?.recording_mbid ?? null, 0)}> <label class="text-label" for="postText" data-svelte-h="svelte-g5xcqq">thoughts</label> <textarea cols="1" rows="5" id="postText" name="postText" spellcheck="true" placeholder="Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?"></textarea> <button class="standard" type="submit" data-svelte-h="svelte-1y1dqd">submit</button></form>`;
          }
        })} ${validate_component(Tabs_content, "Tabs.Content").$$render($$result, { value: "mix" }, {}, {
          default: () => {
            return ` <form name="mix" class="vertical"><input id="username" name="username" type="hidden"${add_attribute("value", username, 0)}> <input id="item-type" name="item-type" type="hidden" value="artist"> <input id="mbid" name="mbid" type="hidden"${add_attribute("value", addedItem?.artist_mbid ?? null, 0)}> <div class="tooltip-group"><label class="text-label" for="listen-url" data-svelte-h="svelte-12su7kr">listen link</label> ${validate_component(Tooltip, "Tooltip").$$render($$result, {}, {}, {
              default: () => {
                return `A link from Bandcamp, Soundcloud, Mixcloud, or YouTube can be embedded in your post.`;
              }
            })}</div> <input class="text" id="listen-url" name="listen-url" type="text" placeholder="paste link"> <label class="text-label" for="artist-name" data-svelte-h="svelte-waau3z">host / dj</label> <input class="text" id="artist-name" name="artist-name" type="text" placeholder="artist name"${add_attribute("value", addedItem?.artist_name ?? null, 0)}> <input id="artist-mbid" name="artist-mbid" type="hidden"${add_attribute("value", addedItem?.artist_mbid ?? null, 0)}> <label class="text-label" for="episode" data-svelte-h="svelte-1oqe48y">episode / mix title</label> <input class="text" id="episode" name="episode" type="text" placeholder="episode"${add_attribute("value", addedItem?.episode_name ?? null, 0)}> <label class="text-label" for="show" data-svelte-h="svelte-6nmqss">show name / mix series</label> <input class="text" id="show" name="show" type="text" placeholder="show"${add_attribute("value", addedItem?.show_name ?? null, 0)}> <label class="text-label" for="post-text" data-svelte-h="svelte-1csbhr7">thoughts</label> <textarea cols="1" rows="5" id="post-text" name="post-text" spellcheck="true" placeholder="Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?"></textarea> <button class="standard" type="submit" data-svelte-h="svelte-1y1dqd">submit</button></form>`;
          }
        })}`;
      }
    })} </div>`;
  } while (!$$settled);
  return $$rendered;
});
export {
  NewNowPlayingPost as N
};

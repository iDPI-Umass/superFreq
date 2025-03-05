import { o as once, b as push, k as spread_attributes, j as bind_props, p as pop, c as copy_payload, a as assign_payload, f as attr, e as escape_html } from "./index2.js";
import "./client.js";
import { P as PanelHeader } from "./PanelHeader.js";
import { M as MusicBrainzSearch } from "./MusicBrainzSearch.js";
import { T as Tooltip } from "./Tooltip.js";
import { C as Context, s as SvelteMap, u as useRefById, w as watch, S as SPACE, e as ENTER, t as getDataOrientation, p as getDataDisabled, v as getAriaOrientation, x as getDisabled, y as getAriaSelected, z as getHidden, j as useId, d as box, n as noop, m as mergeProps } from "./popper-layer-force-mount.js";
import "style-to-object";
import "clsx";
import { u as useRovingFocus } from "./use-roving-focus.svelte.js";
const TABS_ROOT_ATTR = "data-tabs-root";
const TABS_LIST_ATTR = "data-tabs-list";
const TABS_TRIGGER_ATTR = "data-tabs-trigger";
const TABS_CONTENT_ATTR = "data-tabs-content";
class TabsRootState {
  opts;
  rovingFocusGroup;
  triggerIds = [];
  // holds the trigger ID for each value to associate it with the content
  valueToTriggerId = new SvelteMap();
  // holds the content ID for each value to associate it with the trigger
  valueToContentId = new SvelteMap();
  constructor(opts) {
    this.opts = opts;
    useRefById(opts);
    this.rovingFocusGroup = useRovingFocus({
      candidateAttr: TABS_TRIGGER_ATTR,
      rootNodeId: this.opts.id,
      loop: this.opts.loop,
      orientation: this.opts.orientation
    });
  }
  registerTrigger(id, value) {
    this.triggerIds.push(id);
    this.valueToTriggerId.set(value, id);
    return () => {
      this.triggerIds = this.triggerIds.filter((triggerId) => triggerId !== id);
      this.valueToTriggerId.delete(value);
    };
  }
  registerContent(id, value) {
    this.valueToContentId.set(value, id);
    return () => {
      this.valueToContentId.delete(value);
    };
  }
  setValue(v) {
    this.opts.value.current = v;
  }
  #props = once(() => ({
    id: this.opts.id.current,
    "data-orientation": getDataOrientation(this.opts.orientation.current),
    [TABS_ROOT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
class TabsListState {
  opts;
  root;
  #isDisabled = once(() => this.root.opts.disabled.current);
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "tablist",
    "aria-orientation": getAriaOrientation(this.root.opts.orientation.current),
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    [TABS_LIST_ATTR]: "",
    "data-disabled": getDataDisabled(this.#isDisabled())
  }));
  get props() {
    return this.#props();
  }
}
class TabsTriggerState {
  opts;
  root;
  #isActive = once(() => this.root.opts.value.current === this.opts.value.current);
  #isDisabled = once(() => this.opts.disabled.current || this.root.opts.disabled.current);
  #tabIndex = 0;
  #ariaControls = once(() => this.root.valueToContentId.get(this.opts.value.current));
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
    watch(
      [
        () => this.opts.id.current,
        () => this.opts.value.current
      ],
      ([id, value]) => {
        return this.root.registerTrigger(id, value);
      }
    );
    this.onfocus = this.onfocus.bind(this);
    this.onclick = this.onclick.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
  }
  #activate() {
    if (this.root.opts.value.current === this.opts.value.current) return;
    this.root.setValue(this.opts.value.current);
  }
  onfocus(_) {
    if (this.root.opts.activationMode.current !== "automatic" || this.#isDisabled()) return;
    this.#activate();
  }
  onclick(_) {
    if (this.#isDisabled()) return;
    this.#activate();
  }
  onkeydown(e) {
    if (this.#isDisabled()) return;
    if (e.key === SPACE || e.key === ENTER) {
      e.preventDefault();
      this.#activate();
      return;
    }
    this.root.rovingFocusGroup.handleKeydown(this.opts.ref.current, e);
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "tab",
    "data-state": getTabDataState(this.#isActive()),
    "data-value": this.opts.value.current,
    "data-orientation": getDataOrientation(this.root.opts.orientation.current),
    "data-disabled": getDataDisabled(this.#isDisabled()),
    "aria-selected": getAriaSelected(this.#isActive()),
    "aria-controls": this.#ariaControls(),
    [TABS_TRIGGER_ATTR]: "",
    disabled: getDisabled(this.#isDisabled()),
    tabindex: this.#tabIndex,
    //
    onclick: this.onclick,
    onfocus: this.onfocus,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class TabsContentState {
  opts;
  root;
  #isActive = once(() => this.root.opts.value.current === this.opts.value.current);
  #ariaLabelledBy = once(() => this.root.valueToTriggerId.get(this.opts.value.current));
  constructor(opts, root) {
    this.opts = opts;
    this.root = root;
    useRefById(opts);
    watch(
      [
        () => this.opts.id.current,
        () => this.opts.value.current
      ],
      ([id, value]) => {
        return this.root.registerContent(id, value);
      }
    );
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "tabpanel",
    hidden: getHidden(!this.#isActive()),
    tabindex: 0,
    "data-value": this.opts.value.current,
    "data-state": getTabDataState(this.#isActive()),
    "aria-labelledby": this.#ariaLabelledBy(),
    [TABS_CONTENT_ATTR]: ""
  }));
  get props() {
    return this.#props();
  }
}
const TabsRootContext = new Context("Tabs.Root");
function useTabsRoot(props) {
  return TabsRootContext.set(new TabsRootState(props));
}
function useTabsTrigger(props) {
  return new TabsTriggerState(props, TabsRootContext.get());
}
function useTabsList(props) {
  return new TabsListState(props, TabsRootContext.get());
}
function useTabsContent(props) {
  return new TabsContentState(props, TabsRootContext.get());
}
function getTabDataState(condition) {
  return condition ? "active" : "inactive";
}
function Tabs($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    value = "",
    onValueChange = noop,
    orientation = "horizontal",
    loop = true,
    activationMode = "automatic",
    disabled = false,
    children,
    child,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const rootState = useTabsRoot({
    id: box.with(() => id),
    value: box.with(() => value, (v) => {
      value = v;
      onValueChange(v);
    }),
    orientation: box.with(() => orientation),
    loop: box.with(() => loop),
    activationMode: box.with(() => activationMode),
    disabled: box.with(() => disabled),
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
  bind_props($$props, { ref, value });
  pop();
}
function Tabs_content($$payload, $$props) {
  push();
  let {
    children,
    child,
    id = useId(),
    ref = null,
    value,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useTabsContent({
    value: box.with(() => value),
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
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
  bind_props($$props, { ref });
  pop();
}
function Tabs_list($$payload, $$props) {
  push();
  let {
    child,
    children,
    id = useId(),
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const listState = useTabsList({
    id: box.with(() => id),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, listState.props);
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
  bind_props($$props, { ref });
  pop();
}
function Tabs_trigger($$payload, $$props) {
  push();
  let {
    child,
    children,
    disabled = false,
    id = useId(),
    type = "button",
    value,
    ref = null,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useTabsTrigger({
    id: box.with(() => id),
    disabled: box.with(() => disabled ?? false),
    value: box.with(() => value),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  if (child) {
    $$payload.out += "<!--[-->";
    child($$payload, { props: mergedProps });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...mergedProps })}>`;
    children?.($$payload);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  bind_props($$props, { ref });
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
      value: "album",
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

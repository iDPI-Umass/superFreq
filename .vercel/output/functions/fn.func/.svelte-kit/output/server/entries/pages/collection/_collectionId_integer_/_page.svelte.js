import { c as compute_rest_props, s as subscribe } from "../../../../chunks/utils.js";
import { s as setContext, g as getContext, c as create_ssr_component, a as spread, b as escape_object, d as add_attribute, v as validate_component, f as escape } from "../../../../chunks/ssr.js";
import "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/stores2.js";
import "dequal";
import { t as toWritableStores, m as makeElement, j as createElHelpers, b as addMeltEventListener, o as overridable, l as disabledAttr, a as executeCallbacks, i as isHTMLElement, k as kbd, r as createBitAttrs, v as removeUndefined, x as getOptionUpdater, y as createDispatcher, z as disabledAttrs } from "../../../../chunks/updater.js";
import { w as writable, d as derived } from "../../../../chunks/index2.js";
import { h as handleRovingFocus } from "../../../../chunks/rovingFocus.js";
import { I as Icon } from "../../../../chunks/Icon.js";
/* empty css                                     */
import { G as GridList } from "../../../../chunks/GridList.js";
const defaults = {
  loop: true,
  orientation: "horizontal"
};
const { name, selector } = createElHelpers("toolbar");
const createToolbar = (props) => {
  const withDefaults = { ...defaults, ...props };
  const options = toWritableStores(withDefaults);
  const { loop, orientation } = options;
  const root = makeElement(name(), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "toolbar",
        "data-orientation": $orientation
      };
    }
  });
  const button = makeElement(name("button"), {
    returned: () => ({
      role: "button",
      type: "button"
    }),
    action: (node) => {
      setNodeTabIndex(node);
      const unsub = addMeltEventListener(node, "keydown", handleKeyDown);
      return {
        destroy: unsub
      };
    }
  });
  const link = makeElement(name("link"), {
    returned: () => ({
      role: "link"
    }),
    action: (node) => {
      setNodeTabIndex(node);
      const unsub = addMeltEventListener(node, "keydown", handleKeyDown);
      return {
        destroy: unsub
      };
    }
  });
  const separator = makeElement(name("separator"), {
    stores: orientation,
    returned: ($orientation) => {
      return {
        role: "separator",
        "data-orientation": $orientation === "horizontal" ? "vertical" : "horizontal",
        "aria-orientation": $orientation === "horizontal" ? "vertical" : "horizontal"
      };
    }
  });
  const groupDefaults = {
    type: "single",
    disabled: false
  };
  const createToolbarGroup = (props2) => {
    const groupWithDefaults = { ...groupDefaults, ...props2 };
    const options2 = toWritableStores(groupWithDefaults);
    const { type, disabled } = options2;
    const defaultValue = groupWithDefaults.defaultValue ? groupWithDefaults.defaultValue : groupWithDefaults.type === "single" ? void 0 : [];
    const valueWritable = groupWithDefaults.value ?? writable(defaultValue);
    const value = overridable(valueWritable, groupWithDefaults?.onValueChange);
    const { name: name2 } = createElHelpers("toolbar-group");
    const group = makeElement(name2(), {
      stores: orientation,
      returned: ($orientation) => {
        return {
          role: "group",
          "data-orientation": $orientation
        };
      }
    });
    const item = makeElement(name2("item"), {
      stores: [disabled, type, value, orientation],
      returned: ([$disabled, $type, $value, $orientation]) => {
        return (props3) => {
          const itemValue = typeof props3 === "string" ? props3 : props3.value;
          const argDisabled = typeof props3 === "string" ? false : !!props3.disabled;
          const disabled2 = $disabled || argDisabled;
          const pressed = Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
          const isSingle = $type === "single";
          const isMultiple = $type === "multiple";
          return {
            disabled: disabledAttr(disabled2),
            pressed,
            "data-orientation": $orientation,
            "data-disabled": disabledAttr(disabled2),
            "data-value": itemValue,
            "data-state": pressed ? "on" : "off",
            "aria-checked": isSingle ? pressed : void 0,
            "aria-pressed": isMultiple ? pressed : void 0,
            type: "button",
            role: isSingle ? "radio" : void 0,
            "data-melt-toolbar-item": ""
          };
        };
      },
      action: (node) => {
        setNodeTabIndex(node);
        function getNodeProps() {
          const itemValue = node.dataset.value;
          const disabled2 = node.dataset.disabled === "true";
          return { value: itemValue, disabled: disabled2 };
        }
        function handleValueUpdate() {
          const { value: itemValue, disabled: disabled2 } = getNodeProps();
          if (itemValue === void 0 || disabled2)
            return;
          value.update(($value) => {
            if (Array.isArray($value)) {
              if ($value.includes(itemValue)) {
                return $value.filter((i) => i !== itemValue);
              }
              $value.push(itemValue);
              return $value;
            }
            return $value === itemValue ? void 0 : itemValue;
          });
        }
        const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
          handleValueUpdate();
        }), addMeltEventListener(node, "keydown", (e) => {
          if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
            e.preventDefault();
            handleValueUpdate();
            return;
          }
          handleKeyDown(e);
        }));
        return {
          destroy: unsub
        };
      }
    });
    const isPressed = derived(value, ($value) => {
      return (itemValue) => {
        return Array.isArray($value) ? $value.includes(itemValue) : $value === itemValue;
      };
    });
    return {
      elements: {
        group,
        item
      },
      states: {
        value
      },
      helpers: {
        isPressed
      },
      options: options2
    };
  };
  function handleKeyDown(e) {
    const $orientation = orientation.get();
    const $loop = loop.get();
    const nextKey = {
      horizontal: kbd.ARROW_RIGHT,
      vertical: kbd.ARROW_DOWN
    }[$orientation ?? "horizontal"];
    const prevKey = {
      horizontal: kbd.ARROW_LEFT,
      vertical: kbd.ARROW_UP
    }[$orientation ?? "horizontal"];
    const el = e.currentTarget;
    if (!isHTMLElement(el))
      return;
    const root2 = el.closest("[data-melt-toolbar]");
    if (!isHTMLElement(root2))
      return;
    const items = getToolbarItems(root2);
    const currentIndex = items.indexOf(el);
    if (e.key === nextKey) {
      e.preventDefault();
      const nextIndex = currentIndex + 1;
      if (nextIndex >= items.length && $loop) {
        handleRovingFocus(items[0]);
      } else {
        handleRovingFocus(items[nextIndex]);
      }
    } else if (e.key === prevKey) {
      e.preventDefault();
      const prevIndex = currentIndex - 1;
      if (prevIndex < 0 && $loop) {
        handleRovingFocus(items[items.length - 1]);
      } else {
        handleRovingFocus(items[prevIndex]);
      }
    } else if (e.key === kbd.HOME) {
      e.preventDefault();
      handleRovingFocus(items[0]);
    } else if (e.key === kbd.END) {
      e.preventDefault();
      handleRovingFocus(items[items.length - 1]);
    }
  }
  return {
    elements: {
      root,
      button,
      separator,
      link
    },
    builders: {
      createToolbarGroup
    },
    options
  };
};
function setNodeTabIndex(node) {
  const parentToolbar = node.closest("[data-melt-toolbar]");
  if (!isHTMLElement(parentToolbar))
    return;
  const items = getToolbarItems(parentToolbar);
  if (items[0] === node) {
    node.tabIndex = 0;
  } else {
    node.tabIndex = -1;
  }
}
function getToolbarItems(element) {
  return Array.from(element.querySelectorAll(`${selector("item")}, ${selector("button")}, ${selector("link")}`)).filter((el) => isHTMLElement(el));
}
function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((value, index) => value === arr2[index]);
}
function getToolbarData() {
  const NAME = "toolbar";
  const GROUP_NAME = "toolbar-group";
  const PARTS = ["root", "button", "link", "group", "group-item"];
  return {
    NAME,
    GROUP_NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getToolbarData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const toolbar = { ...createToolbar(removeUndefined(props)), getAttrs };
  setContext(NAME, toolbar);
  return {
    ...toolbar,
    updateOption: getOptionUpdater(toolbar.options)
  };
}
function setGroupCtx(props) {
  const { builders: { createToolbarGroup }, getAttrs } = getCtx();
  const group = { ...createToolbarGroup(removeUndefined(props)), getAttrs };
  const { GROUP_NAME } = getToolbarData();
  setContext(GROUP_NAME, group);
  return {
    ...group,
    updateOption: getOptionUpdater(group.options)
  };
}
function getCtx() {
  const { NAME } = getToolbarData();
  return getContext(NAME);
}
function getGroupCtx() {
  const { GROUP_NAME } = getToolbarData();
  return getContext(GROUP_NAME);
}
const Toolbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["loop", "orientation", "asChild", "el"]);
  let $root, $$unsubscribe_root;
  let { loop = true } = $$props;
  let { orientation = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { root }, updateOption, getAttrs } = setCtx({ loop, orientation });
  $$unsubscribe_root = subscribe(root, (value) => $root = value);
  const attrs = getAttrs("root");
  if ($$props.loop === void 0 && $$bindings.loop && loop !== void 0) $$bindings.loop(loop);
  if ($$props.orientation === void 0 && $$bindings.orientation && orientation !== void 0) $$bindings.orientation(orientation);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    updateOption("loop", loop);
  }
  {
    updateOption("orientation", orientation);
  }
  builder = $root;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_root();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Toolbar_group = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, ["type", "disabled", "value", "onValueChange", "asChild", "el"]);
  let $group, $$unsubscribe_group;
  let { type = "single" } = $$props;
  let { disabled = void 0 } = $$props;
  let { value = void 0 } = $$props;
  let { onValueChange = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { group }, states: { value: localValue }, updateOption, getAttrs } = setGroupCtx({
    disabled,
    type,
    defaultValue: value,
    onValueChange: ({ next }) => {
      if (Array.isArray(next)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next)) {
          onValueChange?.(next);
          value = next;
          return next;
        }
        return next;
      }
      if (value !== next) {
        onValueChange?.(next);
        value = next;
      }
      return next;
    }
  });
  $$unsubscribe_group = subscribe(group, (value2) => $group = value2);
  const attrs = getAttrs("group");
  if ($$props.type === void 0 && $$bindings.type && type !== void 0) $$bindings.type(type);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.onValueChange === void 0 && $$bindings.onValueChange && onValueChange !== void 0) $$bindings.onValueChange(onValueChange);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  {
    updateOption("disabled", disabled);
  }
  {
    updateOption("type", type);
  }
  builder = $group;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_group();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>`}`;
});
const Toolbar_group_item = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["value", "disabled", "asChild", "el"]);
  let $item, $$unsubscribe_item;
  let { value } = $$props;
  let { disabled = false } = $$props;
  let { asChild = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { item }, getAttrs } = getGroupCtx();
  $$unsubscribe_item = subscribe(item, (value2) => $item = value2);
  createDispatcher();
  if ($$props.value === void 0 && $$bindings.value && value !== void 0) $$bindings.value(value);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0) $$bindings.disabled(disabled);
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  attrs = {
    ...getAttrs("group-item"),
    ...disabledAttrs(disabled)
  };
  builder = $item({ value, disabled });
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_item();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
const Align_justify = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "6",
        "y2": "6"
      }
    ],
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "12",
        "y2": "12"
      }
    ],
    [
      "line",
      {
        "x1": "3",
        "x2": "21",
        "y1": "18",
        "y2": "18"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "align-justify" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Layout_grid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    [
      "rect",
      {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "14",
        "rx": "1"
      }
    ],
    [
      "rect",
      {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "14",
        "rx": "1"
      }
    ]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "layout-grid" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const css = {
  code: ".collection-container.svelte-11aop66.svelte-11aop66{max-width:var(--freq-max-width-primary);margin:3vh 3vw;border:var(--freq-border-panel)}.collection-info.svelte-11aop66.svelte-11aop66{display:flex;flex-direction:column;padding:var(--freq-width-spacer-half)}.collection-metadata.svelte-11aop66 .svelte-11aop66{margin:var(--freq-spacing-x-small) 0}.collection-title-follow-top-row.svelte-11aop66.svelte-11aop66{display:flex;flex-direction:row;justify-content:space-between;align-items:center;margin-right:2vw}.sort.svelte-11aop66.svelte-11aop66{display:flex;flex-direction:row;width:inherit;padding:0 var(--freq-width-spacer-half);border-top:1px solid var(--freq-color-background-badge);border-bottom:1px solid var(--freq-color-background-badge);align-items:center}.sort.svelte-11aop66 .svelte-11aop66{padding:var(--freq-spacing-2x-small) var(--freq-spacing-small)}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { goto } from \\"$app/navigation\\";\\nimport { page } from \\"$app/stores\\";\\nimport { Toolbar } from \\"bits-ui\\";\\nimport LayoutGrid from \\"lucide-svelte/icons/layout-grid\\";\\nimport AlignJustify from \\"lucide-svelte/icons/align-justify\\";\\nimport \\"$lib/styles/media-grid-list.css\\";\\nimport \\"$lib/styles/metadata-formatting.css\\";\\nimport GridList from \\"$lib/components/GridList.svelte\\";\\nexport let data;\\nlet { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data;\\n$: ({ sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data);\\nconst collectionType = collectionInfo?.type;\\nconst collectionUpdatedAt = collectionInfo?.updated_at;\\nlet gridListSelect = \\"grid\\";\\nconst categories = {\\n  \\"artists\\": \\"artists\\",\\n  \\"release_groups\\": \\"albums\\",\\n  \\"recording\\": \\"tracks\\"\\n};\\nconst updatedAt = new Date(collectionUpdatedAt).toLocaleDateString();\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\t{collectionInfo.title}\\n\\t</title>\\n</svelte:head>\\n\\n\\n<body>\\n    <div class=\\"collection-container\\">\\n        <div class=\\"collection-info\\">\\n            <div class=\\"collection-metadata\\">\\n                <div class=\\"collection-title-follow-top-row\\">\\n                    <h1>{collectionInfo?.title}</h1>\\n                    {#if \\n                        sessionUserId && !editPermission}\\n                    <form\\n                        method=\\"POST\\"\\n                        action=\\"?/followCollection\\"\\n                    >\\n                        <input \\n                            type=\\"hidden\\"\\n                            name=\\"collection-id\\" \\n                            id=\\"collection-id\\"\\n                            value={collectionId}\\n                        />\\n                        <button \\n                            class=\\"standard\\" \\n                            formaction=\\"?/followCollection\\"\\n                        >\\n                        {#if followData && followData['follows_now'] == true}\\n                            unfollow\\n                        {:else}\\n                            + follow\\n                        {/if}\\n                        </button>\\n                    </form>\\n                    {:else if sessionUserId && editPermission}\\n                        <button \\n                            class=\\"standard\\"\\n                            on:click|preventDefault={() => goto($page.url.pathname + '/edit')}\\n                        >\\n                        edit\\n                        </button>\\n                    {/if}\\n                </div>\\n            </div>\\n            <div class=\\"frontmatter blurb-formatting\\">\\n                <p class=\\"frontmatter-info-text\\">\\n                    Collection of {categories[collectionType]} by \\n                    <a href=\\"/user/{collectionInfo?.username}\\">\\n                        {collectionInfo?.display_name}\\n                    </a>\\n                </p>\\n                <p class=\\"frontmatter-date-text\\">Last updated on {updatedAt}</p>\\n                {#if collectionInfo?.description_text}\\n                    <p>{collectionInfo?.description_text}</p>\\n                {/if}\\n            </div>\\n        </div>\\n\\n        <div class=\\"sort\\">\\n            <p> sorting options </p>\\n            <Toolbar.Root>\\n                <Toolbar.Group\\n                    bind:value={gridListSelect}\\n                    type=\\"single\\"\\n                >\\n                    <Toolbar.GroupItem\\n                        aria-label=\\"grid\\"\\n                        value=\\"grid\\"\\n                        class=\\"toolbar-item\\"\\n                    >\\n                        <LayoutGrid class=\\"grid-list-icon\\"></LayoutGrid>\\n                    </Toolbar.GroupItem>\\n                    <Toolbar.GroupItem\\n                    aria-label=\\"list\\"\\n                    value=\\"list\\"\\n                    class=\\"toolbar-item\\"\\n                    >\\n                        <AlignJustify class=\\"grid-list-icon\\"></AlignJustify>\\n                    </Toolbar.GroupItem>\\n                </Toolbar.Group>\\n            </Toolbar.Root>\\n            <p>{gridListSelect}</p>\\n        </div>\\n        <GridList\\n            collectionContents={collectionContents}\\n            collectionReturned={viewPermission}\\n            collectionType={collectionType}\\n            layout={gridListSelect}\\n            mode=\\"view\\"\\n        >\\n        </GridList>\\n\\n    </div>\\n</body>\\n\\n<style>\\n    .collection-container {\\n        max-width: var(--freq-max-width-primary);\\n        margin: 3vh 3vw;\\n        border: var(--freq-border-panel);\\n    }\\n    .collection-info {\\n        display: flex;\\n        flex-direction: column;\\n        padding: var(--freq-width-spacer-half);\\n    }\\n    .collection-metadata * {\\n        margin: var(--freq-spacing-x-small) 0;\\n    }\\n    .collection-title-follow-top-row {\\n        display: flex;\\n        flex-direction: row;\\n        justify-content: space-between;\\n        align-items: center;\\n        margin-right: 2vw;\\n    }\\n    .sort {\\n        display: flex;\\n        flex-direction: row;\\n        width: inherit;\\n        padding: 0 var(--freq-width-spacer-half);\\n        border-top: 1px solid var(--freq-color-background-badge);\\n        border-bottom: 1px solid var(--freq-color-background-badge);\\n        align-items: center;\\n    }\\n    .sort * {\\n        padding: var(--freq-spacing-2x-small) var(--freq-spacing-small);\\n    }\\n</style>"],"names":[],"mappings":"AAwHI,mDAAsB,CAClB,SAAS,CAAE,IAAI,wBAAwB,CAAC,CACxC,MAAM,CAAE,GAAG,CAAC,GAAG,CACf,MAAM,CAAE,IAAI,mBAAmB,CACnC,CACA,8CAAiB,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,wBAAwB,CACzC,CACA,mCAAoB,CAAC,eAAE,CACnB,MAAM,CAAE,IAAI,sBAAsB,CAAC,CAAC,CACxC,CACA,8DAAiC,CAC7B,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,eAAe,CAAE,aAAa,CAC9B,WAAW,CAAE,MAAM,CACnB,YAAY,CAAE,GAClB,CACA,mCAAM,CACF,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,KAAK,CAAE,OAAO,CACd,OAAO,CAAE,CAAC,CAAC,IAAI,wBAAwB,CAAC,CACxC,UAAU,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,6BAA6B,CAAC,CACxD,aAAa,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,6BAA6B,CAAC,CAC3D,WAAW,CAAE,MACjB,CACA,oBAAK,CAAC,eAAE,CACJ,OAAO,CAAE,IAAI,uBAAuB,CAAC,CAAC,IAAI,oBAAoB,CAClE"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => value);
  let { data } = $$props;
  let { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data;
  const collectionType = collectionInfo?.type;
  const collectionUpdatedAt = collectionInfo?.updated_at;
  let gridListSelect = "grid";
  const categories = {
    "artists": "artists",
    "release_groups": "albums",
    "recording": "tracks"
  };
  const updatedAt = new Date(collectionUpdatedAt).toLocaleDateString();
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data);
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-yq6h93_START -->${$$result.title = `<title> ${escape(collectionInfo.title)} </title>`, ""}<!-- HEAD_svelte-yq6h93_END -->`, ""} <body><div class="collection-container svelte-11aop66"><div class="collection-info svelte-11aop66"><div class="collection-metadata svelte-11aop66"><div class="collection-title-follow-top-row svelte-11aop66"><h1 class="svelte-11aop66">${escape(collectionInfo?.title)}</h1> ${sessionUserId && !editPermission ? `<form method="POST" action="?/followCollection" class="svelte-11aop66"><input type="hidden" name="collection-id" id="collection-id"${add_attribute("value", collectionId, 0)} class="svelte-11aop66"> <button class="standard svelte-11aop66" formaction="?/followCollection">${followData && followData["follows_now"] == true ? `unfollow` : `+ follow`}</button></form>` : `${sessionUserId && editPermission ? `<button class="standard svelte-11aop66" data-svelte-h="svelte-os6jij">edit</button>` : ``}`}</div></div> <div class="frontmatter blurb-formatting"><p class="frontmatter-info-text">Collection of ${escape(categories[collectionType])} by 
                    <a href="${"/user/" + escape(collectionInfo?.username, true)}">${escape(collectionInfo?.display_name)}</a></p> <p class="frontmatter-date-text">Last updated on ${escape(updatedAt)}</p> ${collectionInfo?.description_text ? `<p>${escape(collectionInfo?.description_text)}</p>` : ``}</div></div> <div class="sort svelte-11aop66"><p class="svelte-11aop66" data-svelte-h="svelte-1g658o6">sorting options</p> ${validate_component(Toolbar, "Toolbar.Root").$$render($$result, {}, {}, {
      default: () => {
        return `${validate_component(Toolbar_group, "Toolbar.Group").$$render(
          $$result,
          { type: "single", value: gridListSelect },
          {
            value: ($$value) => {
              gridListSelect = $$value;
              $$settled = false;
            }
          },
          {
            default: () => {
              return `${validate_component(Toolbar_group_item, "Toolbar.GroupItem").$$render(
                $$result,
                {
                  "aria-label": "grid",
                  value: "grid",
                  class: "toolbar-item"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Layout_grid, "LayoutGrid").$$render($$result, { class: "grid-list-icon" }, {}, {})}`;
                  }
                }
              )} ${validate_component(Toolbar_group_item, "Toolbar.GroupItem").$$render(
                $$result,
                {
                  "aria-label": "list",
                  value: "list",
                  class: "toolbar-item"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Align_justify, "AlignJustify").$$render($$result, { class: "grid-list-icon" }, {}, {})}`;
                  }
                }
              )}`;
            }
          }
        )}`;
      }
    })} <p class="svelte-11aop66">${escape(gridListSelect)}</p></div> ${validate_component(GridList, "GridList").$$render(
      $$result,
      {
        collectionContents,
        collectionReturned: viewPermission,
        collectionType,
        layout: gridListSelect,
        mode: "view"
      },
      {},
      {}
    )}</div> </body>`;
  } while (!$$settled);
  $$unsubscribe_page();
  return $$rendered;
});
export {
  Page as default
};

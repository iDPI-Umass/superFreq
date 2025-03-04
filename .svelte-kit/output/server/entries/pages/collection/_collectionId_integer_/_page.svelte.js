import { u as setContext, q as getContext, b as push, n as slot, v as store_get, w as unsubscribe_stores, j as bind_props, p as pop, k as sanitize_props, r as rest_props, l as spread_attributes, e as escape_html, o as spread_props, c as copy_payload, a as assign_payload, h as head, f as attr, s as stringify, d as ensure_array_like } from "../../../../chunks/index2.js";
import "../../../../chunks/client.js";
import { dequal } from "dequal";
import { a as isHTMLElement, r as getElementByMeltId, h as isElement, v as isHTMLLabelElement, m as makeElement, g as addMeltEventListener, w as withGet, o as omit, d as createElHelpers, f as executeCallbacks, k as kbd, x as isHTMLButtonElement, t as tick, F as FIRST_LAST_KEYS, y as isElementDisabled, u as useEscapeKeydown, n as noop, j as disabledAttr, z as isHTMLInputElement, e as effect, c as styleToString, A as createHiddenInput, s as safeOnMount, b as isBrowser, B as isObject, C as stripValues } from "../../../../chunks/create.js";
import { w as writable, d as derived, g as get, a as readonly } from "../../../../chunks/index3.js";
import "clsx";
import { o as overridable, t as toWritableStores, g as generateIds, d as derivedVisible, l as last, i as back, j as forward, p as prev, n as next, k as generateId, m as toggle, u as usePopper, a as getPortalDestination, r as removeScroll, c as createBitAttrs, e as removeUndefined, f as getOptionUpdater, h as getPositioningUpdater, q as disabledAttrs } from "../../../../chunks/helpers.js";
import { c as createTypeaheadSearch, a as addHighlight, r as removeHighlight, h as handleRovingFocus, C as Chevron_down } from "../../../../chunks/chevron-down.js";
import { f as fallback } from "../../../../chunks/utils.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { G as GridList } from "../../../../chunks/GridList.js";
import { I as InfoBox } from "../../../../chunks/InfoBox.js";
import { I as InlineMarkdownText } from "../../../../chunks/InlineMarkdownText.js";
function getOptions(el) {
  return Array.from(el.querySelectorAll('[role="option"]:not([data-disabled])')).filter((el2) => isHTMLElement(el2));
}
function createClickOutsideIgnore(meltId) {
  return (e) => {
    const target = e.target;
    const triggerEl = getElementByMeltId(meltId);
    if (!triggerEl || !isElement(target))
      return false;
    const id = triggerEl.id;
    if (isHTMLLabelElement(target) && id === target.htmlFor) {
      return true;
    }
    if (target.closest(`label[for="${id}"]`)) {
      return true;
    }
    return false;
  };
}
function createLabel() {
  const root = makeElement("label", {
    action: (node) => {
      const mouseDown = addMeltEventListener(node, "mousedown", (e) => {
        if (!e.defaultPrevented && e.detail > 1) {
          e.preventDefault();
        }
      });
      return {
        destroy: mouseDown
      };
    }
  });
  return {
    elements: {
      root
    }
  };
}
const INTERACTION_KEYS = [kbd.ARROW_LEFT, kbd.ESCAPE, kbd.ARROW_RIGHT, kbd.SHIFT, kbd.CAPS_LOCK, kbd.CONTROL, kbd.ALT, kbd.META, kbd.ENTER, kbd.F1, kbd.F2, kbd.F3, kbd.F4, kbd.F5, kbd.F6, kbd.F7, kbd.F8, kbd.F9, kbd.F10, kbd.F11, kbd.F12];
const defaults$1 = {
  positioning: {
    placement: "bottom",
    sameWidth: true
  },
  scrollAlignment: "nearest",
  loop: true,
  defaultOpen: false,
  closeOnOutsideClick: true,
  preventScroll: true,
  closeOnEscape: true,
  forceVisible: false,
  portal: void 0,
  builder: "listbox",
  disabled: false,
  required: false,
  name: void 0,
  typeahead: true,
  highlightOnHover: true,
  onOutsideClick: void 0
};
const listboxIdParts = ["trigger", "menu", "label"];
function createListbox(props) {
  const withDefaults = { ...defaults$1, ...props };
  const activeTrigger = withGet(writable(null));
  const highlightedItem = withGet(writable(null));
  const selectedWritable = withDefaults.selected ?? writable(withDefaults.defaultSelected);
  const selected = overridable(selectedWritable, withDefaults?.onSelectedChange);
  const highlighted = derived(highlightedItem, ($highlightedItem) => $highlightedItem ? getOptionProps($highlightedItem) : void 0);
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const options = toWritableStores({
    ...omit(withDefaults, "open", "defaultOpen", "builder", "ids"),
    multiple: withDefaults.multiple ?? false
  });
  const { scrollAlignment, loop, closeOnOutsideClick, closeOnEscape, preventScroll, portal, forceVisible, positioning, multiple, arrowSize, disabled, required, typeahead, name: nameProp, highlightOnHover, onOutsideClick } = options;
  const { name: name2, selector: selector2 } = createElHelpers(withDefaults.builder);
  const ids = toWritableStores({ ...generateIds(listboxIdParts), ...withDefaults.ids });
  const { handleTypeaheadSearch } = createTypeaheadSearch({
    onMatch: (element) => {
      highlightedItem.set(element);
      element.scrollIntoView({ block: scrollAlignment.get() });
    },
    getCurrentItem() {
      return highlightedItem.get();
    }
  });
  function getOptionProps(el) {
    const value = el.getAttribute("data-value");
    const label2 = el.getAttribute("data-label");
    const disabled2 = el.hasAttribute("data-disabled");
    return {
      value: value ? JSON.parse(value) : value,
      label: label2 ?? el.textContent ?? void 0,
      disabled: disabled2 ? true : false
    };
  }
  const setOption = (newOption) => {
    selected.update(($option) => {
      const $multiple = multiple.get();
      if ($multiple) {
        const optionArr = Array.isArray($option) ? [...$option] : [];
        return toggle(newOption, optionArr, (itemA, itemB) => dequal(itemA.value, itemB.value));
      }
      return newOption;
    });
  };
  function selectItem(item) {
    const props2 = getOptionProps(item);
    setOption(props2);
  }
  async function openMenu() {
    open.set(true);
    const triggerEl = document.getElementById(ids.trigger.get());
    if (!triggerEl)
      return;
    if (triggerEl !== activeTrigger.get())
      activeTrigger.set(triggerEl);
    await tick();
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    const selectedItem = menuElement.querySelector("[aria-selected=true]");
    if (!isHTMLElement(selectedItem))
      return;
    highlightedItem.set(selectedItem);
  }
  function closeMenu() {
    open.set(false);
    highlightedItem.set(null);
  }
  const isVisible = derivedVisible({ open, forceVisible, activeTrigger });
  const isSelected = derived([selected], ([$selected]) => {
    return (value) => {
      if (Array.isArray($selected)) {
        return $selected.some((o) => dequal(o.value, value));
      }
      if (isObject(value)) {
        return dequal($selected?.value, stripValues(value, void 0));
      }
      return dequal($selected?.value, value);
    };
  });
  const isHighlighted = derived([highlighted], ([$value]) => {
    return (item) => {
      return dequal($value?.value, item);
    };
  });
  const trigger = makeElement(name2("trigger"), {
    stores: [open, highlightedItem, disabled, ids.menu, ids.trigger, ids.label],
    returned: ([$open, $highlightedItem, $disabled, $menuId, $triggerId, $labelId]) => {
      return {
        "aria-activedescendant": $highlightedItem?.id,
        "aria-autocomplete": "list",
        "aria-controls": $menuId,
        "aria-expanded": $open,
        "aria-labelledby": $labelId,
        // autocomplete: 'off',
        id: $triggerId,
        role: "combobox",
        disabled: disabledAttr($disabled),
        type: withDefaults.builder === "select" ? "button" : void 0
      };
    },
    action: (node) => {
      const isInput = isHTMLInputElement(node);
      const unsubscribe = executeCallbacks(
        addMeltEventListener(node, "click", () => {
          node.focus();
          const $open = open.get();
          if ($open) {
            closeMenu();
          } else {
            openMenu();
          }
        }),
        // Handle all input key events including typing, meta, and navigation.
        addMeltEventListener(node, "keydown", (e) => {
          const $open = open.get();
          if (!$open) {
            if (INTERACTION_KEYS.includes(e.key)) {
              return;
            }
            if (e.key === kbd.TAB) {
              return;
            }
            if (e.key === kbd.BACKSPACE && isInput && node.value === "") {
              return;
            }
            if (e.key === kbd.SPACE && isHTMLButtonElement(node)) {
              return;
            }
            openMenu();
            tick().then(() => {
              const $selectedItem = selected.get();
              if ($selectedItem)
                return;
              const menuEl = document.getElementById(ids.menu.get());
              if (!isHTMLElement(menuEl))
                return;
              const enabledItems = Array.from(menuEl.querySelectorAll(`${selector2("item")}:not([data-disabled]):not([data-hidden])`)).filter((item) => isHTMLElement(item));
              if (!enabledItems.length)
                return;
              if (e.key === kbd.ARROW_DOWN) {
                highlightedItem.set(enabledItems[0]);
                enabledItems[0].scrollIntoView({ block: scrollAlignment.get() });
              } else if (e.key === kbd.ARROW_UP) {
                highlightedItem.set(last(enabledItems));
                last(enabledItems).scrollIntoView({ block: scrollAlignment.get() });
              }
            });
          }
          if (e.key === kbd.TAB) {
            closeMenu();
            return;
          }
          if (e.key === kbd.ENTER && !e.isComposing || e.key === kbd.SPACE && isHTMLButtonElement(node)) {
            e.preventDefault();
            const $highlightedItem = highlightedItem.get();
            if ($highlightedItem) {
              selectItem($highlightedItem);
            }
            if (!multiple.get()) {
              closeMenu();
            }
          }
          if (e.key === kbd.ARROW_UP && e.altKey) {
            closeMenu();
          }
          if (FIRST_LAST_KEYS.includes(e.key)) {
            e.preventDefault();
            const menuElement = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuElement))
              return;
            const itemElements = getOptions(menuElement);
            if (!itemElements.length)
              return;
            const candidateNodes = itemElements.filter((opt) => !isElementDisabled(opt) && opt.dataset.hidden === void 0);
            const $currentItem = highlightedItem.get();
            const currentIndex = $currentItem ? candidateNodes.indexOf($currentItem) : -1;
            const $loop = loop.get();
            const $scrollAlignment = scrollAlignment.get();
            let nextItem;
            switch (e.key) {
              case kbd.ARROW_DOWN:
                nextItem = next(candidateNodes, currentIndex, $loop);
                break;
              case kbd.ARROW_UP:
                nextItem = prev(candidateNodes, currentIndex, $loop);
                break;
              case kbd.PAGE_DOWN:
                nextItem = forward(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.PAGE_UP:
                nextItem = back(candidateNodes, currentIndex, 10, $loop);
                break;
              case kbd.HOME:
                nextItem = candidateNodes[0];
                break;
              case kbd.END:
                nextItem = last(candidateNodes);
                break;
              default:
                return;
            }
            highlightedItem.set(nextItem);
            nextItem?.scrollIntoView({ block: $scrollAlignment });
          } else if (typeahead.get()) {
            const menuEl = document.getElementById(ids.menu.get());
            if (!isHTMLElement(menuEl))
              return;
            handleTypeaheadSearch(e.key, getOptions(menuEl));
          }
        })
      );
      let unsubEscapeKeydown = noop;
      const escape = useEscapeKeydown(node, {
        handler: closeMenu,
        enabled: derived([open, closeOnEscape], ([$open, $closeOnEscape]) => {
          return $open && $closeOnEscape;
        })
      });
      if (escape && escape.destroy) {
        unsubEscapeKeydown = escape.destroy;
      }
      return {
        destroy() {
          unsubscribe();
          unsubEscapeKeydown();
        }
      };
    }
  });
  const menu = makeElement(name2("menu"), {
    stores: [isVisible, ids.menu],
    returned: ([$isVisible, $menuId]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        id: $menuId,
        role: "listbox",
        style: styleToString({ display: $isVisible ? void 0 : "none" })
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubscribe = executeCallbacks(
        // Bind the popper portal to the input element.
        effect([isVisible, portal, closeOnOutsideClick, positioning, activeTrigger], ([$isVisible, $portal, $closeOnOutsideClick, $positioning, $activeTrigger]) => {
          unsubPopper();
          if (!$isVisible || !$activeTrigger)
            return;
          tick().then(() => {
            unsubPopper();
            const ignoreHandler = createClickOutsideIgnore(ids.trigger.get());
            unsubPopper = usePopper(node, {
              anchorElement: $activeTrigger,
              open,
              options: {
                floating: $positioning,
                focusTrap: null,
                modal: {
                  closeOnInteractOutside: $closeOnOutsideClick,
                  onClose: closeMenu,
                  open: $isVisible,
                  shouldCloseOnInteractOutside: (e) => {
                    onOutsideClick.get()?.(e);
                    if (e.defaultPrevented)
                      return false;
                    const target = e.target;
                    if (!isElement(target))
                      return false;
                    if (target === $activeTrigger || $activeTrigger.contains(target)) {
                      return false;
                    }
                    if (ignoreHandler(e))
                      return false;
                    return true;
                  }
                },
                escapeKeydown: null,
                portal: getPortalDestination(node, $portal)
              }
            }).destroy;
          });
        })
      );
      return {
        destroy: () => {
          unsubscribe();
          unsubPopper();
        }
      };
    }
  });
  const { elements: { root: labelBuilder } } = createLabel();
  const { action: labelAction } = get(labelBuilder);
  const label = makeElement(name2("label"), {
    stores: [ids.label, ids.trigger],
    returned: ([$labelId, $triggerId]) => {
      return {
        id: $labelId,
        for: $triggerId
      };
    },
    action: labelAction
  });
  const option = makeElement(name2("option"), {
    stores: [isSelected],
    returned: ([$isSelected]) => (props2) => {
      const selected2 = $isSelected(props2.value);
      return {
        "data-value": JSON.stringify(props2.value),
        "data-label": props2.label,
        "data-disabled": disabledAttr(props2.disabled),
        "aria-disabled": props2.disabled ? true : void 0,
        "aria-selected": selected2,
        "data-selected": selected2 ? "" : void 0,
        id: generateId(),
        role: "option"
      };
    },
    action: (node) => {
      const unsubscribe = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (isElementDisabled(node)) {
          e.preventDefault();
          return;
        }
        selectItem(node);
        if (!multiple.get()) {
          closeMenu();
        }
      }), effect(highlightOnHover, ($highlightOnHover) => {
        if (!$highlightOnHover)
          return;
        const unsub = executeCallbacks(addMeltEventListener(node, "mouseover", () => {
          highlightedItem.set(node);
        }), addMeltEventListener(node, "mouseleave", () => {
          highlightedItem.set(null);
        }));
        return unsub;
      }));
      return { destroy: unsubscribe };
    }
  });
  const group = makeElement(name2("group"), {
    returned: () => {
      return (groupId) => ({
        role: "group",
        "aria-labelledby": groupId
      });
    }
  });
  const groupLabel = makeElement(name2("group-label"), {
    returned: () => {
      return (groupId) => ({
        id: groupId
      });
    }
  });
  const hiddenInput = createHiddenInput({
    value: derived([selected], ([$selected]) => {
      const value = Array.isArray($selected) ? $selected.map((o) => o.value) : $selected?.value;
      return typeof value === "string" ? value : JSON.stringify(value);
    }),
    name: readonly(nameProp),
    required,
    prefix: withDefaults.builder
  });
  const arrow = makeElement(name2("arrow"), {
    stores: arrowSize,
    returned: ($arrowSize) => ({
      "data-arrow": true,
      style: styleToString({
        position: "absolute",
        width: `var(--arrow-size, ${$arrowSize}px)`,
        height: `var(--arrow-size, ${$arrowSize}px)`
      })
    })
  });
  safeOnMount(() => {
    if (!isBrowser)
      return;
    const menuEl = document.getElementById(ids.menu.get());
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl) {
      activeTrigger.set(triggerEl);
    }
    if (!menuEl)
      return;
    const selectedEl = menuEl.querySelector("[data-selected]");
    if (!isHTMLElement(selectedEl))
      return;
  });
  effect([highlightedItem], ([$highlightedItem]) => {
    if (!isBrowser)
      return;
    const menuElement = document.getElementById(ids.menu.get());
    if (!isHTMLElement(menuElement))
      return;
    getOptions(menuElement).forEach((node) => {
      if (node === $highlightedItem) {
        addHighlight(node);
      } else {
        removeHighlight(node);
      }
    });
  });
  effect([open], ([$open]) => {
    if (!isBrowser)
      return;
    let unsubScroll = noop;
    if (preventScroll.get() && $open) {
      unsubScroll = removeScroll();
    }
    return () => {
      unsubScroll();
    };
  });
  return {
    ids,
    elements: {
      trigger,
      group,
      option,
      menu,
      groupLabel,
      label,
      hiddenInput,
      arrow
    },
    states: {
      open,
      selected,
      highlighted,
      highlightedItem
    },
    helpers: {
      isSelected,
      isHighlighted,
      closeMenu
    },
    options
  };
}
function createSelect(props) {
  const listbox = createListbox({ ...props, builder: "select" });
  const selectedLabel = derived(listbox.states.selected, ($selected) => {
    if (Array.isArray($selected)) {
      return $selected.map((o) => o.label).join(", ");
    }
    return $selected?.label ?? "";
  });
  return {
    ...listbox,
    elements: {
      ...listbox.elements
    },
    states: {
      ...listbox.states,
      selectedLabel
    }
  };
}
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
function getSelectData() {
  const NAME = "select";
  const GROUP_NAME = "select-group";
  const ITEM_NAME = "select-item";
  const PARTS = [
    "arrow",
    "content",
    "group",
    "item",
    "indicator",
    "input",
    "label",
    "trigger",
    "value"
  ];
  return {
    NAME,
    GROUP_NAME,
    ITEM_NAME,
    PARTS
  };
}
function getCtx$1() {
  const { NAME } = getSelectData();
  return getContext(NAME);
}
function setCtx$1(props) {
  const { NAME, PARTS } = getSelectData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const select = {
    ...createSelect({ ...removeUndefined(props), forceVisible: true }),
    getAttrs
  };
  setContext(NAME, select);
  return {
    ...select,
    updateOption: getOptionUpdater(select.options)
  };
}
function setItemCtx(value) {
  const { ITEM_NAME } = getSelectData();
  const select = getCtx$1();
  setContext(ITEM_NAME, value);
  return select;
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center",
    sameWidth: true
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx$1();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
function Select($$payload, $$props) {
  push();
  var $$store_subs;
  let required = fallback($$props["required"], () => void 0, true);
  let disabled = fallback($$props["disabled"], () => void 0, true);
  let preventScroll = fallback($$props["preventScroll"], () => void 0, true);
  let loop = fallback($$props["loop"], () => void 0, true);
  let closeOnEscape = fallback($$props["closeOnEscape"], () => void 0, true);
  let closeOnOutsideClick = fallback($$props["closeOnOutsideClick"], () => void 0, true);
  let portal = fallback($$props["portal"], () => void 0, true);
  let name2 = fallback($$props["name"], () => void 0, true);
  let multiple = fallback($$props["multiple"], false);
  let selected = fallback($$props["selected"], () => void 0, true);
  let onSelectedChange = fallback($$props["onSelectedChange"], () => void 0, true);
  let open = fallback($$props["open"], () => void 0, true);
  let onOpenChange = fallback($$props["onOpenChange"], () => void 0, true);
  let items = fallback($$props["items"], () => [], true);
  let onOutsideClick = fallback($$props["onOutsideClick"], () => void 0, true);
  let typeahead = fallback($$props["typeahead"], () => void 0, true);
  const {
    states: { open: localOpen, selected: localSelected },
    updateOption,
    ids
  } = setCtx$1({
    required,
    disabled,
    preventScroll,
    loop,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    name: name2,
    onOutsideClick,
    multiple,
    forceVisible: true,
    defaultSelected: Array.isArray(selected) ? [...selected] : selected,
    defaultOpen: open,
    onSelectedChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(selected) || !arraysAreEqual(selected, next2)) {
          onSelectedChange?.(next2);
          selected = next2;
          return next2;
        }
        return next2;
      }
      if (selected !== next2) {
        onSelectedChange?.(next2);
        selected = next2;
      }
      return next2;
    },
    onOpenChange: ({ next: next2 }) => {
      if (open !== next2) {
        onOpenChange?.(next2);
        open = next2;
      }
      return next2;
    },
    items,
    typeahead
  });
  const idValues = derived([ids.menu, ids.trigger, ids.label], ([$menuId, $triggerId, $labelId]) => ({
    menu: $menuId,
    trigger: $triggerId,
    label: $labelId
  }));
  open !== void 0 && localOpen.set(open);
  selected !== void 0 && localSelected.set(Array.isArray(selected) ? [...selected] : selected);
  updateOption("required", required);
  updateOption("disabled", disabled);
  updateOption("preventScroll", preventScroll);
  updateOption("loop", loop);
  updateOption("closeOnEscape", closeOnEscape);
  updateOption("closeOnOutsideClick", closeOnOutsideClick);
  updateOption("portal", portal);
  updateOption("name", name2);
  updateOption("multiple", multiple);
  updateOption("onOutsideClick", onOutsideClick);
  updateOption("typeahead", typeahead);
  $$payload.out += `<!---->`;
  slot(
    $$payload,
    $$props,
    "default",
    {
      ids: store_get($$store_subs ??= {}, "$idValues", idValues)
    },
    null
  );
  $$payload.out += `<!---->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, {
    required,
    disabled,
    preventScroll,
    loop,
    closeOnEscape,
    closeOnOutsideClick,
    portal,
    name: name2,
    multiple,
    selected,
    onSelectedChange,
    open,
    onOpenChange,
    items,
    onOutsideClick,
    typeahead
  });
  pop();
}
function Select_content($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "transition",
    "transitionConfig",
    "inTransition",
    "inTransitionConfig",
    "outTransition",
    "outTransitionConfig",
    "asChild",
    "id",
    "side",
    "align",
    "sideOffset",
    "alignOffset",
    "collisionPadding",
    "avoidCollisions",
    "collisionBoundary",
    "sameWidth",
    "fitViewport",
    "strategy",
    "overlap",
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
  let id = fallback($$props["id"], () => void 0, true);
  let side = fallback($$props["side"], "bottom");
  let align = fallback($$props["align"], "center");
  let sideOffset = fallback($$props["sideOffset"], 0);
  let alignOffset = fallback($$props["alignOffset"], 0);
  let collisionPadding = fallback($$props["collisionPadding"], 8);
  let avoidCollisions = fallback($$props["avoidCollisions"], true);
  let collisionBoundary = fallback($$props["collisionBoundary"], () => void 0, true);
  let sameWidth = fallback($$props["sameWidth"], true);
  let fitViewport = fallback($$props["fitViewport"], false);
  let strategy = fallback($$props["strategy"], "absolute");
  let overlap = fallback($$props["overlap"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { menu },
    states: { open },
    ids,
    getAttrs
  } = getCtx$1();
  const attrs = getAttrs("content");
  if (id) {
    ids.menu.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$menu", menu);
  Object.assign(builder, attrs);
  if (store_get($$store_subs ??= {}, "$open", open)) {
    updatePositioning({
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding,
      avoidCollisions,
      collisionBoundary,
      sameWidth,
      fitViewport,
      strategy,
      overlap
    });
  }
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
    id,
    side,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    avoidCollisions,
    collisionBoundary,
    sameWidth,
    fitViewport,
    strategy,
    overlap,
    el
  });
  pop();
}
function Select_item($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "value",
    "disabled",
    "label",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder, isSelected;
  let value = $$props["value"];
  let disabled = fallback($$props["disabled"], () => void 0, true);
  let label = fallback($$props["label"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { option: item },
    helpers: { isSelected: isSelectedStore },
    getAttrs
  } = setItemCtx(value);
  const attrs = getAttrs("item");
  builder = store_get($$store_subs ??= {}, "$item", item)({ value, disabled, label });
  Object.assign(builder, attrs);
  isSelected = store_get($$store_subs ??= {}, "$isSelectedStore", isSelectedStore)(value);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder, isSelected }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder, isSelected }, () => {
      $$payload.out += `${escape_html(label || value)}`;
    });
    $$payload.out += `<!----></div>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { value, disabled, label, asChild, el });
  pop();
}
function Select_trigger($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["asChild", "id", "el"]);
  push();
  var $$store_subs;
  let builder;
  let asChild = fallback($$props["asChild"], false);
  let id = fallback($$props["id"], () => void 0, true);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { trigger }, ids, getAttrs } = getCtx$1();
  const attrs = getAttrs("trigger");
  if (id) {
    ids.trigger.set(id);
  }
  builder = store_get($$store_subs ??= {}, "$trigger", trigger);
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
  bind_props($$props, { asChild, id, el });
  pop();
}
function Select_value($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["placeholder", "asChild", "el"]);
  push();
  var $$store_subs;
  let label;
  let placeholder = fallback($$props["placeholder"], "");
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { states: { selectedLabel }, getAttrs } = getCtx$1();
  const attrs = getAttrs("value");
  label = store_get($$store_subs ??= {}, "$selectedLabel", selectedLabel);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { label, attrs }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<span${spread_attributes(
      {
        ...$$restProps,
        ...attrs,
        "data-placeholder": !label ? "" : void 0
      }
    )}>${escape_html(label || placeholder)}</span>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { placeholder, asChild, el });
  pop();
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
function Toolbar($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["loop", "orientation", "asChild", "el"]);
  push();
  var $$store_subs;
  let builder;
  let loop = fallback($$props["loop"], true);
  let orientation = fallback($$props["orientation"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { root }, updateOption, getAttrs } = setCtx({ loop, orientation });
  const attrs = getAttrs("root");
  updateOption("loop", loop);
  updateOption("orientation", orientation);
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
  bind_props($$props, { loop, orientation, asChild, el });
  pop();
}
function Toolbar_group($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, [
    "type",
    "disabled",
    "value",
    "onValueChange",
    "asChild",
    "el"
  ]);
  push();
  var $$store_subs;
  let builder;
  let type = fallback($$props["type"], "single");
  let disabled = fallback($$props["disabled"], () => void 0, true);
  let value = fallback($$props["value"], () => void 0, true);
  let onValueChange = fallback($$props["onValueChange"], () => void 0, true);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const {
    elements: { group },
    states: { value: localValue },
    updateOption,
    getAttrs
  } = setGroupCtx({
    disabled,
    type,
    defaultValue: value,
    onValueChange: ({ next: next2 }) => {
      if (Array.isArray(next2)) {
        if (!Array.isArray(value) || !arraysAreEqual(value, next2)) {
          onValueChange?.(next2);
          value = next2;
          return next2;
        }
        return next2;
      }
      if (value !== next2) {
        onValueChange?.(next2);
        value = next2;
      }
      return next2;
    }
  });
  const attrs = getAttrs("group");
  value !== void 0 && localValue.set(Array.isArray(value) ? [...value] : value);
  updateOption("disabled", disabled);
  updateOption("type", type);
  builder = store_get($$store_subs ??= {}, "$group", group);
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
  bind_props($$props, {
    type,
    disabled,
    value,
    onValueChange,
    asChild,
    el
  });
  pop();
}
function Toolbar_group_item($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const $$restProps = rest_props($$sanitized_props, ["value", "disabled", "asChild", "el"]);
  push();
  var $$store_subs;
  let attrs, builder;
  let value = $$props["value"];
  let disabled = fallback($$props["disabled"], false);
  let asChild = fallback($$props["asChild"], false);
  let el = fallback($$props["el"], () => void 0, true);
  const { elements: { item }, getAttrs } = getGroupCtx();
  attrs = {
    ...getAttrs("group-item"),
    ...disabledAttrs(disabled)
  };
  builder = store_get($$store_subs ??= {}, "$item", item)({ value, disabled });
  Object.assign(builder, attrs);
  if (asChild) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<button${spread_attributes({ ...builder, ...$$restProps })}><!---->`;
    slot($$payload, $$props, "default", { builder }, null);
    $$payload.out += `<!----></button>`;
  }
  $$payload.out += `<!--]-->`;
  if ($$store_subs) unsubscribe_stores($$store_subs);
  bind_props($$props, { value, disabled, asChild, el });
  pop();
}
function Layout_grid($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
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
  Icon($$payload, spread_props([
    { name: "layout-grid" },
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
function Align_justify($$payload, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "line",
      { "x1": "3", "x2": "21", "y1": "6", "y2": "6" }
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
  Icon($$payload, spread_props([
    { name: "align-justify" },
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
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  let {
    sessionUserId,
    collectionId,
    collectionInfo,
    collectionContents,
    viewPermission,
    editPermission,
    followData,
    infoBoxText
  } = data;
  const collectionType = collectionInfo?.type;
  const collectionStatus = collectionInfo?.status;
  const collectionUpdatedAt = collectionInfo?.updated_at;
  let gridListSelect = "grid";
  let selected = void 0;
  const updatedAt = new Date(collectionUpdatedAt).toLocaleDateString();
  const sortOptions = [
    "default",
    "reverse",
    "artist A --> Z",
    "artist Z --> A"
  ];
  selected?.value ?? collectionInfo.default_view_sort ?? "default";
  let sortedItems = void 0;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>
		${escape_html(collectionInfo?.title)}
	</title>`;
    });
    $$payload2.out += `<div class="two-column"><div class="collection-container"><div class="collection-info"><div class="collection-info-row"><h1>${escape_html(collectionInfo?.title)}</h1> <div class="buttons-group">`;
    if (sessionUserId && sessionUserId != collectionInfo?.owner_id) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<form method="POST" action="?/followCollection"><input type="hidden" name="collection-id" id="collection-id"${attr("value", collectionId)}> <button class="standard" formaction="?/followCollection">`;
      if (followData && followData["follows_now"] == true) {
        $$payload2.out += "<!--[-->";
        $$payload2.out += `unfollow`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `+ follow`;
      }
      $$payload2.out += `<!--]--></button></form>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--> `;
    if (sessionUserId && editPermission) {
      $$payload2.out += "<!--[-->";
      $$payload2.out += `<button class="standard">edit</button>`;
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div></div> <div class="collection-info-row"><div class="collection-info-attribution"><p class="collection-info-text">Collection by <a${attr("href", `/user/${stringify(collectionInfo?.username)}`)}>${escape_html(collectionInfo?.display_name)}</a></p> <p class="collection-date-text">Last updated on ${escape_html(updatedAt)}</p></div> `;
    if (collectionInfo?.status != "public") {
      $$payload2.out += "<!--[-->";
      InfoBox($$payload2, {
        mode: "inline",
        children: ($$payload3) => {
          $$payload3.out += `<!---->${escape_html(infoBoxText[collectionStatus])}`;
        }
      });
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]--></div> <div class="collection-description-text">`;
    InlineMarkdownText($$payload2, { text: collectionInfo?.description_text });
    $$payload2.out += `<!----></div></div> <div class="sort"><div class="sort-column"><!---->`;
    Select($$payload2, {
      get selected() {
        return selected;
      },
      set selected($$value) {
        selected = $$value;
        $$settled = false;
      },
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Select_trigger($$payload3, {
          class: "sort-options",
          children: ($$payload4) => {
            $$payload4.out += `<span class="trigger-label"><!---->`;
            Select_value($$payload4, { placeholder: "sort order" });
            $$payload4.out += `<!----></span> <span class="chevron">`;
            Chevron_down($$payload4, { size: 16 });
            $$payload4.out += `<!----></span>`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!----> <!---->`;
        Select_content($$payload3, {
          children: ($$payload4) => {
            const each_array = ensure_array_like(sortOptions);
            $$payload4.out += `<!--[-->`;
            for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
              let option = each_array[$$index];
              $$payload4.out += `<!---->`;
              Select_item($$payload4, {
                value: option,
                label: option,
                children: ($$payload5) => {
                  $$payload5.out += `<!---->${escape_html(option)}`;
                },
                $$slots: { default: true }
              });
              $$payload4.out += `<!---->`;
            }
            $$payload4.out += `<!--]-->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----></div> <div class="sort-column"><!---->`;
    Toolbar($$payload2, {
      children: ($$payload3) => {
        $$payload3.out += `<!---->`;
        Toolbar_group($$payload3, {
          type: "single",
          get value() {
            return gridListSelect;
          },
          set value($$value) {
            gridListSelect = $$value;
            $$settled = false;
          },
          children: ($$payload4) => {
            $$payload4.out += `<!---->`;
            Toolbar_group_item($$payload4, {
              "aria-label": "grid",
              value: "grid",
              children: ($$payload5) => {
                $$payload5.out += `<div class="toolbar-icon">`;
                Layout_grid($$payload5, { size: 20 });
                $$payload5.out += `<!----></div>`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!----> <!---->`;
            Toolbar_group_item($$payload4, {
              "aria-label": "list",
              value: "list",
              children: ($$payload5) => {
                $$payload5.out += `<div class="toolbar-icon">`;
                Align_justify($$payload5, { size: 20 });
                $$payload5.out += `<!----></div>`;
              },
              $$slots: { default: true }
            });
            $$payload4.out += `<!---->`;
          },
          $$slots: { default: true }
        });
        $$payload3.out += `<!---->`;
      },
      $$slots: { default: true }
    });
    $$payload2.out += `<!----> <span>view mode: ${escape_html(gridListSelect)}</span></div></div> `;
    GridList($$payload2, {
      collectionContents: sortedItems,
      collectionReturned: viewPermission,
      collectionType,
      collectionStatus,
      layout: gridListSelect,
      mode: "view"
    });
    $$payload2.out += `<!----></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};

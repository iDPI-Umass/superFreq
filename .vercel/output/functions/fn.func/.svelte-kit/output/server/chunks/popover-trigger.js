import { s as subscribe, c as compute_rest_props } from "./utils.js";
import { s as setContext, g as getContext, c as create_ssr_component, a as spread, b as escape_object, d as add_attribute } from "./ssr.js";
import { w as writable, d as derived } from "./index2.js";
import "dequal";
import { t as toWritableStores, q as omit, o as overridable, w as withGet, f as safeOnMount, m as makeElement, h as isBrowser, s as styleToString, p as portalAttr, e as effect, a as executeCallbacks, b as addMeltEventListener, u as useEscapeKeydown, j as createElHelpers, B as isElement, k as kbd, n as noop, i as isHTMLElement, r as createBitAttrs, v as removeUndefined, x as getOptionUpdater, y as createDispatcher } from "./updater.js";
import { g as generateIds, d as derivedVisible, t as tick, u as usePopper, a as getPortalDestination, b as usePortal, r as removeScroll, h as handleFocus, c as getPositioningUpdater } from "./helpers.js";
const defaults = {
  positioning: {
    placement: "bottom"
  },
  arrowSize: 8,
  defaultOpen: false,
  disableFocusTrap: false,
  closeOnEscape: true,
  preventScroll: false,
  onOpenChange: void 0,
  closeOnOutsideClick: true,
  portal: void 0,
  forceVisible: false,
  openFocus: void 0,
  closeFocus: void 0,
  onOutsideClick: void 0
};
const { name } = createElHelpers("popover");
const popoverIdParts = ["trigger", "content"];
function createPopover(args) {
  const withDefaults = { ...defaults, ...args };
  const options = toWritableStores(omit(withDefaults, "open", "ids"));
  const { positioning, arrowSize, disableFocusTrap, preventScroll, closeOnEscape, closeOnOutsideClick, portal, forceVisible, openFocus, closeFocus, onOutsideClick } = options;
  const openWritable = withDefaults.open ?? writable(withDefaults.defaultOpen);
  const open = overridable(openWritable, withDefaults?.onOpenChange);
  const activeTrigger = withGet.writable(null);
  const ids = toWritableStores({ ...generateIds(popoverIdParts), ...withDefaults.ids });
  safeOnMount(() => {
    activeTrigger.set(document.getElementById(ids.trigger.get()));
  });
  function handleClose() {
    open.set(false);
    const triggerEl = document.getElementById(ids.trigger.get());
    handleFocus({ prop: closeFocus.get(), defaultEl: triggerEl });
  }
  const isVisible = derivedVisible({ open, activeTrigger, forceVisible });
  const content = makeElement(name("content"), {
    stores: [isVisible, portal, ids.content],
    returned: ([$isVisible, $portal, $contentId]) => {
      return {
        hidden: $isVisible && isBrowser ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        id: $contentId,
        "data-state": $isVisible ? "open" : "closed",
        "data-portal": portalAttr($portal)
      };
    },
    action: (node) => {
      let unsubPopper = noop;
      const unsubDerived = effect([
        isVisible,
        activeTrigger,
        positioning,
        disableFocusTrap,
        closeOnEscape,
        closeOnOutsideClick,
        portal
      ], ([$isVisible, $activeTrigger, $positioning, $disableFocusTrap, $closeOnEscape, $closeOnOutsideClick, $portal]) => {
        unsubPopper();
        if (!$isVisible || !$activeTrigger)
          return;
        tick().then(() => {
          unsubPopper();
          unsubPopper = usePopper(node, {
            anchorElement: $activeTrigger,
            open,
            options: {
              floating: $positioning,
              focusTrap: $disableFocusTrap ? null : {
                returnFocusOnDeactivate: false,
                clickOutsideDeactivates: $closeOnOutsideClick,
                allowOutsideClick: true,
                escapeDeactivates: $closeOnEscape
              },
              modal: {
                shouldCloseOnInteractOutside,
                onClose: handleClose,
                open: $isVisible,
                closeOnInteractOutside: $closeOnOutsideClick
              },
              escapeKeydown: $closeOnEscape ? {
                handler: () => {
                  handleClose();
                }
              } : null,
              portal: getPortalDestination(node, $portal)
            }
          }).destroy;
        });
      });
      return {
        destroy() {
          unsubDerived();
          unsubPopper();
        }
      };
    }
  });
  function toggleOpen(triggerEl) {
    open.update((prev) => {
      return !prev;
    });
    if (triggerEl && triggerEl !== activeTrigger.get()) {
      activeTrigger.set(triggerEl);
    }
  }
  function shouldCloseOnInteractOutside(e) {
    onOutsideClick.get()?.(e);
    if (e.defaultPrevented)
      return false;
    const target = e.target;
    const triggerEl = document.getElementById(ids.trigger.get());
    if (triggerEl && isElement(target)) {
      if (target === triggerEl || triggerEl.contains(target))
        return false;
    }
    return true;
  }
  const trigger = makeElement(name("trigger"), {
    stores: [isVisible, ids.content, ids.trigger],
    returned: ([$isVisible, $contentId, $triggerId]) => {
      return {
        role: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": $isVisible ? "true" : "false",
        "data-state": stateAttr($isVisible),
        "aria-controls": $contentId,
        id: $triggerId
      };
    },
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", () => {
        toggleOpen(node);
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleOpen(node);
      }));
      return {
        destroy: unsub
      };
    }
  });
  const overlay = makeElement(name("overlay"), {
    stores: [isVisible],
    returned: ([$isVisible]) => {
      return {
        hidden: $isVisible ? void 0 : true,
        tabindex: -1,
        style: styleToString({
          display: $isVisible ? void 0 : "none"
        }),
        "aria-hidden": "true",
        "data-state": stateAttr($isVisible)
      };
    },
    action: (node) => {
      let unsubEscapeKeydown = noop;
      let unsubDerived = noop;
      let unsubPortal = noop;
      if (closeOnEscape.get()) {
        const escapeKeydown = useEscapeKeydown(node, {
          handler: () => {
            handleClose();
          }
        });
        if (escapeKeydown && escapeKeydown.destroy) {
          unsubEscapeKeydown = escapeKeydown.destroy;
        }
      }
      unsubDerived = effect([portal], ([$portal]) => {
        unsubPortal();
        if ($portal === null)
          return;
        const portalDestination = getPortalDestination(node, $portal);
        if (portalDestination === null)
          return;
        unsubPortal = usePortal(node, portalDestination).destroy;
      });
      return {
        destroy() {
          unsubEscapeKeydown();
          unsubDerived();
          unsubPortal();
        }
      };
    }
  });
  const arrow = makeElement(name("arrow"), {
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
  const close = makeElement(name("close"), {
    returned: () => ({
      type: "button"
    }),
    action: (node) => {
      const unsub = executeCallbacks(addMeltEventListener(node, "click", (e) => {
        if (e.defaultPrevented)
          return;
        handleClose();
      }), addMeltEventListener(node, "keydown", (e) => {
        if (e.defaultPrevented)
          return;
        if (e.key !== kbd.ENTER && e.key !== kbd.SPACE)
          return;
        e.preventDefault();
        toggleOpen();
      }));
      return {
        destroy: unsub
      };
    }
  });
  effect([open, activeTrigger, preventScroll], ([$open, $activeTrigger, $preventScroll]) => {
    if (!isBrowser)
      return;
    const unsubs = [];
    if ($open) {
      if (!$activeTrigger) {
        tick().then(() => {
          const triggerEl2 = document.getElementById(ids.trigger.get());
          if (!isHTMLElement(triggerEl2))
            return;
          activeTrigger.set(triggerEl2);
        });
      }
      if ($preventScroll) {
        unsubs.push(removeScroll());
      }
      const triggerEl = $activeTrigger ?? document.getElementById(ids.trigger.get());
      handleFocus({ prop: openFocus.get(), defaultEl: triggerEl });
    }
    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  });
  return {
    ids,
    elements: {
      trigger,
      content,
      arrow,
      close,
      overlay
    },
    states: {
      open
    },
    options
  };
}
function stateAttr(open) {
  return open ? "open" : "closed";
}
function getPopoverData() {
  const NAME = "popover";
  const PARTS = ["arrow", "close", "content", "trigger"];
  return {
    NAME,
    PARTS
  };
}
function setCtx(props) {
  const { NAME, PARTS } = getPopoverData();
  const getAttrs = createBitAttrs(NAME, PARTS);
  const popover = {
    ...createPopover({
      positioning: {
        placement: "bottom",
        gutter: 0
      },
      ...removeUndefined(props),
      forceVisible: true
    }),
    getAttrs
  };
  setContext(NAME, popover);
  return {
    ...popover,
    updateOption: getOptionUpdater(popover.options)
  };
}
function getCtx() {
  const { NAME } = getPopoverData();
  return getContext(NAME);
}
function updatePositioning(props) {
  const defaultPlacement = {
    side: "bottom",
    align: "center"
  };
  const withDefaults = { ...defaultPlacement, ...props };
  const { options: { positioning } } = getCtx();
  const updater = getPositioningUpdater(positioning);
  updater(withDefaults);
}
const Popover = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $idValues, $$unsubscribe_idValues;
  let { disableFocusTrap = void 0 } = $$props;
  let { closeOnEscape = void 0 } = $$props;
  let { closeOnOutsideClick = void 0 } = $$props;
  let { preventScroll = void 0 } = $$props;
  let { portal = void 0 } = $$props;
  let { open = void 0 } = $$props;
  let { onOpenChange = void 0 } = $$props;
  let { openFocus = void 0 } = $$props;
  let { closeFocus = void 0 } = $$props;
  let { onOutsideClick = void 0 } = $$props;
  const { updateOption, states: { open: localOpen }, ids } = setCtx({
    disableFocusTrap,
    closeOnEscape,
    closeOnOutsideClick,
    preventScroll,
    portal,
    defaultOpen: open,
    openFocus,
    closeFocus,
    onOutsideClick,
    onOpenChange: ({ next }) => {
      if (open !== next) {
        onOpenChange?.(next);
        open = next;
      }
      return next;
    },
    positioning: { gutter: 0, offset: { mainAxis: 1 } }
  });
  const idValues = derived([ids.content, ids.trigger], ([$contentId, $triggerId]) => ({ content: $contentId, trigger: $triggerId }));
  $$unsubscribe_idValues = subscribe(idValues, (value) => $idValues = value);
  if ($$props.disableFocusTrap === void 0 && $$bindings.disableFocusTrap && disableFocusTrap !== void 0) $$bindings.disableFocusTrap(disableFocusTrap);
  if ($$props.closeOnEscape === void 0 && $$bindings.closeOnEscape && closeOnEscape !== void 0) $$bindings.closeOnEscape(closeOnEscape);
  if ($$props.closeOnOutsideClick === void 0 && $$bindings.closeOnOutsideClick && closeOnOutsideClick !== void 0) $$bindings.closeOnOutsideClick(closeOnOutsideClick);
  if ($$props.preventScroll === void 0 && $$bindings.preventScroll && preventScroll !== void 0) $$bindings.preventScroll(preventScroll);
  if ($$props.portal === void 0 && $$bindings.portal && portal !== void 0) $$bindings.portal(portal);
  if ($$props.open === void 0 && $$bindings.open && open !== void 0) $$bindings.open(open);
  if ($$props.onOpenChange === void 0 && $$bindings.onOpenChange && onOpenChange !== void 0) $$bindings.onOpenChange(onOpenChange);
  if ($$props.openFocus === void 0 && $$bindings.openFocus && openFocus !== void 0) $$bindings.openFocus(openFocus);
  if ($$props.closeFocus === void 0 && $$bindings.closeFocus && closeFocus !== void 0) $$bindings.closeFocus(closeFocus);
  if ($$props.onOutsideClick === void 0 && $$bindings.onOutsideClick && onOutsideClick !== void 0) $$bindings.onOutsideClick(onOutsideClick);
  open !== void 0 && localOpen.set(open);
  {
    updateOption("disableFocusTrap", disableFocusTrap);
  }
  {
    updateOption("closeOnEscape", closeOnEscape);
  }
  {
    updateOption("closeOnOutsideClick", closeOnOutsideClick);
  }
  {
    updateOption("preventScroll", preventScroll);
  }
  {
    updateOption("portal", portal);
  }
  {
    updateOption("openFocus", openFocus);
  }
  {
    updateOption("closeFocus", closeFocus);
  }
  {
    updateOption("onOutsideClick", onOutsideClick);
  }
  $$unsubscribe_idValues();
  return `${slots.default ? slots.default({ ids: $idValues }) : ``}`;
});
const Popover_content = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let builder;
  let $$restProps = compute_rest_props($$props, [
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
  let $open, $$unsubscribe_open;
  let $content, $$unsubscribe_content;
  let { transition = void 0 } = $$props;
  let { transitionConfig = void 0 } = $$props;
  let { inTransition = void 0 } = $$props;
  let { inTransitionConfig = void 0 } = $$props;
  let { outTransition = void 0 } = $$props;
  let { outTransitionConfig = void 0 } = $$props;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { side = "bottom" } = $$props;
  let { align = "center" } = $$props;
  let { sideOffset = 0 } = $$props;
  let { alignOffset = 0 } = $$props;
  let { collisionPadding = 8 } = $$props;
  let { avoidCollisions = true } = $$props;
  let { collisionBoundary = void 0 } = $$props;
  let { sameWidth = false } = $$props;
  let { fitViewport = false } = $$props;
  let { strategy = "absolute" } = $$props;
  let { overlap = false } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { content }, states: { open }, ids, getAttrs } = getCtx();
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
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.side === void 0 && $$bindings.side && side !== void 0) $$bindings.side(side);
  if ($$props.align === void 0 && $$bindings.align && align !== void 0) $$bindings.align(align);
  if ($$props.sideOffset === void 0 && $$bindings.sideOffset && sideOffset !== void 0) $$bindings.sideOffset(sideOffset);
  if ($$props.alignOffset === void 0 && $$bindings.alignOffset && alignOffset !== void 0) $$bindings.alignOffset(alignOffset);
  if ($$props.collisionPadding === void 0 && $$bindings.collisionPadding && collisionPadding !== void 0) $$bindings.collisionPadding(collisionPadding);
  if ($$props.avoidCollisions === void 0 && $$bindings.avoidCollisions && avoidCollisions !== void 0) $$bindings.avoidCollisions(avoidCollisions);
  if ($$props.collisionBoundary === void 0 && $$bindings.collisionBoundary && collisionBoundary !== void 0) $$bindings.collisionBoundary(collisionBoundary);
  if ($$props.sameWidth === void 0 && $$bindings.sameWidth && sameWidth !== void 0) $$bindings.sameWidth(sameWidth);
  if ($$props.fitViewport === void 0 && $$bindings.fitViewport && fitViewport !== void 0) $$bindings.fitViewport(fitViewport);
  if ($$props.strategy === void 0 && $$bindings.strategy && strategy !== void 0) $$bindings.strategy(strategy);
  if ($$props.overlap === void 0 && $$bindings.overlap && overlap !== void 0) $$bindings.overlap(overlap);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.content.set(id);
    }
  }
  builder = $content;
  {
    Object.assign(builder, attrs);
  }
  {
    if ($open) {
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
  }
  $$unsubscribe_open();
  $$unsubscribe_content();
  return `${asChild && $open ? `${slots.default ? slots.default({ builder }) : ``}` : `${transition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${inTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${outTransition && $open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : `${$open ? `<div${spread([escape_object(builder), escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</div>` : ``}`}`}`}`}`}`;
});
const Popover_trigger = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let attrs;
  let builder;
  let $$restProps = compute_rest_props($$props, ["asChild", "id", "el"]);
  let $trigger, $$unsubscribe_trigger;
  let $open, $$unsubscribe_open;
  let { asChild = false } = $$props;
  let { id = void 0 } = $$props;
  let { el = void 0 } = $$props;
  const { elements: { trigger }, states: { open }, ids, getAttrs } = getCtx();
  $$unsubscribe_trigger = subscribe(trigger, (value) => $trigger = value);
  $$unsubscribe_open = subscribe(open, (value) => $open = value);
  createDispatcher();
  const bitsAttrs = getAttrs("trigger");
  if ($$props.asChild === void 0 && $$bindings.asChild && asChild !== void 0) $$bindings.asChild(asChild);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0) $$bindings.id(id);
  if ($$props.el === void 0 && $$bindings.el && el !== void 0) $$bindings.el(el);
  {
    if (id) {
      ids.trigger.set(id);
    }
  }
  attrs = {
    ...bitsAttrs,
    "aria-controls": $open ? ids.content : void 0
  };
  builder = $trigger;
  {
    Object.assign(builder, attrs);
  }
  $$unsubscribe_trigger();
  $$unsubscribe_open();
  return `${asChild ? `${slots.default ? slots.default({ builder }) : ``}` : `<button${spread([escape_object(builder), { type: "button" }, escape_object($$restProps)], {})}${add_attribute("this", el, 0)}>${slots.default ? slots.default({ builder }) : ``}</button>`}`;
});
export {
  Popover as P,
  Popover_trigger as a,
  Popover_content as b
};

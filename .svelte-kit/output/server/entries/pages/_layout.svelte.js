import "clsx";
import { o as once, b as push, k as spread_attributes, j as bind_props, p as pop, c as copy_payload, a as assign_payload, m as spread_props, e as escape_html, d as ensure_array_like, f as attr, h as head } from "../../chunks/index2.js";
import "../../chunks/client.js";
import { C as CoverArt } from "../../chunks/CoverArt.js";
import { c as ARROW_DOWN, I as PAGE_UP, H as HOME, A as ARROW_UP, J as PAGE_DOWN, E as END, e as ENTER, S as SPACE, w as watch, Q as executeCallbacks, R as isHTMLElement, f as isElement, U as getDocument, V as FocusScopeContext, C as Context, d as box, u as useRefById, g as getDataOpenClosed, p as getDataDisabled, h as getAriaExpanded, W as CustomEventDispatcher, q as afterTick, T as TAB, X as focusFirst, Y as isElementOrSVGElement, v as getAriaOrientation, Z as getAriaDisabled, m as mergeProps, j as useId, n as noop, o as Floating_layer, P as Popper_layer_force_mount, k as Popper_layer, l as getFloatingContentCSSVars, F as Floating_layer_anchor } from "../../chunks/popper-layer-force-mount.js";
import "style-to-object";
import { b as boxAutoReset, u as useDOMTypeahead, M as Mounted, C as Chevron_down } from "../../chunks/chevron-down.js";
import { u as useRovingFocus } from "../../chunks/use-roving-focus.svelte.js";
import { G as on } from "../../chunks/events.js";
import { isTabbable, tabbable, isFocusable, focusable } from "tabbable";
import { l as logo } from "../../chunks/freq-logo-dark.js";
import "../../chunks/parseData.js";
/* empty css                                                  */
const SELECTION_KEYS = [ENTER, SPACE];
const FIRST_KEYS = [ARROW_DOWN, PAGE_UP, HOME];
const LAST_KEYS = [ARROW_UP, PAGE_DOWN, END];
const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
function isMouseEvent(event) {
  return event.pointerType === "mouse";
}
function useGraceArea(opts) {
  const enabled = opts.enabled();
  const isPointerInTransit = boxAutoReset(false, 300, (value) => {
    if (enabled) {
      opts.setIsPointerInTransit?.(value);
    }
  });
  let pointerGraceArea = null;
  function handleRemoveGraceArea() {
    pointerGraceArea = null;
    isPointerInTransit.current = false;
  }
  function handleCreateGraceArea(e, hoverTarget) {
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(currentTarget)) return;
    const exitPoint = { x: e.clientX, y: e.clientY };
    const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
    const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
    const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
    const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
    pointerGraceArea = graceArea;
    isPointerInTransit.current = true;
  }
  watch(
    [
      opts.triggerNode,
      opts.contentNode,
      opts.enabled
    ],
    ([triggerNode, contentNode, enabled2]) => {
      if (!triggerNode || !contentNode || !enabled2) return;
      const handleTriggerLeave = (e) => {
        handleCreateGraceArea(e, contentNode);
      };
      const handleContentLeave = (e) => {
        handleCreateGraceArea(e, triggerNode);
      };
      return executeCallbacks(on(triggerNode, "pointerleave", handleTriggerLeave), on(contentNode, "pointerleave", handleContentLeave));
    }
  );
  watch(() => pointerGraceArea, () => {
    const handleTrackPointerGrace = (e) => {
      if (!pointerGraceArea) return;
      const target = e.target;
      if (!isElement(target)) return;
      const pointerPosition = { x: e.clientX, y: e.clientY };
      const hasEnteredTarget = opts.triggerNode()?.contains(target) || opts.contentNode()?.contains(target);
      const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
      if (hasEnteredTarget) {
        handleRemoveGraceArea();
      } else if (isPointerOutsideGraceArea) {
        handleRemoveGraceArea();
        opts.onPointerExit();
      }
    };
    return on(document, "pointermove", handleTrackPointerGrace);
  });
  return { isPointerInTransit };
}
function getExitSideFromRect(point, rect) {
  const top = Math.abs(rect.top - point.y);
  const bottom = Math.abs(rect.bottom - point.y);
  const right = Math.abs(rect.right - point.x);
  const left = Math.abs(rect.left - point.x);
  switch (Math.min(top, bottom, right, left)) {
    case left:
      return "left";
    case right:
      return "right";
    case top:
      return "top";
    case bottom:
      return "bottom";
    default:
      throw new Error("unreachable");
  }
}
function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
  const tipPadding = padding * 1.5;
  switch (exitSide) {
    case "top":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y + padding
        },
        { x: exitPoint.x, y: exitPoint.y - tipPadding },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y + padding
        }
      ];
    case "bottom":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x, y: exitPoint.y + tipPadding },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y - padding
        }
      ];
    case "left":
      return [
        {
          x: exitPoint.x + padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x - tipPadding, y: exitPoint.y },
        {
          x: exitPoint.x + padding,
          y: exitPoint.y + padding
        }
      ];
    case "right":
      return [
        {
          x: exitPoint.x - padding,
          y: exitPoint.y - padding
        },
        { x: exitPoint.x + tipPadding, y: exitPoint.y },
        {
          x: exitPoint.x - padding,
          y: exitPoint.y + padding
        }
      ];
  }
}
function getPointsFromRect(rect) {
  const { top, right, bottom, left } = rect;
  return [
    { x: left, y: top },
    { x: right, y: top },
    { x: right, y: bottom },
    { x: left, y: bottom }
  ];
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function getHull(points) {
  const newPoints = points.slice();
  newPoints.sort((a, b) => {
    if (a.x < b.x) return -1;
    else if (a.x > b.x) return 1;
    else if (a.y < b.y) return -1;
    else if (a.y > b.y) return 1;
    else return 0;
  });
  return getHullPresorted(newPoints);
}
function getHullPresorted(points) {
  if (points.length <= 1) return points.slice();
  const upperHull = [];
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    while (upperHull.length >= 2) {
      const q = upperHull[upperHull.length - 1];
      const r = upperHull[upperHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) upperHull.pop();
      else break;
    }
    upperHull.push(p);
  }
  upperHull.pop();
  const lowerHull = [];
  for (let i = points.length - 1; i >= 0; i--) {
    const p = points[i];
    while (lowerHull.length >= 2) {
      const q = lowerHull[lowerHull.length - 1];
      const r = lowerHull[lowerHull.length - 2];
      if ((q.x - r.x) * (p.y - r.y) >= (q.y - r.y) * (p.x - r.x)) lowerHull.pop();
      else break;
    }
    lowerHull.push(p);
  }
  lowerHull.pop();
  if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) return upperHull;
  else return upperHull.concat(lowerHull);
}
function getTabbableOptions() {
  return {
    getShadowRoot: true,
    displayCheck: (
      // JSDOM does not support the `tabbable` library. To solve this we can
      // check if `ResizeObserver` is a real function (not polyfilled), which
      // determines if the current environment is JSDOM-like.
      typeof ResizeObserver === "function" && ResizeObserver.toString().includes("[native code]") ? "full" : "none"
    )
  };
}
function getTabbableFrom(currentNode, direction) {
  if (!isTabbable(currentNode, getTabbableOptions())) {
    return getTabbableFromFocusable(currentNode, direction);
  }
  const allTabbable = tabbable(getDocument(currentNode).body, getTabbableOptions());
  if (direction === "prev")
    allTabbable.reverse();
  const activeIndex = allTabbable.indexOf(currentNode);
  if (activeIndex === -1)
    return document.body;
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}
function getTabbableFromFocusable(currentNode, direction) {
  if (!isFocusable(currentNode, getTabbableOptions()))
    return document.body;
  const allFocusable = focusable(getDocument(currentNode).body, getTabbableOptions());
  if (direction === "prev")
    allFocusable.reverse();
  const activeIndex = allFocusable.indexOf(currentNode);
  if (activeIndex === -1)
    return document.body;
  const nextFocusableElements = allFocusable.slice(activeIndex + 1);
  return nextFocusableElements.find((node) => isTabbable(node, getTabbableOptions())) ?? document.body;
}
const MenuRootContext = new Context("Menu.Root");
const MenuMenuContext = new Context("Menu.Root | Menu.Sub");
const MenuContentContext = new Context("Menu.Content");
const MenuOpenEvent = new CustomEventDispatcher("bitsmenuopen", { bubbles: false, cancelable: true });
class MenuRootState {
  opts;
  isUsingKeyboard = new IsUsingKeyboard();
  ignoreCloseAutoFocus = false;
  isPointerInTransit = false;
  constructor(opts) {
    this.opts = opts;
  }
  getAttr(name) {
    return `data-${this.opts.variant.current}-${name}`;
  }
}
class MenuMenuState {
  opts;
  root;
  parentMenu;
  contentId = box.with(() => "");
  contentNode = null;
  triggerNode = null;
  constructor(opts, root, parentMenu) {
    this.opts = opts;
    this.root = root;
    this.parentMenu = parentMenu;
    if (parentMenu) {
      watch(() => parentMenu.opts.open.current, () => {
        if (parentMenu.opts.open.current) return;
        this.opts.open.current = false;
      });
    }
  }
  toggleOpen() {
    this.opts.open.current = !this.opts.open.current;
  }
  onOpen() {
    this.opts.open.current = true;
  }
  onClose() {
    this.opts.open.current = false;
  }
}
class MenuContentState {
  opts;
  parentMenu;
  search = "";
  #timer = 0;
  #handleTypeaheadSearch;
  rovingFocusGroup;
  mounted = false;
  #isSub;
  constructor(opts, parentMenu) {
    this.opts = opts;
    this.parentMenu = parentMenu;
    parentMenu.contentId = opts.id;
    this.#isSub = opts.isSub ?? false;
    this.onkeydown = this.onkeydown.bind(this);
    this.onblur = this.onblur.bind(this);
    this.onfocus = this.onfocus.bind(this);
    this.handleInteractOutside = this.handleInteractOutside.bind(this);
    useRefById({
      ...opts,
      deps: () => this.parentMenu.opts.open.current,
      onRefChange: (node) => {
        if (this.parentMenu.contentNode !== node) {
          this.parentMenu.contentNode = node;
        }
      }
    });
    useGraceArea({
      contentNode: () => this.parentMenu.contentNode,
      triggerNode: () => this.parentMenu.triggerNode,
      enabled: () => this.parentMenu.opts.open.current && Boolean(this.parentMenu.triggerNode?.hasAttribute(this.parentMenu.root.getAttr("sub-trigger"))),
      onPointerExit: () => {
        this.parentMenu.opts.open.current = false;
      },
      setIsPointerInTransit: (value) => {
        this.parentMenu.root.isPointerInTransit = value;
      }
    });
    this.#handleTypeaheadSearch = useDOMTypeahead().handleTypeaheadSearch;
    this.rovingFocusGroup = useRovingFocus({
      rootNodeId: this.parentMenu.contentId,
      candidateAttr: this.parentMenu.root.getAttr("item"),
      loop: this.opts.loop,
      orientation: box.with(() => "vertical")
    });
    watch(() => this.parentMenu.contentNode, (contentNode) => {
      if (!contentNode) return;
      const handler = () => {
        afterTick(() => {
          if (!this.parentMenu.root.isUsingKeyboard.current) return;
          this.rovingFocusGroup.focusFirstCandidate();
        });
      };
      return MenuOpenEvent.listen(contentNode, handler);
    });
  }
  #getCandidateNodes() {
    const node = this.parentMenu.contentNode;
    if (!node) return [];
    const candidates = Array.from(node.querySelectorAll(`[${this.parentMenu.root.getAttr("item")}]:not([data-disabled])`));
    return candidates;
  }
  #isPointerMovingToSubmenu() {
    return this.parentMenu.root.isPointerInTransit;
  }
  onCloseAutoFocus = (e) => {
    this.opts.onCloseAutoFocus.current(e);
    if (e.defaultPrevented || this.#isSub) return;
    if (this.parentMenu.triggerNode && isTabbable(this.parentMenu.triggerNode)) {
      this.parentMenu.triggerNode.focus();
    }
  };
  handleTabKeyDown(e) {
    let rootMenu = this.parentMenu;
    while (rootMenu.parentMenu !== null) {
      rootMenu = rootMenu.parentMenu;
    }
    if (!rootMenu.triggerNode) return;
    e.preventDefault();
    const nodeToFocus = getTabbableFrom(rootMenu.triggerNode, e.shiftKey ? "prev" : "next");
    if (nodeToFocus) {
      this.parentMenu.root.ignoreCloseAutoFocus = true;
      rootMenu.onClose();
      nodeToFocus.focus();
      afterTick(() => {
        this.parentMenu.root.ignoreCloseAutoFocus = false;
      });
    } else {
      document.body.focus();
    }
  }
  onkeydown(e) {
    if (e.defaultPrevented) return;
    if (e.key === TAB) {
      this.handleTabKeyDown(e);
      return;
    }
    const target = e.target;
    const currentTarget = e.currentTarget;
    if (!isHTMLElement(target) || !isHTMLElement(currentTarget)) return;
    const isKeydownInside = target.closest(`[${this.parentMenu.root.getAttr("content")}]`)?.id === this.parentMenu.contentId.current;
    const isModifierKey = e.ctrlKey || e.altKey || e.metaKey;
    const isCharacterKey = e.key.length === 1;
    const kbdFocusedEl = this.rovingFocusGroup.handleKeydown(target, e);
    if (kbdFocusedEl) return;
    if (e.code === "Space") return;
    const candidateNodes = this.#getCandidateNodes();
    if (isKeydownInside) {
      if (!isModifierKey && isCharacterKey) {
        this.#handleTypeaheadSearch(e.key, candidateNodes);
      }
    }
    if (e.target?.id !== this.parentMenu.contentId.current) return;
    if (!FIRST_LAST_KEYS.includes(e.key)) return;
    e.preventDefault();
    if (LAST_KEYS.includes(e.key)) {
      candidateNodes.reverse();
    }
    focusFirst(candidateNodes);
  }
  onblur(e) {
    if (!isElement(e.currentTarget)) return;
    if (!isElement(e.target)) return;
    if (!e.currentTarget.contains?.(e.target)) {
      window.clearTimeout(this.#timer);
      this.search = "";
    }
  }
  onfocus(_) {
    if (!this.parentMenu.root.isUsingKeyboard.current) return;
    afterTick(() => this.rovingFocusGroup.focusFirstCandidate());
  }
  onItemEnter() {
    return this.#isPointerMovingToSubmenu();
  }
  onItemLeave(e) {
    if (e.currentTarget.hasAttribute(this.parentMenu.root.getAttr("sub-trigger"))) return;
    if (this.#isPointerMovingToSubmenu() || this.parentMenu.root.isUsingKeyboard.current) return;
    const contentNode = this.parentMenu.contentNode;
    contentNode?.focus();
    this.rovingFocusGroup.setCurrentTabStopId("");
  }
  onTriggerLeave() {
    if (this.#isPointerMovingToSubmenu()) return true;
    return false;
  }
  onOpenAutoFocus = (e) => {
    if (e.defaultPrevented) return;
    e.preventDefault();
    const contentNode = this.parentMenu.contentNode;
    contentNode?.focus();
  };
  handleInteractOutside(e) {
    if (!isElementOrSVGElement(e.target)) return;
    const triggerId = this.parentMenu.triggerNode?.id;
    if (e.target.id === triggerId) {
      e.preventDefault();
      return;
    }
    if (e.target.closest(`#${triggerId}`)) {
      e.preventDefault();
    }
  }
  #snippetProps = once(() => ({ open: this.parentMenu.opts.open.current }));
  get snippetProps() {
    return this.#snippetProps();
  }
  #props = once(() => ({
    id: this.opts.id.current,
    role: "menu",
    "aria-orientation": getAriaOrientation("vertical"),
    [this.parentMenu.root.getAttr("content")]: "",
    "data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
    onkeydown: this.onkeydown,
    onblur: this.onblur,
    onfocus: this.onfocus,
    dir: this.parentMenu.root.opts.dir.current,
    style: { pointerEvents: "auto" }
  }));
  get props() {
    return this.#props();
  }
  popperProps = {
    onCloseAutoFocus: (e) => this.onCloseAutoFocus(e)
  };
}
class MenuItemSharedState {
  opts;
  content;
  #isFocused = false;
  constructor(opts, content) {
    this.opts = opts;
    this.content = content;
    this.onpointermove = this.onpointermove.bind(this);
    this.onpointerleave = this.onpointerleave.bind(this);
    this.onfocus = this.onfocus.bind(this);
    this.onblur = this.onblur.bind(this);
    useRefById({ ...opts, deps: () => this.content.mounted });
  }
  onpointermove(e) {
    if (e.defaultPrevented) return;
    if (!isMouseEvent(e)) return;
    if (this.opts.disabled.current) {
      this.content.onItemLeave(e);
    } else {
      const defaultPrevented = this.content.onItemEnter();
      if (defaultPrevented) return;
      const item = e.currentTarget;
      if (!isHTMLElement(item)) return;
      item.focus();
    }
  }
  onpointerleave(e) {
    if (e.defaultPrevented) return;
    if (!isMouseEvent(e)) return;
    this.content.onItemLeave(e);
  }
  onfocus(e) {
    afterTick(() => {
      if (e.defaultPrevented || this.opts.disabled.current) return;
      this.#isFocused = true;
    });
  }
  onblur(e) {
    afterTick(() => {
      if (e.defaultPrevented) return;
      this.#isFocused = false;
    });
  }
  #props = once(() => ({
    id: this.opts.id.current,
    tabindex: -1,
    role: "menuitem",
    "aria-disabled": getAriaDisabled(this.opts.disabled.current),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-highlighted": this.#isFocused ? "" : void 0,
    [this.content.parentMenu.root.getAttr("item")]: "",
    //
    onpointermove: this.onpointermove,
    onpointerleave: this.onpointerleave,
    onfocus: this.onfocus,
    onblur: this.onblur
  }));
  get props() {
    return this.#props();
  }
}
class MenuItemState {
  opts;
  item;
  #isPointerDown = false;
  root;
  constructor(opts, item) {
    this.opts = opts;
    this.item = item;
    this.root = item.content.parentMenu.root;
    this.onkeydown = this.onkeydown.bind(this);
    this.onclick = this.onclick.bind(this);
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
  }
  #handleSelect() {
    if (this.item.opts.disabled.current) return;
    const selectEvent = new CustomEvent("menuitemselect", { bubbles: true, cancelable: true });
    this.opts.onSelect.current(selectEvent);
    afterTick(() => {
      if (selectEvent.defaultPrevented) {
        this.item.content.parentMenu.root.isUsingKeyboard.current = false;
        return;
      }
      if (this.opts.closeOnSelect.current) {
        this.item.content.parentMenu.root.opts.onClose();
      }
    });
  }
  onkeydown(e) {
    const isTypingAhead = this.item.content.search !== "";
    if (this.item.opts.disabled.current || isTypingAhead && e.key === SPACE) return;
    if (SELECTION_KEYS.includes(e.key)) {
      if (!isHTMLElement(e.currentTarget)) return;
      e.currentTarget.click();
      e.preventDefault();
    }
  }
  onclick(_) {
    if (this.item.opts.disabled.current) return;
    this.#handleSelect();
  }
  onpointerup(e) {
    if (e.defaultPrevented) return;
    if (!this.#isPointerDown) {
      if (!isHTMLElement(e.currentTarget)) return;
      e.currentTarget?.click();
    }
  }
  onpointerdown(_) {
    this.#isPointerDown = true;
  }
  #props = once(() => mergeProps(this.item.props, {
    onclick: this.onclick,
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
class DropdownMenuTriggerState {
  opts;
  parentMenu;
  constructor(opts, parentMenu) {
    this.opts = opts;
    this.parentMenu = parentMenu;
    this.onpointerdown = this.onpointerdown.bind(this);
    this.onpointerup = this.onpointerup.bind(this);
    this.onkeydown = this.onkeydown.bind(this);
    useRefById({
      ...opts,
      onRefChange: (ref) => {
        this.parentMenu.triggerNode = ref;
      }
    });
  }
  onpointerdown(e) {
    if (this.opts.disabled.current) return;
    if (e.pointerType === "touch") return e.preventDefault();
    if (e.button === 0 && e.ctrlKey === false) {
      this.parentMenu.toggleOpen();
      if (!this.parentMenu.opts.open.current) e.preventDefault();
    }
  }
  onpointerup(e) {
    if (this.opts.disabled.current) return;
    if (e.pointerType === "touch") {
      e.preventDefault();
      this.parentMenu.toggleOpen();
    }
  }
  onkeydown(e) {
    if (this.opts.disabled.current) return;
    if (e.key === SPACE || e.key === ENTER) {
      this.parentMenu.toggleOpen();
      e.preventDefault();
      return;
    }
    if (e.key === ARROW_DOWN) {
      this.parentMenu.onOpen();
      e.preventDefault();
    }
  }
  #ariaControls = once(() => {
    if (this.parentMenu.opts.open.current && this.parentMenu.contentId.current) return this.parentMenu.contentId.current;
    return void 0;
  });
  #props = once(() => ({
    id: this.opts.id.current,
    disabled: this.opts.disabled.current,
    "aria-haspopup": "menu",
    "aria-expanded": getAriaExpanded(this.parentMenu.opts.open.current),
    "aria-controls": this.#ariaControls(),
    "data-disabled": getDataDisabled(this.opts.disabled.current),
    "data-state": getDataOpenClosed(this.parentMenu.opts.open.current),
    [this.parentMenu.root.getAttr("trigger")]: "",
    //
    onpointerdown: this.onpointerdown,
    onpointerup: this.onpointerup,
    onkeydown: this.onkeydown
  }));
  get props() {
    return this.#props();
  }
}
function useMenuRoot(props) {
  const root = new MenuRootState(props);
  FocusScopeContext.set({
    get ignoreCloseAutoFocus() {
      return root.ignoreCloseAutoFocus;
    }
  });
  return MenuRootContext.set(root);
}
function useMenuMenu(root, props) {
  return MenuMenuContext.set(new MenuMenuState(props, root, null));
}
function useMenuDropdownTrigger(props) {
  return new DropdownMenuTriggerState(props, MenuMenuContext.get());
}
function useMenuContent(props) {
  return MenuContentContext.set(new MenuContentState(props, MenuMenuContext.get()));
}
function useMenuItem(props) {
  const item = new MenuItemSharedState(props, MenuContentContext.get());
  return new MenuItemState(props, item);
}
function Menu_item($$payload, $$props) {
  push();
  let {
    child,
    children,
    ref = null,
    id = useId(),
    disabled = false,
    onSelect = noop,
    closeOnSelect = true,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const itemState = useMenuItem({
    id: box.with(() => id),
    disabled: box.with(() => disabled),
    onSelect: box.with(() => onSelect),
    ref: box.with(() => ref, (v) => ref = v),
    closeOnSelect: box.with(() => closeOnSelect)
  });
  const mergedProps = mergeProps(restProps, itemState.props);
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
function Menu($$payload, $$props) {
  push();
  let {
    open = false,
    dir = "ltr",
    onOpenChange = noop,
    _internal_variant: variant = "dropdown-menu",
    children
  } = $$props;
  const root = useMenuRoot({
    variant: box.with(() => variant),
    dir: box.with(() => dir),
    onClose: () => {
      open = false;
      onOpenChange(false);
    }
  });
  useMenuMenu(root, {
    open: box.with(() => open, (v) => {
      open = v;
      onOpenChange(v);
    })
  });
  Floating_layer($$payload, {
    children: ($$payload2) => {
      children?.($$payload2);
      $$payload2.out += `<!---->`;
    }
  });
  bind_props($$props, { open });
  pop();
}
function Dropdown_menu_content($$payload, $$props) {
  push();
  let {
    id = useId(),
    child,
    children,
    ref = null,
    loop = true,
    onInteractOutside = noop,
    onEscapeKeydown = noop,
    onCloseAutoFocus = noop,
    forceMount = false,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const contentState = useMenuContent({
    id: box.with(() => id),
    loop: box.with(() => loop),
    ref: box.with(() => ref, (v) => ref = v),
    onCloseAutoFocus: box.with(() => onCloseAutoFocus)
  });
  const mergedProps = mergeProps(restProps, contentState.props);
  function handleInteractOutside(e) {
    contentState.handleInteractOutside(e);
    if (e.defaultPrevented) return;
    onInteractOutside(e);
    if (e.defaultPrevented) return;
    contentState.parentMenu.onClose();
  }
  function handleEscapeKeydown(e) {
    onEscapeKeydown(e);
    if (e.defaultPrevented) return;
    contentState.parentMenu.onClose();
  }
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    if (forceMount) {
      $$payload2.out += "<!--[-->";
      {
        let popper = function($$payload3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, {
            style: getFloatingContentCSSVars("dropdown-menu")
          });
          if (child) {
            $$payload3.out += "<!--[-->";
            child($$payload3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
            children?.($$payload3);
            $$payload3.out += `<!----></div></div>`;
          }
          $$payload3.out += `<!--]--> `;
          Mounted($$payload3, {
            get mounted() {
              return contentState.mounted;
            },
            set mounted($$value) {
              contentState.mounted = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!---->`;
        };
        Popper_layer_force_mount($$payload2, spread_props([
          mergedProps,
          contentState.popperProps,
          {
            enabled: contentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            trapFocus: true,
            loop,
            forceMount: true,
            id,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else if (!forceMount) {
      $$payload2.out += "<!--[1-->";
      {
        let popper = function($$payload3, { props, wrapperProps }) {
          const finalProps = mergeProps(props, {
            style: getFloatingContentCSSVars("dropdown-menu")
          });
          if (child) {
            $$payload3.out += "<!--[-->";
            child($$payload3, {
              props: finalProps,
              wrapperProps,
              ...contentState.snippetProps
            });
            $$payload3.out += `<!---->`;
          } else {
            $$payload3.out += "<!--[!-->";
            $$payload3.out += `<div${spread_attributes({ ...wrapperProps })}><div${spread_attributes({ ...finalProps })}>`;
            children?.($$payload3);
            $$payload3.out += `<!----></div></div>`;
          }
          $$payload3.out += `<!--]--> `;
          Mounted($$payload3, {
            get mounted() {
              return contentState.mounted;
            },
            set mounted($$value) {
              contentState.mounted = $$value;
              $$settled = false;
            }
          });
          $$payload3.out += `<!---->`;
        };
        Popper_layer($$payload2, spread_props([
          mergedProps,
          contentState.popperProps,
          {
            present: contentState.parentMenu.opts.open.current,
            onInteractOutside: handleInteractOutside,
            onEscapeKeydown: handleEscapeKeydown,
            trapFocus: true,
            loop,
            forceMount: false,
            id,
            popper,
            $$slots: { popper: true }
          }
        ]));
      }
    } else {
      $$payload2.out += "<!--[!-->";
    }
    $$payload2.out += `<!--]-->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { ref });
  pop();
}
function Menu_trigger($$payload, $$props) {
  push();
  let {
    id = useId(),
    ref = null,
    child,
    children,
    disabled = false,
    type = "button",
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  const triggerState = useMenuDropdownTrigger({
    id: box.with(() => id),
    disabled: box.with(() => disabled ?? false),
    ref: box.with(() => ref, (v) => ref = v)
  });
  const mergedProps = mergeProps(restProps, triggerState.props, { type });
  Floating_layer_anchor($$payload, {
    id,
    children: ($$payload2) => {
      if (child) {
        $$payload2.out += "<!--[-->";
        child($$payload2, { props: mergedProps });
        $$payload2.out += `<!---->`;
      } else {
        $$payload2.out += "<!--[!-->";
        $$payload2.out += `<button${spread_attributes({ ...mergedProps })}>`;
        children?.($$payload2);
        $$payload2.out += `<!----></button>`;
      }
      $$payload2.out += `<!--]-->`;
    }
  });
  bind_props($$props, { ref });
  pop();
}
let isUsingKeyboard = false;
class IsUsingKeyboard {
  static _refs = 0;
  // Reference counting to avoid multiple listeners.
  static _cleanup;
  constructor() {
  }
  get current() {
    return isUsingKeyboard;
  }
  set current(value) {
    isUsingKeyboard = value;
  }
}
function ReuseableDropdownMenu($$payload, $$props) {
  push();
  let {
    open = false,
    children,
    buttonText,
    items,
    avatar,
    contentProps,
    $$slots,
    $$events,
    ...restProps
  } = $$props;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<!---->`;
    Menu($$payload2, spread_props([
      restProps,
      {
        get open() {
          return open;
        },
        set open($$value) {
          open = $$value;
          $$settled = false;
        },
        children: ($$payload3) => {
          $$payload3.out += `<!---->`;
          Menu_trigger($$payload3, {
            children: ($$payload4) => {
              if (avatar) {
                $$payload4.out += "<!--[-->";
                CoverArt($$payload4, {
                  item: avatar,
                  altText: avatar["release_group_name"]
                });
              } else {
                $$payload4.out += "<!--[!-->";
              }
              $$payload4.out += `<!--]--> ${escape_html(buttonText)} `;
              Chevron_down($$payload4, {});
              $$payload4.out += `<!---->`;
            },
            $$slots: { default: true }
          });
          $$payload3.out += `<!----> <!---->`;
          Dropdown_menu_content($$payload3, spread_props([
            contentProps,
            {
              children: ($$payload4) => {
                const each_array = ensure_array_like(items);
                $$payload4.out += `<!--[-->`;
                for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                  let item = each_array[$$index];
                  if (item.url) {
                    $$payload4.out += "<!--[-->";
                    $$payload4.out += `<a${attr("href", item.url)}><!---->`;
                    Menu_item($$payload4, {
                      textValue: item.text,
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(item.text)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!----></a>`;
                  } else {
                    $$payload4.out += "<!--[!-->";
                    $$payload4.out += `<!---->`;
                    Menu_item($$payload4, {
                      textValue: item.text,
                      children: ($$payload5) => {
                        $$payload5.out += `<!---->${escape_html(item.text)}`;
                      },
                      $$slots: { default: true }
                    });
                    $$payload4.out += `<!---->`;
                  }
                  $$payload4.out += `<!--]-->`;
                }
                $$payload4.out += `<!--]-->`;
              },
              $$slots: { default: true }
            }
          ]));
          $$payload3.out += `<!---->`;
        },
        $$slots: { default: true }
      }
    ]));
    $$payload2.out += `<!---->`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  bind_props($$props, { open });
  pop();
}
function NavHeader($$payload, $$props) {
  let {
    sessionUserId,
    username,
    displayName,
    avatarItem
  } = $$props;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>Freq</title>`;
  });
  $$payload.out += `<div class="grid-background svelte-149pdip"><header class="svelte-149pdip"><a class="logo" href="/"><img class="logo svelte-149pdip" alt="Freq"${attr("src", logo)}></a> <nav class="wide svelte-149pdip">`;
  if (sessionUserId) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<a href="/feed"><button class="nav">feed</button></a> `;
    ReuseableDropdownMenu($$payload, {
      buttonText: "create",
      items: [
        {
          "text": "new post",
          "url": "/posts/now-playing/new"
        },
        {
          "text": "new collection",
          "url": "/collection/new"
        }
      ]
    });
    $$payload.out += `<!----> `;
    ReuseableDropdownMenu($$payload, {
      buttonText: "discover",
      items: [
        {
          "text": "universal feed",
          "url": "/feed/firehose"
        },
        { "text": "collections", "url": "/collections" },
        { "text": "users", "url": "/users" }
      ]
    });
    $$payload.out += `<!----> `;
    ReuseableDropdownMenu($$payload, {
      buttonText: "about",
      items: [
        { "text": "about", "url": "/about" },
        { "text": "updates", "url": "/about/updates" },
        {
          "text": "community guidelines",
          "url": "/about/guidelines"
        }
      ]
    });
    $$payload.out += `<!----> `;
    ReuseableDropdownMenu($$payload, {
      avatar: avatarItem,
      buttonText: displayName ?? "display name",
      items: [
        { "text": "profile", "url": `/user/${username}` },
        {
          "text": "my collections",
          "url": `/user/${username}/collections`
        },
        {
          "text": "my posts",
          "url": `/user/${username}/now-playing-posts`
        },
        { "text": "account", "url": `/account` },
        { "text": "sign out", "url": `/sign-out` }
      ]
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    ReuseableDropdownMenu($$payload, {
      buttonText: "explore",
      items: [
        { "text": "collections", "url": "/collections" },
        { "text": "posts", "url": "/posts" }
      ]
    });
    $$payload.out += `<!----> <a href="/about"><button class="nav">about</button></a> <a href="/welcome"><button class="nav">log in/sign up</button></a>`;
  }
  $$payload.out += `<!--]--></nav> <nav class="narrow svelte-149pdip">`;
  if (sessionUserId) {
    $$payload.out += "<!--[-->";
    ReuseableDropdownMenu($$payload, {
      buttonText: "explore",
      items: [
        { "text": "feed", "url": `/feed` },
        {
          "text": "universal feed",
          "url": `/feed/firehose`
        },
        {
          "text": "new post",
          "url": `/posts/now-playing/new`
        },
        {
          "text": "new collection",
          "url": `/collection/new`
        },
        { "text": "about", "url": `/about` },
        { "text": "updates", "url": `/about/updates` },
        {
          "text": "discover collections",
          "url": `/collections`
        },
        { "text": "discover users", "url": `/users` }
      ]
    });
    $$payload.out += `<!----> `;
    ReuseableDropdownMenu($$payload, {
      avatar: avatarItem,
      buttonText: displayName ?? "display name",
      items: [
        { "text": "profile", "url": `/user/${username}` },
        {
          "text": "my collections",
          "url": `/user/${username}/collections`
        },
        {
          "text": "my posts",
          "url": `/user/${username}/now-playing-posts`
        },
        { "text": "account", "url": `/account` },
        { "text": "sign out", "url": `/sign-out` }
      ]
    });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    ReuseableDropdownMenu($$payload, {
      buttonText: "explore",
      items: [
        { "text": "about", "url": "/about" },
        { "text": "collections", "url": "/collections" },
        { "text": "posts", "url": "/posts" }
      ]
    });
    $$payload.out += `<!----> <a href="/welcome"><button class="nav">log in/sign up</button></a>`;
  }
  $$payload.out += `<!--]--></nav></header> <div class="buttons-group svelte-149pdip"><a class="report svelte-149pdip" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSfKj4FlApgfM-Kc4rYwAxNQslBMS9rk-DdfowMa5qcHlRYhew/viewform?usp=sf_link"><button class="standard">report a bug</button></a> <a class="report svelte-149pdip" target="_blank" href="https://forms.gle/27Q7qg6qLWiFnLHv7"><button class="standard">feedback and requests</button></a></div></div>`;
}
function _layout($$payload, $$props) {
  push();
  let { data, children } = $$props;
  let { session, sessionUserId, supabase } = data;
  let { profile } = data;
  let {
    username,
    display_name,
    avatar_url,
    avatar_last_fm_img_url,
    avatar_artist_name,
    avatar_release_group_name
  } = profile;
  let avatarItem = {
    "img_url": avatar_url,
    "last_fm_img_url": avatar_last_fm_img_url,
    "artist_name": avatar_artist_name,
    "release_group_name": avatar_release_group_name
  };
  NavHeader($$payload, {
    sessionUserId,
    username,
    displayName: display_name,
    avatarItem
  });
  $$payload.out += `<!----> <div class="double-border-full-vw"></div> `;
  children($$payload);
  $$payload.out += `<!----> <div class="buffer svelte-gc6ymb"></div>`;
  pop();
}
export {
  _layout as default
};

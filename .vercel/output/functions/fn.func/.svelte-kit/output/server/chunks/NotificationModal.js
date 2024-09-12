import { c as create_ssr_component, i as createEventDispatcher, d as add_attribute } from "./ssr.js";
const NotificationModal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { showModal } = $$props;
  let dialog;
  createEventDispatcher();
  if ($$props.showModal === void 0 && $$bindings.showModal && showModal !== void 0) $$bindings.showModal(showModal);
  return `<dialog class="notification" aria-label="notification modal"${add_attribute("this", dialog, 0)}><div class="dialog-header"><h1 class="notification">${slots["header-text"] ? slots["header-text"]({}) : ``}</h1> <button aria-label="close modal" formmethod="dialog" data-svelte-h="svelte-17gr06n">x</button></div> <p class="notification">${slots.message ? slots.message({}) : ``}</p></dialog> `;
});
export {
  NotificationModal as N
};

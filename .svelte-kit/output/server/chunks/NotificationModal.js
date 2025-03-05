import { j as bind_props, p as pop, b as push } from "./index2.js";
function NotificationModal($$payload, $$props) {
  push();
  let { showModal = void 0, headerText, message } = $$props;
  $$payload.out += `<dialog class="notification svelte-lrd1iw" aria-label="notification modal"><div class="dialog-header"><h1 class="notification">`;
  headerText($$payload);
  $$payload.out += `<!----></h1> <button aria-label="close modal" formmethod="dialog">x</button></div> <p class="notification">`;
  message?.($$payload);
  $$payload.out += `<!----></p></dialog>`;
  bind_props($$props, { showModal });
  pop();
}
export {
  NotificationModal as N
};

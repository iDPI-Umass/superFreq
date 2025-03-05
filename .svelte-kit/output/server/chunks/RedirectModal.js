import { j as bind_props, p as pop, b as push } from "./index2.js";
import "./client.js";
/* empty css                                            */
function RedirectModal($$payload, $$props) {
  push();
  let {
    showModal = void 0,
    redirectPath,
    // expects format '/route'
    headerText,
    message,
    delay = void 0
  } = $$props;
  $$payload.out += `<dialog class="notification" aria-label="redirect-modal"><div class="dialog-column svelte-au4rpm"><div class="dialog-header"><h1 class="notification">`;
  headerText?.($$payload);
  $$payload.out += `<!----></h1></div> `;
  message?.($$payload);
  $$payload.out += `<!----> <button class="standard svelte-au4rpm">Go now</button></div></dialog>`;
  bind_props($$props, { showModal, delay });
  pop();
}
export {
  RedirectModal as R
};

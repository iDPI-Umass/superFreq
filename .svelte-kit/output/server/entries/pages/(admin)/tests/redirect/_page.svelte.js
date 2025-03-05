import { c as copy_payload, a as assign_payload, p as pop, b as push, e as escape_html } from "../../../../../chunks/index2.js";
import { R as RedirectModal } from "../../../../../chunks/RedirectModal.js";
function _page($$payload, $$props) {
  push();
  let delay = 5;
  let showModal = false;
  let countdown = 0;
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    $$payload2.out += `<div class="panel"><button class="standard">redirect</button></div> `;
    {
      let headerText = function($$payload3) {
        $$payload3.out += `<!---->header text`;
      }, message = function($$payload3) {
        $$payload3.out += `<!---->redirecting in ${escape_html(countdown)} seconds`;
      };
      RedirectModal($$payload2, {
        redirectPath: "/",
        delay,
        get showModal() {
          return showModal;
        },
        set showModal($$value) {
          showModal = $$value;
          $$settled = false;
        },
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
    $$payload2.out += `<!---->`;
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

import { b as push, j as bind_props, p as pop } from "./index2.js";
function ListModal($$payload, $$props) {
  push();
  let { showModal = void 0, headerText, list } = $$props;
  $$payload.out += `<dialog aria-label="modal" class="svelte-ayvj0y"><div class="dialog-header svelte-ayvj0y"><h2 class="svelte-ayvj0y">`;
  headerText?.($$payload);
  $$payload.out += `<!----></h2> <button aria-label="close modal" formmethod="dialog" class="svelte-ayvj0y">x</button></div> `;
  list?.($$payload);
  $$payload.out += `<!----></dialog>`;
  bind_props($$props, { showModal });
  pop();
}
export {
  ListModal as L
};

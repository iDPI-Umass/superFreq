import { f as attr, p as pop, b as push } from "../../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const urlString = data?.urlString;
  $$payload.out += `<form class="horizontal svelte-1twfnq4" method="POST" action="?/confirm"><input type="hidden" name="url-string" id="url-string"${attr("value", urlString)} class="svelte-1twfnq4"> <button class="standard svelte-1twfnq4" type="submit">complete sign-in</button></form>`;
  pop();
}
export {
  _page as default
};

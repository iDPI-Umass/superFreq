import { b as push, g as await_block, p as pop } from "./index2.js";
import { d as parseMarkdown } from "./parseData.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function InlineMarkdownText($$payload, $$props) {
  push();
  let { text } = $$props;
  $$payload.out += `<!---->`;
  await_block(
    parseMarkdown(text),
    () => {
    },
    (text2) => {
      $$payload.out += `${html(text2)}`;
    }
  );
  $$payload.out += `<!---->`;
  pop();
}
export {
  InlineMarkdownText as I
};

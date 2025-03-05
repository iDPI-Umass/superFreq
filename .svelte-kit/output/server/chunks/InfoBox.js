import { f as attr, i as clsx } from "./index2.js";
function InfoBox($$payload, $$props) {
  let {
    mode = "compact",
    // "standard", "compact", "inline"
    children
  } = $$props;
  const boxStyle = {
    "standard": "info-box",
    "compact": "info-box-compact",
    "inline": "info-box-inline"
  };
  $$payload.out += `<div${attr("class", clsx(boxStyle[mode]))} aria-label="hint"><p>`;
  children($$payload);
  $$payload.out += `<!----></p></div>`;
}
export {
  InfoBox as I
};

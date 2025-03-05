import "clsx";
import { P as Popover, a as Popover_trigger, b as Popover_content } from "./popover.js";
import { b as push, m as spread_props, p as pop } from "./index2.js";
import { I as Icon } from "./Icon.js";
function Info($$payload, $$props) {
  push();
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "info" },
    props,
    {
      iconNode,
      children: ($$payload2) => {
        props.children?.($$payload2);
        $$payload2.out += `<!---->`;
      },
      $$slots: { default: true }
    }
  ]));
  pop();
}
function Tooltip($$payload, $$props) {
  let { children } = $$props;
  $$payload.out += `<!---->`;
  Popover($$payload, {
    children: ($$payload2) => {
      $$payload2.out += `<!---->`;
      Popover_trigger($$payload2, {
        children: ($$payload3) => {
          Info($$payload3, { size: "16" });
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!----> <!---->`;
      Popover_content($$payload2, {
        class: "tooltip",
        children: ($$payload3) => {
          $$payload3.out += `<p>`;
          children($$payload3);
          $$payload3.out += `<!----></p>`;
        },
        $$slots: { default: true }
      });
      $$payload2.out += `<!---->`;
    },
    $$slots: { default: true }
  });
  $$payload.out += `<!---->`;
}
export {
  Tooltip as T
};

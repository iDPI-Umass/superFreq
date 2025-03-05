import { b as push, m as spread_props, p as pop } from "./index2.js";
import { I as Icon } from "./Icon.js";
function Music($$payload, $$props) {
  push();
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [
    ["path", { "d": "M9 18V5l12-2v13" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    [
      "circle",
      { "cx": "18", "cy": "16", "r": "3" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "music" },
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
function Disc_2($$payload, $$props) {
  push();
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "10" }
    ],
    [
      "circle",
      { "cx": "12", "cy": "12", "r": "4" }
    ],
    ["path", { "d": "M12 12h.01" }]
  ];
  Icon($$payload, spread_props([
    { name: "disc-2" },
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
function Boom_box($$payload, $$props) {
  push();
  let { $$slots, $$events, ...props } = $$props;
  const iconNode = [
    [
      "path",
      { "d": "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }
    ],
    ["path", { "d": "M8 8v1" }],
    ["path", { "d": "M12 8v1" }],
    ["path", { "d": "M16 8v1" }],
    [
      "rect",
      {
        "width": "20",
        "height": "12",
        "x": "2",
        "y": "9",
        "rx": "2"
      }
    ],
    ["circle", { "cx": "8", "cy": "15", "r": "2" }],
    [
      "circle",
      { "cx": "16", "cy": "15", "r": "2" }
    ]
  ];
  Icon($$payload, spread_props([
    { name: "boom-box" },
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
export {
  Boom_box as B,
  Disc_2 as D,
  Music as M
};

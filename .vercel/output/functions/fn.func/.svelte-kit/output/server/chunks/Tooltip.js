import { c as create_ssr_component, v as validate_component } from "./ssr.js";
import "dequal";
import "./updater.js";
import { P as Popover, a as Popover_trigger, b as Popover_content } from "./popover-trigger.js";
import { I as Icon } from "./Icon.js";
const Info = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const iconNode = [
    ["circle", { "cx": "12", "cy": "12", "r": "10" }],
    ["path", { "d": "M12 16v-4" }],
    ["path", { "d": "M12 8h.01" }]
  ];
  return `${validate_component(Icon, "Icon").$$render($$result, Object.assign({}, { name: "info" }, $$props, { iconNode }), {}, {
    default: () => {
      return `${slots.default ? slots.default({}) : ``}`;
    }
  })}`;
});
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Popover, "Popover.Root").$$render($$result, {}, {}, {
    default: () => {
      return `${validate_component(Popover_trigger, "Popover.Trigger").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Info, "Info").$$render($$result, { size: "16" }, {}, {})}`;
        }
      })} ${validate_component(Popover_content, "Popover.Content").$$render($$result, { class: "tooltip" }, {}, {
        default: () => {
          return `<p>${slots.default ? slots.default({}) : ``}</p>`;
        }
      })}`;
    }
  })}`;
});
export {
  Tooltip as T
};

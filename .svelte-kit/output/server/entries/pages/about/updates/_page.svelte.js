import { h as head } from "../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../chunks/PanelHeader.js";
import { U as Updates_md } from "../../../../chunks/updates.js";
import { K as Known_bugs_md, R as Roadmap_md } from "../../../../chunks/roadmap.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Updates
	</title>`;
  });
  $$payload.out += `<div class="panel-no-border"><div class="half-width-panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->Known bugs`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="about-text">`;
  Known_bugs_md($$payload);
  $$payload.out += `<!----></div></div> <div class="half-width-panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->Roadmap`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="about-text">`;
  Roadmap_md($$payload);
  $$payload.out += `<!----></div></div></div> <div class="panel" id="updates">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->Updates`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="about-text">`;
  Updates_md($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  _page as default
};

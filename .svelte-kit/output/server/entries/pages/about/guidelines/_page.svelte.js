import { h as head } from "../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../chunks/PanelHeader.js";
import { I as InfoBox } from "../../../../chunks/InfoBox.js";
import { C as Community_guidelines_md, D as Data_consent_md } from "../../../../chunks/data-consent.js";
function _page($$payload) {
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Guidelines
	</title>`;
  });
  InfoBox($$payload, {
    mode: "compact",
    children: ($$payload2) => {
      $$payload2.out += `<!---->Give these a read then head over to <a href="/">your profile page,</a> which will be your home base on Freq.`;
    }
  });
  $$payload.out += `<!----> <div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->Community guidelines`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="about-text">`;
  Community_guidelines_md($$payload);
  $$payload.out += `<!----></div></div> <div class="panel">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<!---->Data consent`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="about-text">`;
  Data_consent_md($$payload);
  $$payload.out += `<!----></div></div>`;
}
export {
  _page as default
};

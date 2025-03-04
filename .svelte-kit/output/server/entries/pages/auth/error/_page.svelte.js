import "clsx";
import { p as pop, b as push } from "../../../../chunks/index2.js";
function _page($$payload, $$props) {
  push();
  let { data } = $$props;
  const redirectFromParam = data?.redirectFromParam;
  $$payload.out += `<p>some error with your login</p> `;
  if (redirectFromParam == "confirm") {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p>There was a problem with your magic link. <a href="/welcome">Try signing in again</a> and please  fill out a <a href="https://forms.gle/RsZnDPtX19EBpuNM6">bug report</a> about this issue.</p> <p>If this is your second time seeing this error today, please <a href="mailto:msugarman@umass.edu">contact the site admin</a> for help.</p>`;
  } else if (redirectFromParam == "check") {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<p>There was some problem verfiying your account info. Finish <a href="/create-profile">setting up your profile</a> and please fill out a <a href="https://forms.gle/RsZnDPtX19EBpuNM6">bug report</a> about this issue.</p> <p>If you are having an issue with any of this, please <a href="mailto:msugarman@umass.edu">contact the site admin</a> for help.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
export {
  _page as default
};

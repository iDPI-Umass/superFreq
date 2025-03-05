import { h as head, f as attr, p as pop, b as push, e as escape_html } from "../../../../../chunks/index2.js";
import "../../../../../chunks/client.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { N as NotificationModal } from "../../../../../chunks/NotificationModal.js";
import { R as RedirectModal } from "../../../../../chunks/RedirectModal.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let { profile } = data;
  let username = profile?.username;
  let delay = 5;
  let countdown = 0;
  let showNotificationModal = form?.success == false ? true : false;
  let showRedirectModal = form?.success ? form?.success : false;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Update Username
	</title>`;
  });
  $$payload.out += `<div class="panel svelte-1vdlbrh" id="profile-info">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span>update username</span>`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <form class="horizontal" id="account-data" method="POST"><div class="form-column"><label class="text-label" for="current-username" form="account-data">Current Username</label> <input class="text svelte-1vdlbrh" type="text" name="current-username" id="current-username" form="account-data"${attr("value", username)} disabled> <label class="text-label" for="new-username" form="account-data">New Username</label> <input class="text svelte-1vdlbrh" type="text" name="new-username" id="new-username" form="account-data"${attr("value", username)}> <button type="submit" class="double-border-top"><div class="inner-border">submit</div></button></div></form> `;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span>Username taken</span>`;
    }, message = function($$payload2) {
      $$payload2.out += `<span>Please try another username.</span>`;
    };
    NotificationModal($$payload, {
      showModal: showNotificationModal,
      headerText,
      message,
      $$slots: { headerText: true, message: true }
    });
  }
  $$payload.out += `<!----></div> `;
  {
    let message = function($$payload2) {
      $$payload2.out += `<span>Username updated successfully. Redirecting to your account page in ${escape_html(countdown)} seconds.</span>`;
    };
    RedirectModal($$payload, {
      showModal: showRedirectModal,
      delay,
      redirectPath: "/account",
      message,
      $$slots: { message: true }
    });
  }
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};

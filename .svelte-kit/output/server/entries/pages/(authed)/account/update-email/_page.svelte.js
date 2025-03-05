import { h as head, f as attr, p as pop, b as push } from "../../../../../chunks/index2.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
function _page($$payload, $$props) {
  push();
  let { data, form } = $$props;
  let newEmail = "";
  let confirmEmail = "";
  let { sessionUserId, sessionUserEmail } = data;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Update Email
	</title>`;
  });
  $$payload.out += `<div class="panel svelte-nqgcci" id="profile-info">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span class="svelte-nqgcci">update email address</span>`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <form class="horizontal svelte-nqgcci" id="account-data" method="POST"><div class="form-column svelte-nqgcci"><label class="text-label svelte-nqgcci" for="current-username" form="account-data">Current Email Address</label> <input class="text svelte-nqgcci" type="email" name="current-email" id="current-email" form="account-data"${attr("value", sessionUserEmail)} disabled> <label class="text-label svelte-nqgcci" for="new-email" form="account-data">New Email Address</label> <input class="text svelte-nqgcci" type="text" name="new-email" id="new-email" form="account-data"${attr("value", newEmail)}> <label class="text-label svelte-nqgcci" for="confirm-email" form="account-data">Confirm New Email Address</label> <input class="text svelte-nqgcci" type="text" name="confirm-email" id="confirm-email" form="account-data"${attr("value", confirmEmail)}> <button type="submit" class="standard svelte-nqgcci"${attr("disabled", newEmail == "", true)}>update email address</button> `;
  if (form?.success == true) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<dialog open class="svelte-nqgcci"><button class="standard svelte-nqgcci">x</button> <p class="svelte-nqgcci">Check your inbox to confirm your new email address</p></dialog>`;
  } else if (form?.success == false) {
    $$payload.out += "<!--[1-->";
    $$payload.out += `<dialog open class="svelte-nqgcci"><button class="standard svelte-nqgcci">x</button> <p class="svelte-nqgcci">Something went wrong, please reload this page and try again.</p></dialog>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div></form> `;
  if (form?.success == false) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<dialog open class="svelte-nqgcci"><form method="dialog" class="svelte-nqgcci"><button class="standard svelte-nqgcci">x</button> <p class="svelte-nqgcci">That username is not available. Please try another.</p></form></dialog>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div>`;
  pop();
}
export {
  _page as default
};

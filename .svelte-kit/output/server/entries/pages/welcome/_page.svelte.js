import { h as head, f as attr, p as pop, b as push, e as escape_html } from "../../../chunks/index2.js";
import "../../../chunks/client.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
import { N as NotificationModal } from "../../../chunks/NotificationModal.js";
function _page($$payload, $$props) {
  push();
  let { form } = $$props;
  let email = null;
  head($$payload, ($$payload2) => {
    $$payload2.title = `<title>
		Welcome to Freq
	</title>`;
  });
  $$payload.out += `<div class="panel-medium svelte-uz8l7b">`;
  {
    let headerText = function($$payload2) {
      $$payload2.out += `<span class="svelte-uz8l7b">welcome</span>`;
    };
    PanelHeader($$payload, { headerText });
  }
  $$payload.out += `<!----> <div class="post-body"><p class="post-text svelte-uz8l7b">Welcome to Freq, a place for community-driven music discovery. <br> <br> <span class="svelte-uz8l7b">Freq</span> (sounds like <em>freak</em>) is short for <em>frequency</em>: the rate a sound wave vibrates at, determining its pitch. <br> <br> Just enter your email address for a one-time link to log in or sign up.</p> <form class="vertical svelte-uz8l7b" method="POST" action="?/sendMagicLink"><label class="text-label" for="email">email</label> <input class="text svelte-uz8l7b" id="email" name="email" type="email" placeholder="enter your email..."${attr("value", email)}> <button class="double-border-top" type="submit"${attr("disabled", true, true)}><div class="inner-border">submit</div></button></form></div></div> `;
  if (form?.permission == true) {
    $$payload.out += "<!--[-->";
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<span class="svelte-uz8l7b">${escape_html(form?.success ? "Success" : "Error")}</span>`;
      }, message = function($$payload2) {
        $$payload2.out += `<span class="svelte-uz8l7b"><p>${escape_html(form?.success ? "Check your inbox! And maybe also your spam." : "Something went wrong. Please try again.")}</p></span>`;
      };
      NotificationModal($$payload, {
        showModal: form?.showModal ?? false,
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
  } else if (form?.permission == false) {
    $$payload.out += "<!--[1-->";
    {
      let headerText = function($$payload2) {
        $$payload2.out += `<span class="svelte-uz8l7b">Not approved</span>`;
      }, message = function($$payload2) {
        $$payload2.out += `<span class="svelte-uz8l7b"><p>You are not yet approved to sign up for Freq. You can <a href="https://forms.gle/sGF4yjkubeorrBRH9">request an invite.</a></p></span>`;
      };
      NotificationModal($$payload, {
        showModal: form?.showModal ?? false,
        headerText,
        message,
        $$slots: { headerText: true, message: true }
      });
    }
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <div class="panel-medium svelte-uz8l7b"><div class="post-body"><p class="post-text svelte-uz8l7b">Want to explore the site before you create an account? You can use the "Explore" menu above to check out anonymized posts and public collections of music created by users and read the "About" page to learn more about the project.</p></div></div>`;
  pop();
}
export {
  _page as default
};

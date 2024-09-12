import { c as create_ssr_component, v as validate_component, f as escape } from "../../../chunks/ssr.js";
import "devalue";
import "../../../chunks/client.js";
/* empty css                    */
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
import { N as NotificationModal } from "../../../chunks/NotificationModal.js";
const css = {
  code: ".panel-medium.svelte-uz8l7b p.svelte-uz8l7b{color:var(--freq-color-reading-text);font-size:var(--freq-font-size-medium)}span.svelte-uz8l7b.svelte-uz8l7b{color:var(--freq-color-primary)}input.svelte-uz8l7b.svelte-uz8l7b{width:50%}form.vertical.svelte-uz8l7b.svelte-uz8l7b{margin-left:0}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { enhance } from \\"$app/forms\\";\\nimport \\"$lib/styles/posts.css\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport NotificationModal from \\"src/lib/components/modals/NotificationModal.svelte\\";\\nexport let form;\\n$: form;\\nconsole.log(form?.success);\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tWelcome to Freq\\n\\t</title>\\n</svelte:head>\\n\\n\\n<div class=\\"panel-medium\\">\\n    <PanelHeader>\\n        welcome\\n    </PanelHeader>\\n    <div class=\\"post-body\\">\\n        <p class=\\"post-text\\">\\n            Welcome to Freq, a place for community-driven music discovery. \\n            <br />\\n            <br />\\n            <span>Freq</span> (sounds like <em>freak</em>) is short for <em>frequency</em>: the rate a sound wave vibrates at, determining its pitch.\\n            <br />\\n            <br />\\n            Just enter your email address for a one-time link to log in or sign up.\\n        </p>\\n        <form class=\\"vertical\\" method=\\"POST\\" action=\\"?/sendMagicLink\\" use:enhance>\\n            <label \\n                class=\\"text-label\\" \\n                for=\\"email\\"\\n            >\\n                email\\n            </label>\\n            <input \\n                class=\\"text\\" \\n                id=\\"email\\" \\n                name=\\"email\\"\\n                type=\\"text\\"\\n                placeholder=\\"enter your email...\\" \\n            />\\n            <button class=\\"double-border-top\\" type=\\"submit\\"> \\n                <div class=\\"inner-border\\">\\n                    submit\\n                </div>\\n            </button>\\n        </form>\\n    </div>\\n</div>\\n\\n<NotificationModal\\n    showModal={form?.showModal ?? false}\\n>\\n    <span slot=\\"header-text\\">\\n        { form?.success ? 'Success' : 'Error'}\\n    </span>\\n    <span slot=\\"message\\">\\n        <p>{ form?.success ? 'Check your inbox!' : 'Something went wrong. Please try again.' }</p>\\n    </span>\\n</NotificationModal>\\n\\n<div class=\\"panel-medium\\">\\n    <div class=\\"post-body\\">\\n        <p class=\\"post-text\\">\\n            Want to explore the site before you create an account? You can use the \\"Explore\\" menu above to check out anonymized posts and public collections of music created by users and read the \\"About\\" page to learn more about the project.\\n        </p>\\n    </div>\\n</div>\\n\\n<style>\\n    .panel-medium p {\\n        color: var(--freq-color-reading-text);\\n        font-size: var(--freq-font-size-medium);\\n    }\\n    span {\\n        color: var(--freq-color-primary);\\n    }\\n    input {\\n        width: 50%;\\n    }\\n    form.vertical {\\n        margin-left: 0;\\n    }\\n</style>"],"names":[],"mappings":"AAyEI,2BAAa,CAAC,eAAE,CACZ,KAAK,CAAE,IAAI,yBAAyB,CAAC,CACrC,SAAS,CAAE,IAAI,uBAAuB,CAC1C,CACA,gCAAK,CACD,KAAK,CAAE,IAAI,oBAAoB,CACnC,CACA,iCAAM,CACF,KAAK,CAAE,GACX,CACA,IAAI,qCAAU,CACV,WAAW,CAAE,CACjB"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  console.log(form?.success);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  return `${$$result.head += `<!-- HEAD_svelte-fpi6a0_START -->${$$result.title = `<title>
		Welcome to Freq
	</title>`, ""}<!-- HEAD_svelte-fpi6a0_END -->`, ""} <div class="panel-medium svelte-uz8l7b">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
    default: () => {
      return `welcome`;
    }
  })} <div class="post-body"><p class="post-text svelte-uz8l7b" data-svelte-h="svelte-481xl2">Welcome to Freq, a place for community-driven music discovery. 
            <br> <br> <span class="svelte-uz8l7b">Freq</span> (sounds like <em>freak</em>) is short for <em>frequency</em>: the rate a sound wave vibrates at, determining its pitch.
            <br> <br>
            Just enter your email address for a one-time link to log in or sign up.</p> <form class="vertical svelte-uz8l7b" method="POST" action="?/sendMagicLink" data-svelte-h="svelte-q5vn5e"><label class="text-label" for="email">email</label> <input class="text svelte-uz8l7b" id="email" name="email" type="text" placeholder="enter your email..."> <button class="double-border-top" type="submit"><div class="inner-border">submit</div></button></form></div></div> ${validate_component(NotificationModal, "NotificationModal").$$render($$result, { showModal: form?.showModal ?? false }, {}, {
    message: () => {
      return `<span slot="message" class="svelte-uz8l7b"><p>${escape(form?.success ? "Check your inbox!" : "Something went wrong. Please try again.")}</p></span>`;
    },
    "header-text": () => {
      return `<span slot="header-text" class="svelte-uz8l7b">${escape(form?.success ? "Success" : "Error")}</span>`;
    }
  })} <div class="panel-medium svelte-uz8l7b" data-svelte-h="svelte-1s6013a"><div class="post-body"><p class="post-text svelte-uz8l7b">Want to explore the site before you create an account? You can use the &quot;Explore&quot; menu above to check out anonymized posts and public collections of music created by users and read the &quot;About&quot; page to learn more about the project.</p></div> </div>`;
});
export {
  Page as default
};

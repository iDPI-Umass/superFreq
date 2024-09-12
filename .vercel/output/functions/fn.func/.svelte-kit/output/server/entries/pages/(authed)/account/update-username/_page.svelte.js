import { c as create_ssr_component, v as validate_component, d as add_attribute } from "../../../../../chunks/ssr.js";
import "devalue";
import "../../../../../chunks/client.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { N as NotificationModal } from "../../../../../chunks/NotificationModal.js";
import { R as RedirectModal } from "../../../../../chunks/RedirectModal.js";
const css = {
  code: ".panel.svelte-1vdlbrh{max-width:500px}input.svelte-1vdlbrh{max-width:300px}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { enhance } from \\"$app/forms\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport { profileStoresObject } from \\"src/lib/stores.ts\\";\\nimport NotificationModal from \\"$lib/components/modals/NotificationModal.svelte\\";\\nimport RedirectModal from \\"$lib/components/modals/RedirectModal.svelte\\";\\nexport let data;\\nexport let form;\\nlet { session, supabase, profile } = data;\\n$: ({ session, supabase, profile } = data);\\nlet profileForm;\\nlet loading = false;\\nlet username = profile?.username ?? form?.currentUsername;\\nconst handleSubmit = () => {\\n  loading = true;\\n  const profileStorageItem = {\\n    \\"displayName\\": profile?.display_name,\\n    \\"username\\": username,\\n    \\"avatarUrl\\": profile?.avatar_url\\n  };\\n  console.log(profileStorageItem);\\n  localStorage.setItem(\\"profile\\", JSON.stringify(profileStorageItem));\\n  profileStoresObject.set(profileStorageItem);\\n  return async ({ result }) => {\\n    loading = false;\\n  };\\n};\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tUpdate Username\\n\\t</title>\\n</svelte:head>\\n\\n\\n<div class=\\"panel\\" id=\\"profile-info\\">\\n    <PanelHeader>\\n\\t\\tupdate username\\n\\t</PanelHeader>\\n\\t<form\\n\\t\\tclass=\\"horizontal\\"\\n\\t\\tid=\\"account-data\\"\\n\\t\\tmethod=\\"POST\\"\\n\\t>\\n    <div class=\\"form-column\\">\\n        <label \\n            class=\\"text-label\\"  \\n            for=\\"current-username\\"\\n            form=\\"account-data\\"\\n        >\\n            Current Username\\n        </label>\\n        <input\\n            class=\\"text\\"\\n            type=\\"text\\"\\n            name=\\"current-username\\"\\n            id=\\"current-username\\"\\n            form=\\"account-data\\"\\n            value={profile?.username} \\n            disabled\\n        />\\n        <label \\n            class=\\"text-label\\"  \\n            for=\\"new-username\\"\\n            form=\\"account-data\\"\\n        >\\n            New Username\\n        </label>\\n        <input\\n            class=\\"text\\"\\n            type=\\"text\\"\\n            name=\\"new-username\\"\\n            id=\\"new-username\\"\\n            form=\\"account-data\\"\\n            value={profile?.username} \\n        />\\n        <button\\n            type=\\"submit\\"\\n            class=\\"double-border-top\\"\\n        >\\n            <div class=\\"inner-border\\">\\n                submit\\n            </div>\\n        </button>\\n    </div>\\n\\n\\n    </form>\\n    <NotificationModal\\n        showModal={(form?.success ? !form?.success : false)}\\n    >\\n        <span slot=\\"header-text\\">Username taken</span>\\n        <span slot=\\"message\\">Please try another username.</span>\\n    </NotificationModal>\\n</div>\\n\\n<RedirectModal\\n    showModal={form?.success ?? false}\\n    redirectPath='/account'\\n>\\nUsername updated successfully. Redirecting to your account page in 5 seconds.\\n</RedirectModal>\\n\\n<style>\\n    .panel {\\n        max-width: 500px;\\n    }\\n    input {\\n        max-width: 300px;\\n    }\\n</style>"],"names":[],"mappings":"AAwGI,qBAAO,CACH,SAAS,CAAE,KACf,CACA,oBAAM,CACF,SAAS,CAAE,KACf"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let { session, supabase, profile } = data;
  profile?.username ?? form?.currentUsername;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  ({ session, supabase, profile } = data);
  return `${$$result.head += `<!-- HEAD_svelte-qw1cgu_START -->${$$result.title = `<title>
		Update Username
	</title>`, ""}<!-- HEAD_svelte-qw1cgu_END -->`, ""} <div class="panel svelte-1vdlbrh" id="profile-info">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
    default: () => {
      return `update username`;
    }
  })} <form class="horizontal" id="account-data" method="POST"><div class="form-column"><label class="text-label" for="current-username" form="account-data" data-svelte-h="svelte-14oln4v">Current Username</label> <input class="text svelte-1vdlbrh" type="text" name="current-username" id="current-username" form="account-data"${add_attribute("value", profile?.username, 0)} disabled> <label class="text-label" for="new-username" form="account-data" data-svelte-h="svelte-tazqwf">New Username</label> <input class="text svelte-1vdlbrh" type="text" name="new-username" id="new-username" form="account-data"${add_attribute("value", profile?.username, 0)}> <button type="submit" class="double-border-top" data-svelte-h="svelte-8pc3vx"><div class="inner-border">submit</div></button></div></form> ${validate_component(NotificationModal, "NotificationModal").$$render(
    $$result,
    {
      showModal: form?.success ? !form?.success : false
    },
    {},
    {
      message: () => {
        return `<span slot="message" data-svelte-h="svelte-1b2ps7o">Please try another username.</span>`;
      },
      "header-text": () => {
        return `<span slot="header-text" data-svelte-h="svelte-183x6rb">Username taken</span>`;
      }
    }
  )}</div> ${validate_component(RedirectModal, "RedirectModal").$$render(
    $$result,
    {
      showModal: form?.success ?? false,
      redirectPath: "/account"
    },
    {},
    {
      default: () => {
        return `Username updated successfully. Redirecting to your account page in 5 seconds.`;
      }
    }
  )}`;
});
export {
  Page as default
};

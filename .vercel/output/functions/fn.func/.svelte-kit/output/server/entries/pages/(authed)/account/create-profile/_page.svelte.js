import { c as create_ssr_component, v as validate_component, d as add_attribute, f as escape } from "../../../../../chunks/ssr.js";
import "devalue";
import "../../../../../chunks/client.js";
import { P as PanelHeader } from "../../../../../chunks/PanelHeader.js";
import { M as MusicBrainzSearch } from "../../../../../chunks/MusicBrainzSearch.js";
import { N as NotificationModal } from "../../../../../chunks/NotificationModal.js";
import { R as RedirectModal } from "../../../../../chunks/RedirectModal.js";
const css = {
  code: ".form-wrapper.svelte-427bvk{display:flex;flex-direction:row;gap:var(--freq-width-spacer);margin:var(--freq-height-spacer) var(--freq-width-spacer)}.mb-search.svelte-427bvk{margin:var(--freq-height-spacer-half) 0}.actions.svelte-427bvk{display:flex;flex-direction:row;align-items:center;justify-content:space-between;margin:var(--freq-height-spacer-quarter) 0}img.svelte-427bvk{margin:var(--freq-height-spacer-half) 0 0 0;width:90%}@media screen and (max-width: 700px){.form-wrapper.svelte-427bvk{max-width:700px;display:flex;flex-direction:column;gap:var(--freq-width-spacer);margin:var(--freq-height-spacer) var(--freq-width-spacer)}img.svelte-427bvk{width:50%}}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import { beforeUpdate, tick } from \\"svelte\\";\\nimport { enhance } from \\"$app/forms\\";\\nimport { goto } from \\"$app/navigation\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nimport MusicBrainzSearch from \\"$lib/components/MusicBrainzSearch.svelte\\";\\nimport NotificationModal from \\"src/lib/components/modals/NotificationModal.svelte\\";\\nimport RedirectModal from \\"$lib/components/modals/RedirectModal.svelte\\";\\nexport let data;\\nexport let form;\\nlet { email } = data;\\n$: ({ email } = data);\\n$: form;\\nlet username = \\"\\";\\nlet displayName = \\"\\";\\nlet about = \\"\\";\\nlet website = \\"\\";\\nlet newItemAdded = false;\\nlet avatarItem = {\\n  \\"img_url\\": \\"\\",\\n  \\"release_group_mbid\\": \\"\\",\\n  \\"release_group_name\\": \\"\\"\\n};\\nlet profileForm;\\nconsole.log(form?.success);\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tCreate Profile\\n\\t</title>\\n</svelte:head>\\n\\n\\n<div class=\\"panel\\" id=\\"profile-info\\">\\n\\t<PanelHeader>\\n\\t\\tcreate profile\\n\\t</PanelHeader>\\n\\t<div class=\\"form-wrapper\\">\\n\\t\\t<form\\n\\t\\t\\tid=\\"account-data\\"\\n\\t\\t\\tclass=\\"form-column\\"\\n\\t\\t\\tmethod=\\"POST\\"\\n\\t\\t\\taction=\\"?/create\\"\\n\\t\\t\\tuse:enhance\\n\\t\\t\\tbind:this={profileForm}\\n\\t\\t>\\n            <label \\n                class=\\"text-label\\" \\n                for=\\"email\\"\\n                form=\\"account-data\\"\\n            >\\n                Email\\n            </label>\\n\\t\\t\\t<input\\n\\t\\t\\t\\tclass=\\"text\\" \\n\\t\\t\\t\\ttype=\\"text\\" \\n\\t\\t\\t\\tname=\\"email\\" \\n\\t\\t\\t\\tid=\\"email\\"\\n\\t\\t\\t\\tform=\\"account-data\\"\\n\\t\\t\\t\\tvalue={email} \\n                disabled\\n\\t\\t\\t/>\\n\\t\\t\\t<div class=\\"label-group\\">\\n\\t\\t\\t\\t<label \\n\\t\\t\\t\\t\\tclass=\\"text-label\\"  \\n\\t\\t\\t\\t\\tfor=\\"username\\"\\n\\t\\t\\t\\t\\tform=\\"account-data\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\tUsername\\n\\t\\t\\t\\t</label>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n\\t\\t\\t</div>\\n\\t\\t\\t<input\\n\\t\\t\\t\\tclass=\\"text\\"\\n\\t\\t\\t\\ttype=\\"text\\"\\n\\t\\t\\t\\tname=\\"username\\"\\n\\t\\t\\t\\tid=\\"username\\"\\n\\t\\t\\t\\tform=\\"account-data\\"\\n\\t\\t\\t\\tvalue={username}\\n                required\\n\\t\\t\\t/>\\n            <div class=\\"label-group\\">\\n                <label \\n                    class=\\"text-label\\"\\n                    for=\\"displayName\\"\\n                >\\n                    Display name\\n                </label>\\n                <span class=\\"label-explainer\\">\\n                    * required\\n                </span>\\n            </div>\\n\\t\\t\\t<input \\n\\t\\t\\t\\tclass=\\"text\\" \\n\\t\\t\\t\\ttype=\\"text\\" \\n\\t\\t\\t\\tname=\\"displayName\\" \\n\\t\\t\\t\\tid=\\"displayName\\" \\n\\t\\t\\t\\tvalue={displayName} \\n                required\\n\\t\\t\\t/>\\n\\n\\t\\t\\t\\n\\t\\t\\t<label \\n\\t\\t\\t\\tclass=\\"text-label\\" \\n\\t\\t\\t\\tfor=\\"description\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\tabout me\\n\\t\\t\\t</label>\\n\\t\\t\\t<textarea\\n\\t\\t\\t\\tid=\\"about\\"\\n\\t\\t\\t\\tname=\\"about\\"\\n\\t\\t\\t\\trows=\\"3\\"\\n\\t\\t\\t\\tcols=\\"1\\"\\n\\t\\t\\t\\tmaxlength=\\"140\\"\\n\\t\\t\\t\\tspellcheck=true \\n\\t\\t\\t\\tvalue={about}\\n\\t\\t\\t></textarea>\\n\\n\\t\\t\\t<label \\n\\t\\t\\t\\tclass=\\"text-label\\" \\n\\t\\t\\t\\tfor=\\"website\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\tWebsite\\n\\t\\t\\t</label>\\n\\t\\t\\t<input \\n\\t\\t\\t\\tclass=\\"text\\" \\n\\t\\t\\t\\ttype=\\"url\\" \\n\\t\\t\\t\\tname=\\"website\\" \\n\\t\\t\\t\\tid=\\"website\\" \\n\\t\\t\\t\\tvalue={website} \\n\\t\\t\\t/>\\n\\t\\t\\t<input \\n\\t\\t\\t\\ttype=\\"hidden\\" \\n\\t\\t\\t\\tname=\\"avatarUrl\\" \\n\\t\\t\\t\\tid=\\"avatarUrl\\" \\n\\t\\t\\t\\tvalue={avatarItem.img_url} \\n\\t\\t\\t/>\\n\\t\\t\\t<input \\n\\t\\t\\t\\ttype=\\"hidden\\" \\n\\t\\t\\t\\tname=\\"avatarMbid\\" \\n\\t\\t\\t\\tid=\\"avatarMbid\\" \\n\\t\\t\\t\\tvalue={avatarItem.release_group_mbid} \\n\\t\\t\\t/>\\n\\t\\t</form>\\n\\t\\t<div class=\\"form-column\\">\\n\\t\\t\\t<label \\n\\t\\t\\t\\tclass=\\"text-label\\" \\n\\t\\t\\t\\tfor=\\"avatarUrl\\"\\n\\t\\t\\t>\\n\\t\\t\\t\\tchoose an album cover for your avatar\\n\\t\\t\\t</label>\\n\\t\\t\\t<!--\\n\\t\\t\\t\\tForm to search for avatar url\\n\\t\\t\\t-->\\n\\t\\t\\t<div class=\\"mb-search\\">\\n\\t\\t\\t\\t<MusicBrainzSearch\\n\\t\\t\\t\\t\\tsearchCategory=\\"release_groups\\"\\n\\t\\t\\t\\t\\tsearchButtonText=\\"search\\"\\n\\t\\t\\t\\t\\tsearchPlaceholder=\\"Search for an album\\"\\n\\t\\t\\t\\t\\tbind:addedItems={avatarItem}\\n\\t\\t\\t\\t\\tbind:newItemAdded={newItemAdded}\\n\\t\\t\\t\\t\\tmode=\\"single\\"\\n\\t\\t\\t\\t>\\n\\t\\t\\t\\t</MusicBrainzSearch>\\n\\t\\t\\t</div>\\n\\t\\t\\t<!-- add alt text and change column in postgres -->\\n\\t\\t\\t{#if avatarItem.img_url.length > 0}\\n\\t\\t\\t\\t<img src={avatarItem.img_url} alt=\\"user avatar\\"/>\\n\\t\\t\\t{/if}\\n\\t\\t\\t{#if form?.success}\\n\\t\\t\\t\\t<p>update submitted</p>\\n\\t\\t\\t{/if}\\n\\t\\t\\t<div class=\\"actions\\">\\n\\t\\t\\t\\t<button\\n\\t\\t\\t\\t\\tclass=\\"double-border-top\\"\\n\\t\\t\\t\\t\\ttype=\\"submit\\"\\n\\t\\t\\t\\t\\tdisabled={!( username && displayName )}\\n\\t\\t\\t\\t\\t>\\n\\t\\t\\t\\t\\t<div class=\\"inner-border\\">\\n\\t\\t\\t\\t\\t\\tsubmit \\n\\t\\t\\t\\t\\t</div>\\n\\t\\t\\t\\t</button>\\n\\t\\t\\t</div>\\n\\t\\t</div>\\n\\t</div>\\n</div>\\n\\n<NotificationModal\\n    showModal = {( form?.success ? !form?.success : false )}\\n>\\n<span slot=\\"header-text\\">\\n    Try Another Username\\n</span>\\n<span slot=\\"message\\">\\n    That Username is already taken, but you can use it for your Display Name.\\n    <br />\\n    <br />\\n    Your Display Name is what other people on the site will actually see.\\n</span>\\n</NotificationModal>\\n\\n<RedirectModal\\n    showModal={ form?.success ? form?.success : false }\\n    redirectPath={'/about#guidelines'}\\n>\\n    <span slot=\\"header-text\\">\\n        Profiled created!\\n    </span>\\n    <span slot=\\"message\\">\\n        Automatically redirecting to our Community Guidelines in 5 seconds.\\n    </span>\\n</RedirectModal>\\n\\n<style>\\n\\t.form-wrapper {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\tgap: var(--freq-width-spacer);\\n\\t\\tmargin: var(--freq-height-spacer) var(--freq-width-spacer);\\n\\t}\\n\\t.mb-search {\\n\\t\\tmargin: var(--freq-height-spacer-half) 0;\\n\\t}\\n\\t.actions {\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: row;\\n\\t\\talign-items: center;\\n\\t\\tjustify-content: space-between;\\n\\t\\tmargin: var(--freq-height-spacer-quarter) 0;\\n\\t}\\n\\timg {\\n\\t\\tmargin: var(--freq-height-spacer-half) 0 0 0;\\n\\t\\twidth: 90%;\\n\\t}\\n\\t@media screen and (max-width: 700px) {\\n\\t\\t.form-wrapper {\\n\\t\\t\\tmax-width: 700px;\\n\\t\\t\\tdisplay: flex;\\n\\t\\t\\tflex-direction: column;\\n\\t\\t\\tgap: var(--freq-width-spacer);\\n\\t\\t\\tmargin: var(--freq-height-spacer) var(--freq-width-spacer);\\n\\t\\t}\\n\\t\\timg {\\n\\t\\t\\twidth: 50%;\\n\\t\\t}\\n\\t}\\n</style>"],"names":[],"mappings":"AAwNC,2BAAc,CACb,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,GAAG,CAAE,IAAI,mBAAmB,CAAC,CAC7B,MAAM,CAAE,IAAI,oBAAoB,CAAC,CAAC,IAAI,mBAAmB,CAC1D,CACA,wBAAW,CACV,MAAM,CAAE,IAAI,yBAAyB,CAAC,CAAC,CACxC,CACA,sBAAS,CACR,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,eAAe,CAAE,aAAa,CAC9B,MAAM,CAAE,IAAI,4BAA4B,CAAC,CAAC,CAC3C,CACA,iBAAI,CACH,MAAM,CAAE,IAAI,yBAAyB,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAAC,CAC5C,KAAK,CAAE,GACR,CACA,OAAO,MAAM,CAAC,GAAG,CAAC,YAAY,KAAK,CAAE,CACpC,2BAAc,CACb,SAAS,CAAE,KAAK,CAChB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,GAAG,CAAE,IAAI,mBAAmB,CAAC,CAC7B,MAAM,CAAE,IAAI,oBAAoB,CAAC,CAAC,IAAI,mBAAmB,CAC1D,CACA,iBAAI,CACH,KAAK,CAAE,GACR,CACD"}`
};
let username = "";
let displayName = "";
let about = "";
let website = "";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let { email } = data;
  let newItemAdded = false;
  let avatarItem = {
    "img_url": "",
    "release_group_mbid": "",
    "release_group_name": ""
  };
  let profileForm;
  console.log(form?.success);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    ({ email } = data);
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-1xptdys_START -->${$$result.title = `<title>
		Create Profile
	</title>`, ""}<!-- HEAD_svelte-1xptdys_END -->`, ""} <div class="panel" id="profile-info">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
      default: () => {
        return `create profile`;
      }
    })} <div class="form-wrapper svelte-427bvk"><form id="account-data" class="form-column" method="POST" action="?/create"${add_attribute("this", profileForm, 0)}><label class="text-label" for="email" form="account-data" data-svelte-h="svelte-jusps0">Email</label> <input class="text" type="text" name="email" id="email" form="account-data"${add_attribute("value", email, 0)} disabled> <div class="label-group" data-svelte-h="svelte-69r4ah"><label class="text-label" for="username" form="account-data">Username</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="username" id="username" form="account-data"${add_attribute("value", username, 0)} required> <div class="label-group" data-svelte-h="svelte-xhxh7t"><label class="text-label" for="displayName">Display name</label> <span class="label-explainer">* required</span></div> <input class="text" type="text" name="displayName" id="displayName"${add_attribute("value", displayName, 0)} required> <label class="text-label" for="description" data-svelte-h="svelte-12v3eeq">about me</label> <textarea id="about" name="about" rows="3" cols="1" maxlength="140" spellcheck="true">${escape(about, false)}</textarea> <label class="text-label" for="website" data-svelte-h="svelte-1r1mu05">Website</label> <input class="text" type="url" name="website" id="website"${add_attribute("value", website, 0)}> <input type="hidden" name="avatarUrl" id="avatarUrl"${add_attribute("value", avatarItem.img_url, 0)}> <input type="hidden" name="avatarMbid" id="avatarMbid"${add_attribute("value", avatarItem.release_group_mbid, 0)}></form> <div class="form-column"><label class="text-label" for="avatarUrl" data-svelte-h="svelte-1auqosk">choose an album cover for your avatar</label>  <div class="mb-search svelte-427bvk">${validate_component(MusicBrainzSearch, "MusicBrainzSearch").$$render(
      $$result,
      {
        searchCategory: "release_groups",
        searchButtonText: "search",
        searchPlaceholder: "Search for an album",
        mode: "single",
        addedItems: avatarItem,
        newItemAdded
      },
      {
        addedItems: ($$value) => {
          avatarItem = $$value;
          $$settled = false;
        },
        newItemAdded: ($$value) => {
          newItemAdded = $$value;
          $$settled = false;
        }
      },
      {}
    )}</div>  ${avatarItem.img_url.length > 0 ? `<img${add_attribute("src", avatarItem.img_url, 0)} alt="user avatar" class="svelte-427bvk">` : ``} ${form?.success ? `<p data-svelte-h="svelte-lqrnc8">update submitted</p>` : ``} <div class="actions svelte-427bvk"><button class="double-border-top" type="submit" ${"disabled"}><div class="inner-border" data-svelte-h="svelte-891wr">submit</div></button></div></div></div></div> ${validate_component(NotificationModal, "NotificationModal").$$render(
      $$result,
      {
        showModal: form?.success ? !form?.success : false
      },
      {},
      {
        message: () => {
          return `<span slot="message" data-svelte-h="svelte-1railol">That Username is already taken, but you can use it for your Display Name.
    <br> <br>
    Your Display Name is what other people on the site will actually see.</span>`;
        },
        "header-text": () => {
          return `<span slot="header-text" data-svelte-h="svelte-x9byfk">Try Another Username</span>`;
        }
      }
    )} ${validate_component(RedirectModal, "RedirectModal").$$render(
      $$result,
      {
        showModal: form?.success ? form?.success : false,
        redirectPath: "/about#guidelines"
      },
      {},
      {
        message: () => {
          return `<span slot="message" data-svelte-h="svelte-1cu1ln5">Automatically redirecting to our Community Guidelines in 5 seconds.</span>`;
        },
        "header-text": () => {
          return `<span slot="header-text" data-svelte-h="svelte-lb2y8o">Profiled created!</span>`;
        }
      }
    )}`;
  } while (!$$settled);
  return $$rendered;
});
export {
  Page as default
};

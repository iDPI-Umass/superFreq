import { c as create_ssr_component, f as escape, h as each, d as add_attribute } from "../../../../../../chunks/ssr.js";
const css = {
  code: "a.svelte-1n9j5uv{display:flex;flex-direction:row;align-items:center;gap:var(--freq-inline-gap-double);color:var(--freq-color-text)}li.svelte-1n9j5uv{list-style:none;font-size:var(--freq-font-size-x-large)}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let data;\\nlet { profiles, profileDisplayName, username } = data;\\n$: ({ profiles, profileDisplayName, username } = data);\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tUsers {username} follows\\n\\t</title>\\n</svelte:head>\\n\\n<h1>users {profileDisplayName} follows</h1>\\n{#each profiles as user}\\n<ul>\\n    <li>\\n        <a href=\\"/user/{user.username}\\">\\n            <img src={user.avatar_url} alt=\\"${user.display_name}\'s avatar\\" class=\\"avatar\\" />\\n            {user.display_name}\\n        </a>\\n    </li>\\n</ul>\\n{/each}\\n\\n<style>\\n    a {\\n        display: flex;\\n        flex-direction: row;\\n        align-items: center;\\n        gap: var(--freq-inline-gap-double);\\n        color: var(--freq-color-text);\\n        \\n    }\\n    li {\\n        list-style: none;\\n        font-size: var(--freq-font-size-x-large);\\n    }\\n</style>"],"names":[],"mappings":"AAwBI,gBAAE,CACE,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IAAI,wBAAwB,CAAC,CAClC,KAAK,CAAE,IAAI,iBAAiB,CAEhC,CACA,iBAAG,CACC,UAAU,CAAE,IAAI,CAChB,SAAS,CAAE,IAAI,wBAAwB,CAC3C"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { profiles, profileDisplayName, username } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  ({ profiles, profileDisplayName, username } = data);
  return `${$$result.head += `<!-- HEAD_svelte-nwyfe5_START -->${$$result.title = `<title>
		Users ${escape(username)} follows
	</title>`, ""}<!-- HEAD_svelte-nwyfe5_END -->`, ""} <h1>users ${escape(profileDisplayName)} follows</h1> ${each(profiles, (user) => {
    return `<ul><li class="svelte-1n9j5uv"><a href="${"/user/" + escape(user.username, true)}" class="svelte-1n9j5uv"><img${add_attribute("src", user.avatar_url, 0)} alt="${"$" + escape(user.display_name, true) + "'s avatar"}" class="avatar"> ${escape(user.display_name)} </a></li> </ul>`;
  })}`;
});
export {
  Page as default
};

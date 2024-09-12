import { c as create_ssr_component, h as each, f as escape, d as add_attribute } from "../../../chunks/ssr.js";
const css = {
  code: "h1.svelte-1tv04cv{margin:3vh 3vw}li.svelte-1tv04cv{list-style:none}a.svelte-1tv04cv{display:flex;flex-direction:row;align-items:center;gap:1rem}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">export let data;\\nlet { users } = data;\\n$: ({ users } = data);\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tExplore Users\\n\\t</title>\\n</svelte:head>\\n\\n\\n<h1>users</h1>\\n{#each users as user}\\n<ul>\\n    <li>\\n        <a href=\\"/user/${user.username}\\">\\n            <img src={user.avatar_url} alt=\\"${user.display_name}\'s avatar\\" class=\\"avatar\\" />\\n            <span class=\\"display-name\\">{user.display_name}</span>\\n        </a>\\n    </li>\\n</ul>\\n{/each}\\n\\n<style>\\n    h1 {\\n        margin: 3vh 3vw;\\n    }\\n    li {\\n        list-style: none;\\n    }\\n    a {\\n        display: flex;\\n        flex-direction: row;\\n        align-items: center;\\n        gap: 1rem;\\n    }\\n</style>"],"names":[],"mappings":"AAyBI,iBAAG,CACC,MAAM,CAAE,GAAG,CAAC,GAChB,CACA,iBAAG,CACC,UAAU,CAAE,IAChB,CACA,gBAAE,CACE,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,GAAG,CACnB,WAAW,CAAE,MAAM,CACnB,GAAG,CAAE,IACT"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { users } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  ({ users } = data);
  return `${$$result.head += `<!-- HEAD_svelte-1obhfue_START -->${$$result.title = `<title>
		Explore Users
	</title>`, ""}<!-- HEAD_svelte-1obhfue_END -->`, ""} <h1 class="svelte-1tv04cv" data-svelte-h="svelte-1b5vjze">users</h1> ${each(users, (user) => {
    return `<ul><li class="svelte-1tv04cv"><a href="${"/user/$" + escape(user.username, true)}" class="svelte-1tv04cv"><img${add_attribute("src", user.avatar_url, 0)} alt="${"$" + escape(user.display_name, true) + "'s avatar"}" class="avatar"> <span class="display-name">${escape(user.display_name)}</span> </a></li> </ul>`;
  })}`;
});
export {
  Page as default
};

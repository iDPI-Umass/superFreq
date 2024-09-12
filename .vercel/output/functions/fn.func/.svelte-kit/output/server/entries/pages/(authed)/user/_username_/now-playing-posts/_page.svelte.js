import { c as create_ssr_component, f as escape, v as validate_component, h as each } from "../../../../../../chunks/ssr.js";
import { N as NowPlayingPost } from "../../../../../../chunks/NowPlayingPost.js";
import { P as PanelHeader } from "../../../../../../chunks/PanelHeader.js";
const css = {
  code: ".posts-spacing.svelte-1gilt3n{display:flex;flex-direction:column;padding:var(--freq-spacing-medium);gap:var(--freq-spacer-gap)}",
  map: `{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import NowPlayingPost from \\"$lib/components/Posts/NowPlayingPost.svelte\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nexport let data;\\nlet { posts, username, sessionUserId } = data;\\n$: ({ posts, username, sessionUserId } = data);\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\t{username}'s' Now Playing posts\\n\\t</title>\\n</svelte:head>\\n\\n<div class=\\"panel-medium\\">\\n    <PanelHeader>\\n        {posts[0]['display_name']}'s Now Playing posts\\n    </PanelHeader>\\n    <div class=\\"posts-spacing\\">\\n    {#each posts as post}\\n        <NowPlayingPost\\n            sessionUserId={sessionUserId}\\n            post={post}\\n            mode=\\"feed\\"\\n        >\\n        </NowPlayingPost>\\n    {/each}\\n    </div>\\n</div>\\n<div class=\\"post-panel\\">\\n\\n\\n</div>\\n\\n<style>\\n    .posts-spacing {\\n        display: flex;\\n        flex-direction: column;\\n        padding: var(--freq-spacing-medium);\\n        gap: var(--freq-spacer-gap);\\n    }\\n</style>"],"names":[],"mappings":"AAkCI,6BAAe,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,qBAAqB,CAAC,CACnC,GAAG,CAAE,IAAI,iBAAiB,CAC9B"}`
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { posts, username, sessionUserId } = data;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  $$result.css.add(css);
  ({ posts, username, sessionUserId } = data);
  return `${$$result.head += `<!-- HEAD_svelte-fiisjr_START -->${$$result.title = `<title> ${escape(username)}&#39;s&#39; Now Playing posts
	</title>`, ""}<!-- HEAD_svelte-fiisjr_END -->`, ""} <div class="panel-medium">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
    default: () => {
      return `${escape(posts[0]["display_name"])}&#39;s Now Playing posts`;
    }
  })} <div class="posts-spacing svelte-1gilt3n">${each(posts, (post) => {
    return `${validate_component(NowPlayingPost, "NowPlayingPost").$$render($$result, { sessionUserId, post, mode: "feed" }, {}, {})}`;
  })}</div></div> <div class="post-panel" data-svelte-h="svelte-jot282"></div>`;
});
export {
  Page as default
};

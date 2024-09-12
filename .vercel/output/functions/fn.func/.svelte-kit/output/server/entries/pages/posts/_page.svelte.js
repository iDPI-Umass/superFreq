import { c as create_ssr_component, v as validate_component, h as each } from "../../../chunks/ssr.js";
import { N as NowPlayingPost } from "../../../chunks/NowPlayingPost.js";
import { P as PanelHeader } from "../../../chunks/PanelHeader.js";
const css = {
  code: ".posts-spacing.svelte-1gilt3n{display:flex;flex-direction:column;padding:var(--freq-spacing-medium);gap:var(--freq-spacer-gap)}",
  map: '{"version":3,"file":"+page.svelte","sources":["+page.svelte"],"sourcesContent":["<script lang=\\"ts\\">import NowPlayingPost from \\"$lib/components/Posts/NowPlayingPost.svelte\\";\\nimport PanelHeader from \\"$lib/components/PanelHeader.svelte\\";\\nexport let data;\\nexport let form;\\nlet { posts, postCount } = data;\\n$: ({ posts, postCount } = data);\\nlet displayPosts = [...posts];\\n<\/script>\\n\\n<svelte:head>\\n\\t<title>\\n\\t\\tAnonymous Posts\\n\\t</title>\\n</svelte:head>\\n\\n<div class=\\"panel-medium\\">\\n    <PanelHeader>\\n        Some anonymized Now Playing posts\\n    </PanelHeader>\\n    <div class=\\"posts-spacing\\">\\n    {#each displayPosts as post}\\n        <NowPlayingPost\\n            post={post}\\n            mode=\\"feed\\"\\n        >\\n        </NowPlayingPost>\\n    {/each}\\n    </div>\\n</div>\\n<div class=\\"post-panel\\">\\n\\n\\n</div>\\n\\n<style>\\n    .posts-spacing {\\n        display: flex;\\n        flex-direction: column;\\n        padding: var(--freq-spacing-medium);\\n        gap: var(--freq-spacer-gap);\\n    }\\n</style>"],"names":[],"mappings":"AAmCI,6BAAe,CACX,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MAAM,CACtB,OAAO,CAAE,IAAI,qBAAqB,CAAC,CACnC,GAAG,CAAE,IAAI,iBAAiB,CAC9B"}'
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  let { form } = $$props;
  let { posts, postCount } = data;
  let displayPosts = [...posts];
  if ($$props.data === void 0 && $$bindings.data && data !== void 0) $$bindings.data(data);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0) $$bindings.form(form);
  $$result.css.add(css);
  ({ posts, postCount } = data);
  return `${$$result.head += `<!-- HEAD_svelte-1m92b8n_START -->${$$result.title = `<title>
		Anonymous Posts
	</title>`, ""}<!-- HEAD_svelte-1m92b8n_END -->`, ""} <div class="panel-medium">${validate_component(PanelHeader, "PanelHeader").$$render($$result, {}, {}, {
    default: () => {
      return `Some anonymized Now Playing posts`;
    }
  })} <div class="posts-spacing svelte-1gilt3n">${each(displayPosts, (post) => {
    return `${validate_component(NowPlayingPost, "NowPlayingPost").$$render($$result, { post, mode: "feed" }, {}, {})}`;
  })}</div></div> <div class="post-panel" data-svelte-h="svelte-jot282"></div>`;
});
export {
  Page as default
};

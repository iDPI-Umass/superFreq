<script lang="ts">
	import SEO from '$lib/components/layout/SEO.svelte';
	import NowPlayingPost from 'src/lib/components/Posts/NowPlayingPost.svelte';
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte';

	let { data } = $props();

	let { posts } = $derived(data);

	let displayPosts = $derived([...posts]);
</script>

<SEO title="Anonymous posts"></SEO>

<div class="panel-medium">
	<PanelHeader>
		{#snippet headerText()}
			<span> Some anonymized Now Playing posts </span>
		{/snippet}
	</PanelHeader>
	<div class="posts-spacing">
		{#each displayPosts as post}
			<NowPlayingPost {post} mode="sample"></NowPlayingPost>
		{/each}
	</div>
</div>
<div class="post-panel"></div>

<style>
	.posts-spacing {
		display: flex;
		flex-direction: column;
		padding: var(--freq-spacing-medium);
		gap: var(--freq-spacer-gap);
	}
</style>

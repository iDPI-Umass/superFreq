<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PanelHeader from '$lib/components/PanelHeader.svelte'

    export let data
    export let form

    let { posts, postCount } = data
    $: ({ posts, postCount } = data)

    let displayPosts = [...posts]
</script>

<svelte:head>
	<title>
		Anonymous Posts
	</title>
</svelte:head>

<div class="panel-medium">
    <PanelHeader>
        Some anonymized Now Playing posts
    </PanelHeader>
    <div class="posts-spacing">
    {#each displayPosts as post}
        <NowPlayingPost
            post={post}
            mode="feed"
        >
        </NowPlayingPost>
    {/each}
    </div>
</div>
<div class="post-panel">


</div>

<style>
    .posts-spacing {
        display: flex;
        flex-direction: column;
        padding: var(--freq-spacing-medium);
        gap: var(--freq-spacer-gap);
    }
</style>
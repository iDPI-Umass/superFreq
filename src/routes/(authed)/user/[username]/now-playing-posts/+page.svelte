<script lang="ts">
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte';
    export let data

    let { posts, username, sessionUserId } =  data
    $: ({ posts, username, sessionUserId } =  data)
</script>

<svelte:head>
	<title>
		{username}'s' Now Playing posts
	</title>
</svelte:head>

<div class="panel-medium">
    <PanelHeader>
        {posts[0]['display_name']}'s Now Playing posts
    </PanelHeader>
    <div class="posts-spacing">
    {#each posts as post}
        <NowPlayingPost
            sessionUserId={sessionUserId}
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
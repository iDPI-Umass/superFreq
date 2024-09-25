<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import RedirectModal from '$lib/components/modals/RedirectModal.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    export let data: PageData
    export let form: ActionData
    $: form

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
        {#if post.type == 'now_playing'}
        <NowPlayingPost
            sessionUserId={sessionUserId}
            post={post}
            mode="feed"
            userActionSuccess={form?.deleted}
        >
        </NowPlayingPost>
        {:else if post.type == "reply"}
        <PostReply
            reply={post}
            sessionUserId={sessionUserId}
        ></PostReply>
        {/if}
    {/each}
    </div>
</div>

{#if form?.deleted}
<NotificationModal
    showModal={form?.deleted}
>
    <span slot="header-text">
        success!
    </span>
    <span slot="message">
        Post deleted.
    </span>
</NotificationModal>
{/if}

<style>
    .posts-spacing {
        display: flex;
        flex-direction: column;
        padding: var(--freq-spacing-medium);
        gap: var(--freq-spacer-gap);
    }
</style>
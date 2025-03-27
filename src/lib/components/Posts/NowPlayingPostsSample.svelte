<script lang="ts">
    import { goto } from "$app/navigation"
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import NowPlayingPost from "./NowPlayingPost.svelte"
    import PostReply from "./PostReply.svelte"

    interface ComponentProps {
        posts: any
        username: string
        displayName: string
        sessionUserId?: string | null
        remaining?: number
    }
    
    let {
        posts,
        username,
        displayName,
        sessionUserId = null,
        remaining = 0
    }: ComponentProps = $props()
    
</script>

<!-- <svelte:options runes={true} /> -->

{#if posts && posts.length > 0}
<div class="panel-medium">
    <PanelHeader>
        {#snippet headerText()}
            <a class="panel-header-link" href={`/user/${username}/now-playing-posts`}>
                {displayName}'s Now Playing posts
            </a>
        {/snippet}
    </PanelHeader>
    <div class="posts-spacing">
    {#each posts as post}
        <NowPlayingPost
            post={post}
            sessionUserId={sessionUserId}
            mode="feed"
        >
        </NowPlayingPost>
    {/each}
    </div>
    {#if remaining > 0}
        <div class="button-spacer">
            <button class="standard" onclick={() => goto(`/user/${username}/now-playing-posts`)}>
                see more
            </button>
        </div>
    {/if}
</div>
{:else if !posts || posts.length == 0}
<div class="panel-medium">
    <div class="panel-button-buffer">
        <p>This user hasn't posted anything yet.</p>
    </div>
</div>
{/if}

<style>
    .posts-spacing {
        display: flex;
        flex-direction: column;
        padding: var(--freq-spacing-medium);
        gap: var(--freq-spacer-gap);
    }
    .button-spacer {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin: var(--freq-spacing-medium) auto;
    }
    .standard {
        margin: 0;
    }
    .panel-button-buffer p {
        font-size: var(--freq-font-size-medium);
    }
</style>
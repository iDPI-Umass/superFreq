<script lang="ts">
    import { goto } from "$app/navigation"
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import NowPlayingPost from "./NowPlayingPost.svelte"
    export let posts: App.RowData[]
    export let username: string
    export let displayName: string

    console.log(posts)
</script>

<div class="panel-medium">
    <PanelHeader>
        <a class="panel-header-link" href={`/user/${username}/now-playing-posts`}>
            {displayName}'s Now Playing posts
        </a>
    </PanelHeader>
    <div class="posts-spacing">
    {#each posts as post}
        <NowPlayingPost
            post={post}
            mode="feed"
        >
        </NowPlayingPost>
    {/each}
    </div>
    <div class="button-spacer">
        <button class="standard" on:click={() => goto(`/user/${username}/now-playing-posts`)}>
            see more
        </button>
    </div>
</div>

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
</style>
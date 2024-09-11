<script lang="ts">
	import { goto } from '$app/navigation'
    import PanelHeader from '$lib/components/PanelHeader.svelte' 
    import NowPlayingPost from './Posts/NowPlayingPost.svelte'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
    export let feedItems: App.RowData[]
</script>


<div class="feed-panel">
    <PanelHeader>
        <a class="panel-header-link" href="/feed">feed</a>
    </PanelHeader>
    {#if feedItems.length == 0}
        <p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections" >collections</a>.</p>
    {/if}
    {#each feedItems as item}
    <div class="feed-item">
        {#if Object.keys(item).includes( 'now_playing_post_id' )}
        <a href={`/posts/${item.username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
            <div class="feed-item-user-data">
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                {item.display_name}
                posted: 
            </div>
        </a>
        <div class="feed-item-row">
            <img class="feed-item-ornament" src={decoration} alt="decoration" />
            <div class="feed-item-now-playing">
                <NowPlayingPost
                    post={item}
                    mode="feed"
                ></NowPlayingPost>
            </div>
        </div>
        {:else if Object.keys(item).includes( 'comment_id' )}
            <a href={`/${item.original_poster_username}/now-playing/${item.original_post_date}#${item.username?.concat(item.created_at.valueOf().toString())}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} liked {item.original_poster_display_name}'s post
                </div>
            </a>
        {:else if Object.keys(item).includes( 'collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name}
                    followed a collection: 
                    <span class="feed-item-subject">
                        {item.title}
                    </span>
                </div>
            </a>
        {:else if Object.keys(item).includes( 'collection_edit_id' )}
            <div class="feed-item">
                <a href={`/collection/${item.collection_id}`}>
                    <div class="feed-item-one-liner">
                        <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                        {item.display_name}
                        edited the collection: 
                        <span class="feed-item-subject">
                            {item.title}
                        </span>
                    </div>
                </a>
            </div>
        {/if}
    </div>
    {/each}
    <div class="button-spacer">
        <button class="standard" on:click={() => goto('/feed')}>
            see more
        </button>
    </div>

</div>

<style>
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
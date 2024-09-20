<script lang="ts">
	import { goto } from '$app/navigation'
    import PanelHeader from '$lib/components/PanelHeader.svelte' 
    import NowPlayingPost from './Posts/NowPlayingPost.svelte'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    export let feedItems: App.RowData[]
</script>


<div class="feed-panel">
    <PanelHeader>
        <a class="panel-header-link" href="/feed">feed</a>
    </PanelHeader>
    {#if feedItems.length == 0}
    <div class="feed-item-one-liner">
        <p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections" >collections</a>.</p>
    </div>
       
    {:else}
    {#each feedItems as item}
    <div class="feed-item">
        {#if Object.keys(item).includes( 'now_playing_post_id' )}
        <a href={`/posts/${item.username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
            <div class="feed-item-user-data">
                <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                {item.display_name}
                posted: 
            </div>
        </a>
        <div class="feed-item-row">
            <img class="feed-item-ornament" src={decoration} alt="decoration" />
            <div class="feed-item-now-playing">
                <NowPlayingPost
                    post={item}
                    reactionActive={item.active}
                    mode="feed"
                ></NowPlayingPost>
            </div>
        </div>
        {:else if (Object.keys(item).includes( 'comment_id' ) && item.parent_post_id == null)}
            <a href={`/${item.original_poster_username}/now-playing/${item.original_post_date}#${item.username?.concat(item.created_at.valueOf().toString())}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} liked {item.original_poster_display_name}'s post
                </div>
            </a>
        {:else if Object.keys(item).includes( 'collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
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
                        <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                        {item.display_name}
                        edited the collection: 
                        <span class="feed-item-subject">
                            {item.title}
                        </span>
                    </div>
                </a>
            </div>
        {:else if Object.keys(item).includes( 'session_user_post_commenter_id' )}
            <a href={`/posts/${item.username}/now-playing/${item.post_created_at.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.session_user_post_commenter_avatar_url ?? wave} alt={`${item.session_user_post_commenter_display_name}'s avatar`} class="feed-avatar" />
                    {item.session_user_post_commenter_display_name}
                    commented on your post from {displayDate(item.post_created_at)}
                </div>
            </a>
        {:else if Object.keys(item).includes( 'session_user_post_commenter_id' )}
            <a href={`/posts/${item.username}/now-playing/${item.post_created_at.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.session_user_post_post_react_avatar_url ?? wave} alt={`${item.session_user_post_post_react_display_name}'s avatar`} class="feed-avatar" />
                    {item.session_user_post_post_reactr_display_name}
                    liked your post from {displayDate(item.post_created_at)}
                </div>
            </a>
        {/if}
    </div>
    {/each}
    <div class="button-spacer">
        <button class="standard" on:click={() => goto('/feed')}>
            see more
        </button>
    </div>
    {/if}
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
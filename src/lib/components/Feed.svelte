<script lang="ts">
    import { enhance } from '$app/forms'
    import { goto } from '$app/navigation'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    export let feedItems: App.RowData[]
    export let batchSize = 0
    export let batchIterator = 0
    export let timestampStart: Date | null = null
    export let timestampEnd: Date | null = null
    export let options: App.Lookup = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}
    export let mode: string // "full", "mini"
    export let remaining = 0

    function parseTimestamp ( itemTimestamp: Date ) {
        const timestampString = itemTimestamp.toISOString()
        const timestamp = Date.parse(timestampString).toString()
        return timestamp
    }
</script>

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<div class="feed-panel">
    <PanelHeader>
        feed
    </PanelHeader>
    {#if feedItems.length == 0}
    <div class="feed-item-one-liner">
        <p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections" >collections</a>.</p>
    </div>
    {/if}
    {#each feedItems as item}
    <div class="feed-item">
        <!-- User's or followed user's Now Playing post -->
        {#if Object.keys(item).includes( 'now_playing_post_id' )}      
            <a href={`/posts/${item.username}/now-playing/${parseTimestamp(item.feed_item_timestamp)}`}>
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
                        mode="feed"
                        reactionActive={item.active}
                    ></NowPlayingPost>
                </div>
            </div>
        <!-- Some user comment on user's post -->
        {:else if Object.keys(item).includes( 'session_user_post_commenter_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                    <img src={item.session_user_post_commenter_avatar_url ?? wave} alt={`${item.session_user_post_commenter_display_name}'s avatar`} class="feed-avatar" />
                    {item.session_user_post_commenter_display_name} commented on your post
                </div>
            </a>
       <!-- Some user reacted to user's post -->
       {:else if Object.keys(item).includes( 'session_user_post_react_user_id' )}
        <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.feed_item_timestamp)}`}>
            <div class="feed-item-one-liner">
                <img src={item.session_user_post_react_user_avatar_url} alt={`${item.session_user_post_react_user_display_name}'s avatar`} class="feed-avatar" />
                {item.session_user_post_react_user_display_name} liked your post
            </div>
        </a>
        <!-- User's comment on a post -->
        {:else if Object.keys(item).includes( 'session_user_comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    You commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Followed user's comment on another followed user's post -->
        {:else if Object.keys(item).includes( 'followed_user_comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Followed user reacted to another user's post -->
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.feed_item_timestamp)}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} liked {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Some user followed user's collection -->
            {:else if Object.keys(item).includes( 'session_user_owned_collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url ?? wave} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name}
                    followed your collection: 
                    <span class="feed-item-subject">
                        {item.title}
                    </span>
                </div>
            </a>
        <!-- Followed user followed a collection -->
        {:else if Object.keys(item).includes( 'followed_user_collection_follow_id' )}
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
        <!-- Followed user edited a collection -->
        {:else if Object.keys(item).includes( 'collection_edit_id' )}
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
        {/if}
        </div>
    {/each}
    <form method="POST" action="?/loadMore" use:enhance>
        <input
            type="hidden"
            name="feed-items"
            id="feed-items"
            value={JSON.stringify(feedItems)}
        />
        <input
            type="hidden"
            name="batch-size"
            id="batch-size"
            value={batchSize}
        />
        <input
            type="hidden"
            name="batch-iterator"
            id="batch-iterator"
            value={batchIterator}
        />
        <input
            type="hidden"
            name="timestamp-start"
            id="timestamp-start"
            value={timestampStart?.toISOString()}
        />
        <input
            type="hidden"
            name="timestamp-end"
            id="timestamp-end"
            value={timestampEnd?.toISOString()}
        />
        <input
            type="hidden"
            name="options"
            id="options"
            value={JSON.stringify(options)}
        />
        {#if remaining > 0}
            <button
                class="standard"
                formaction="?/loadMore"
            >
            load more
        </button>
        {/if}
    </form>
    {#if mode == 'mini'}
        <div class="button-spacer">
            <button class="standard" on:click={() => goto('/feed')}>
                see more
            </button>
        </div>
    {/if}
</div>



<style>
    form {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: var(--freq-height-spacer-half) auto;
    }
    button {
        margin: 0 auto;
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
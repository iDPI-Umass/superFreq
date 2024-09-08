<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import { enhance } from '$app/forms'
    import decoration from "$lib/assets/images/feed-item-decoration.svg";
	import PanelHeader from 'src/lib/components/PanelHeader.svelte';

    export let data: PageData
    export let form: ActionData
    let { feedData, remaining, totalRowCount, timestampStart, timestampEnd, batchSize, options } = data
    $: ({ feedData, remaining, totalRowCount, timestampStart, timestampEnd, batchSize, options } = data)

    const feedItems = feedData

    console.log(remaining, totalRowCount)
    console.log(options)
</script>

<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

{#if totalRowCount == 0}
<p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections" >collections</a>.</p>
{/if}



<div class="panel">
    <PanelHeader>
        feed
    </PanelHeader>
{#each (form?.feedItems ?? feedItems) as item}
        {#if Object.keys(item).includes( 'now_playing_post_id' )}
        <div class="feed-item">        
            <a href={`/posts/${item.username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <div class="feed-item-user-data">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name}
                    is Now Playing: 
                </div>
                <div class="feed-item-row">
                    <img class="decoration" src={decoration} alt="decoration" />
                    <div class="feed-item-now-playing">
    
                        <div class="feed-item-metadata">
                            <span class="feed-item-music-info">
                                {item.release_group_name ?? item.recording_name ?? item.episode_title} by {item.artist_name}
                            </span>
                        </div>
                        <p class="feed-item-text">
    
                            {item.text}
                        </p>
                    </div>
                </div>

            </a>
        </div>
        {:else if Object.keys(item).includes( 'comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} commented on {item.original_poster_display_name}'s post
                    <span class="feed-item-subject">
                        {item.title}
                    </span>
                </div>
            </a>
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <div class="feed-item-one-liner">
                    <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="feed-avatar" />
                    {item.display_name} liked {item.original_poster_display_name}'s post
                    <span class="feed-item-subject">
                        {item.title}
                    </span>
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

{/each}
</div>

<div class="feed-panel">
    <form method="POST" action="?/loadMore" use:enhance>
        <input
            type="hidden"
            name="feed-items"
            id="feed-items"
            value={JSON.stringify(form?.feedItems ?? feedItems)}
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
            value={form?.batchIterator ?? 0}
        />
        <input
            type="hidden"
            name="timestamp-start"
            id="timestamp-start"
            value={timestampStart.toISOString()}
        />
        <input
            type="hidden"
            name="timestamp-end"
            id="timestamp-end"
            value={timestampEnd.toISOString()}
        />
        <input
            type="hidden"
            name="options"
            id="options"
            value={JSON.stringify(options)}
        />
        {#if (form?.remaining ?? remaining) > 0}
            <button
                class="standard"
                formaction="?/loadMore"
            >
            load more
        </button>
        {/if}
    </form>
</div>

<style>
    .decoration {
        max-width: 30px;
        margin-top: -95px;
        margin-left: calc(var(--freq-spacing-x-large
        ) * 0.94);
    }
</style>
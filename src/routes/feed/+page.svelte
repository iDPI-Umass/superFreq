<script lang="ts">
    import type { PageData, ActionData } from './$types'

    export let data: PageData
    let { sessionUserId, firstBatch, timestampStart, timestampEnd, batchSize, options } = data
    $: ({ sessionUserId, firstBatch, timestampStart, timestampEnd, batchSize, options } = data)

    export let form: ActionData

    const { feedData, totalRowCount } =  firstBatch
    const feedItems = feedData
</script>

{#each feedItems as item}
    <div class="feed-item">
        {#if Object.keys(item).includes( 'now_playing_post_id' )}
            <a href={`/posts/${item.username}/now-playing/${item.feed_item_timestamp}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} />
                <p>{item.display_name} is now playing {item.release_group_name ?? item.recording_name ?? item.episode_title} by {item.artist_name}</p>
                <p>{item.text}</p>
            </a>
        {:else if Object.keys(item).includes( 'comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} />
                <p>{item.display_name} commented on {item.original_poster_display_name}'s post</p>
            </a>
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} />
                <p>{item.display_name} liked {item.original_poster_display_name}'s post</p>
            </a>
        {:else if Object.keys(item).includes( 'collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} />
                <p>{item.display_name} followed the collection {item.title}'s post</p>
            </a>
        {:else if Object.keys(item).includes( 'collection_edit_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} />
                <p>{item.display_name} edited the collection {item.title}'s post</p>
            </a>
        {/if}
    </div>
{/each}

{#if feedItems.length < totalRowCount}
    <form method="POST" action="?/fetchMoreData">
        <input
            type="hidden"
            name="session-user-id"
            id="session-user-id"
            value={sessionUserId}
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
            value={timestampStart}
        />
        <input
            type="hidden"
            name="timestamp-end"
            id="timestamp-end"
            value={timestampEnd}
        />
        <input
            type="hidden"
            name="timestamp-start"
            id="timestamp-start"
            value={options.toString()}
        />
    </form>
{/if}

<style>
    .feed-item {
        display: flex;
        flex-direction: row;
    }
    img {
        width: 50px;
    }
</style>
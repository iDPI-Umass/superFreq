<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import { enhance } from '$app/forms'

    export let data: PageData
    export let form: ActionData
    let { feedData, remaining, totalRowCount, timestampStart, timestampEnd, batchSize, options } = data
    $: ({ feedData, remaining, totalRowCount, timestampStart, timestampEnd, batchSize, options } = data)

    const feedItems = feedData

    console.log(remaining, totalRowCount)
    console.log(options)
</script>

{#each (form?.feedItems ?? feedItems) as item}
    <div class="post-panel">
        {#if Object.keys(item).includes( 'now_playing_post_id' )}
            <a href={`/posts/${item.username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="avatar" />
                <p><span class="display-name">{item.display_name}</span> is now playing {item.release_group_name ?? item.recording_name ?? item.episode_title} by {item.artist_name}</p>
                <div class="post-body">
                    <p>{item.text}</p>
                </div>
            </a>
        {:else if Object.keys(item).includes( 'comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="avatar"  />
                <p><span class="display-name">{item.display_name}</span> commented on {item.original_poster_display_name}'s post</p>
            </a>
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${item.feed_item_timestamp.toISOString()}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="avatar"  />
                <p><span class="display-name">{item.display_name}</span> liked {item.original_poster_display_name}'s post</p>
            </a>
        {:else if Object.keys(item).includes( 'collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="avatar"  />
                <p><span class="display-name">{item.display_name}</span> followed the collection "{item.title}""</p>
            </a>
        {:else if Object.keys(item).includes( 'collection_edit_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <img src={item.avatar_url} alt={`${item.display_name}'s avatar`} class="avatar"  />
                <p><span class="display-name">{item.display_name}</span> edited the collection "{item.title}"</p>
            </a>
        {/if}
    </div>
{/each}

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
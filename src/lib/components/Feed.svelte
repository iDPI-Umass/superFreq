<script lang="ts">
    import { enhance } from '$app/forms'
    import { goto } from '$app/navigation'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import CoverArtFallback from '$lib/components/CoverArtFallback.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        sessionUserId: string
        feedItems: App.RowData[]
        batchSize?: number
        batchIterator?: number
        timestampStart?: Date | null
        timestampEnd?: Date | null
        options: App.Lookup
        mode: string
        remaining?: number
    }

    let { 
        sessionUserId, 
        feedItems, 
        batchSize = 0,
        batchIterator = 0,
        timestampStart = null,
        timestampEnd = null,
        options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']},
        mode,
        remaining = 0
    }: ComponentProps = $props()

    function parseTimestamp ( itemTimestamp: Date ) {
        const timestampString = itemTimestamp.toISOString()
        const timestamp = Date.parse(timestampString).toString()
        return timestamp
    }
</script>

<svelte:options runes={true} />
<svelte:head>
	<title>
		Feed
	</title>
</svelte:head>

<div class="feed-panel">
    <PanelHeader>
        {#snippet headerText()}
            <span>
                feed
            </span>
        {/snippet}
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
                        <CoverArtFallback
                            imgUrl={item.avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    {item.user_id == sessionUserId ? 'You' : item.display_name}
                    posted: 
                </div>
            </a>
            <div class="feed-post-spacer">
                <!-- <img class="feed-item-ornament" src={decoration} alt="decoration" /> -->
                <div class="feed-item-now-playing">
                    <NowPlayingPost
                        sessionUserId={sessionUserId}
                        post={item}
                        mode="feed"
                    ></NowPlayingPost>
                </div>
            </div>
        <!-- Some user followed user -->
        {:else if Object.keys(item).includes( 'new_follow_id' )}
            <a href={`/user/${item.username}`}>
                <div class="feed-item-one-liner">
                        <CoverArtFallback
                            imgUrl={item.avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    {item.display_name} followed you
                </div>
            </a>
        <!-- Some user comment on user's post -->
        {:else if Object.keys(item).includes( 'session_user_post_commenter_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                        <CoverArtFallback
                            imgUrl={item.session_user_post_commenter_avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.session_user_post_commenter_display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    {item.session_user_post_commenter_display_name} commented on your post
                </div>
            </a>
       <!-- Some user reacted to user's post -->
       {:else if Object.keys(item).includes( 'session_user_post_react_user_id' )}
        <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.feed_item_timestamp)}`}>
            <div class="feed-item-one-liner">
                    <CoverArtFallback
                        imgUrl={item.session_user_post_react_user_avatar_url}
                        artistName={item.avatar_artist_name}
                        releaseGroupName={item.avatar_release_group_name}
                        altText={`${item.session_user_post_react_user_display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArtFallback>
                {item.session_user_post_react_user_display_name} liked your post
            </div>
        </a>
        <!-- User's comment on a post -->
        {:else if Object.keys(item).includes( 'session_user_comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                        <CoverArtFallback
                            imgUrl={item.avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    You commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Followed user's comment on another followed user's post -->
        {:else if Object.keys(item).includes( 'followed_user_comment_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}#${item.username?.concat(parseTimestamp(item.feed_item_timestamp))}`}>
                <div class="feed-item-one-liner">
                        <CoverArtFallback
                            imgUrl={item.avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    {item.display_name} commented on {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Followed user reacted to another user's post -->
        {:else if Object.keys(item).includes( 'reaction_id' )}
            <a href={`/posts/${item.original_poster_username}/now-playing/${parseTimestamp(item.original_post_created_at)}`}>
                <div class="feed-item-one-liner">
                        <CoverArtFallback
                            imgUrl={item.avatar_url}
                            artistName={item.avatar_artist_name}
                            releaseGroupName={item.avatar_release_group_name}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArtFallback>
                    {item.display_name} liked {item.original_poster_display_name}'s post
                </div>
            </a>
        <!-- Some user followed user's collection -->
            {:else if Object.keys(item).includes( 'session_user_owned_collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <CoverArtFallback
                        imgUrl={item.avatar_url}
                        artistName={item.avatar_artist_name}
                        releaseGroupName={item.avatar_release_group_name}
                        altText={`${item.display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArtFallback>
                    <span class="blurb">
                      {item.display_name}
                      followed your collection: 
                      <span class="feed-item-subject">
                          {item.title}
                      </span>
                    </span>
                </div>
            </a>
        <!-- Followed user followed a collection -->
        {:else if Object.keys(item).includes( 'followed_user_collection_follow_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <CoverArtFallback
                        imgUrl={item.avatar_url}
                        artistName={item.avatar_artist_name}
                        releaseGroupName={item.avatar_release_group_name}
                        altText={`${item.display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArtFallback>
                    <span class="blurb">
                      {item.display_name}
                      followed a collection: 
                      <span class="feed-item-subject">
                          {item.title}
                      </span>
                    </span>
                </div>
            </a>
        <!-- Followed user edited a collection -->
        {:else if Object.keys(item).includes( 'collection_edit_id' )}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <CoverArtFallback
                        imgUrl={item.avatar_url}
                        artistName={item.avatar_artist_name}
                        releaseGroupName={item.avatar_release_group_name}
                        altText={`${item.display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArtFallback>
                    <span class="blurb">
                      {item.display_name}
                      edited the collection: 
                      <span class="feed-item-subject">
                          {item.title}
                      </span>
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
            name="offset"
            id="offset"
            value={remaining}
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
            <button class="standard" onclick={() => goto('/feed')}>
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
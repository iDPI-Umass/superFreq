<script lang="ts">
    import { enhance } from '$app/forms'
    import { goto } from '$app/navigation'
    import { parseTimestamp } from '$lib/resources/parseData'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import CoverArt from 'src/lib/components/CoverArt.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        sessionUserId: string
        feedItems: App.RowData[]
        mode: string
        remaining?: number
        userActionSuccess?: boolean | null
        collections?: App.RowData[]
        showCollectionsListModal?: boolean
        showSaveSucessModal?: boolean
    }

    let { 
        sessionUserId, 
        feedItems, 
        mode,
        remaining,
        userActionSuccess = null,
        collections = [],
        showCollectionsListModal = $bindable(false),
        showSaveSucessModal = $bindable(false)
    }: ComponentProps = $props()

    function avatarItem ( item: App.RowData ) {
        const avatar = {
            'img_url': item.avatar_url,
            'last_fm_img_url': item.avatar_last_fm_img_url,
            'artist_name': item.avatar_artist_name,
            'release_group_name': item.avatar_release_group_name
        }
        return avatar
    }
</script>

<!-- <svelte:options runes={true} /> -->

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
        <!-- Now Playing post -->
        {#if item.item_type == 'now_playing_post'}      
            <a href={`/posts/${item.username}/now-playing/${parseTimestamp(item.timestamp)}`}>
                <div class="feed-item-user-data">
                        <CoverArt
                            item={avatarItem(item)}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArt>
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
                        userActionSuccess={userActionSuccess}
                        collections={collections}
                        bind:showCollectionsModal={showCollectionsListModal}
                        bind:showSaveSucessModal={showSaveSucessModal}
                    ></NowPlayingPost>
                </div>
            </div>
        <!-- Some user followed user -->
        {:else if item.item_type == 'social_follow' && item.target_user_id == sessionUserId}
            <a href={`/user/${item.username}`}>
                <div class="feed-item-one-liner">
                        <CoverArt
                            item={avatarItem(item)}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArt>
                    {item.display_name} followed you
                </div>
            </a>
        <!-- Comment -->
        {:else if item.item_type == 'comment'}
            <a href={`/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}#${item.username?.concat(parseTimestamp(item.timestamp))}`}>
                <div class="feed-item-one-liner">
                        <CoverArt
                            item={avatarItem(item)}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArt>
                    {item.user_id == sessionUserId ? 'You' : item.display_name} commented on {item.parent_post_user_id == sessionUserId ? 'your' : item.parent_post_display_name.concat(`'s`)} post
                </div>
            </a>
        <!-- Reaction -->
        {:else if item.item_type == 'reaction'}
            <a href={`/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}`}>
                <div class="feed-item-one-liner">
                        <CoverArt
                            item={avatarItem(item)}
                            altText={`${item.display_name}'s avatar`}
                            imgClass='feed-avatar'
                        ></CoverArt>
                    {item.user_id == sessionUserId ? 'You' : item.display_name} liked {item.parent_post_user_id == sessionUserId ? 'your' : item.parent_post_display_name.concat(`'s`)} post
                </div>
            </a>
        <!-- Collection follow -->
            {:else if item.item_type == 'collection_follow'}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <CoverArt
                        item={avatarItem(item)}
                        altText={`${item.display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArt>
                    <span class="blurb">
                      {item.user_id == sessionUserId ? 'You' : item.display_name}
                      followed {item.collection_owner_id == sessionUserId ? 'your' : 'a'} collection: 
                      <span class="feed-item-subject">
                          {item.collection_title}
                      </span>
                    </span>
                </div>
            </a>
        <!-- Collection edit -->
        {:else if item.item_type == 'collection_id' && !item.item_type.is_top_albums}
            <a href={`/collection/${item.collection_id}`}>
                <div class="feed-item-one-liner">
                    <CoverArt
                        item={avatarItem(item)}
                        altText={`${item.display_name}'s avatar`}
                        imgClass='feed-avatar'
                    ></CoverArt>
                    <span class="blurb">
                      {item.user_id == sessionUserId ? 'You' : item.display_name}
                      edited the collection: 
                      <span class="feed-item-subject">
                          {item.collection_}
                      </span>
                    </span>
                </div>
            </a>
        <!-- Top albums collection edit -->
        {:else if item.item_type == 'collection_edit' && item.item_type.is_top_albums}
        <a href={`/user/${item.username}`}>
            <div class="feed-item-one-liner">
                <CoverArt
                    item={avatarItem(item)}
                    altText={`${item.display_name}'s avatar`}
                    imgClass='feed-avatar'
                ></CoverArt>
                <span class="blurb">
                    {item.user_id == sessionUserId ? 'You' : item.display_name}
                    edited their 
                    <span class="feed-item-subject">
                        Top Albums
                    </span>     
                    collection
                </span>
            </div>
        </a>
        {/if}
        </div>
    {/each}
    <form method="POST" action="?/loadMore" use:enhance>
        {#if remaining && remaining > 0}
        <div class="button-spacer">
            <button
                class="standard"
                formaction="?/loadMore"
            >
                load more
            </button>
        </div>
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
        margin: var(--freq-spacing-x-small) auto;
    }
    .standard {
        margin: 0;
    }
</style>
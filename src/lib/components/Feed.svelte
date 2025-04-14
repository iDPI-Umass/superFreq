<script lang="ts">
    import { enhance } from '$app/forms'
    import { goto } from '$app/navigation'
    import { parseTimestamp } from '$lib/resources/parseData'
    import decoration from "$lib/assets/images/feed-item-decoration.svg"
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import NowPlayingPost from 'src/lib/components/posts/NowPlayingPost.svelte'
    import NowPlayingTag from 'src/lib/components/posts/NowPlayingTag.svelte'
    import CoverArt from '$lib/components/CoverArt.svelte'
    import OptionsMenu from '$lib/components/menus/OptionsMenu.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"
    import { feedData } from '$lib/resources/states.svelte'

    interface ComponentProps {
        sessionUserId: string
        feedItems: App.RowData[]
        mode: string
        remaining?: number
        postEditState?: boolean
        userActionSuccess?: boolean | null
        collections?: App.RowData[]
        showCollectionsListModal?: boolean
        showSaveSucessModal?: boolean
        showFilters?: boolean
    }

    let { 
        sessionUserId, 
        feedItems, 
        mode,
        remaining,
        postEditState,
        userActionSuccess = null,
        collections = [],
        showCollectionsListModal = $bindable(false),
        showSaveSucessModal = $bindable(false),
        showFilters = false
    }: ComponentProps = $props()

    function avatarItem ( item: App.RowData ) {
        const avatar = {
            'img_url': item.avatar_url,
            'last_fm_img_url': item.last_fm_avatar_url,
            'artist_name': item.avatar_artist_name,
            'release_group_name': item.avatar_release_group_name
        }
        return avatar
    }

    let loadingMore = $state(false)

    const optionsGroups = [{
        'legend': 'feed items',
        'category': 'feed_item_types',
        'items': [
            { 
                'id': 'posts',
                'value': 'now_playing_post'
            },
            {
                'id': 'comments',
                'value': 'comment',
            },
            {
                'id': 'likes',
                'value': 'reaction'
            },
            {
                'id': 'follows',
                'value': 'social_follow'
            },
            {
                'id': 'collection edits',
                'value': 'collection_edit'
            },
            {
                'id': 'collection follows',
                'value': 'collection_follow'
            },
        ]
    }]

    let selectedOptions = $state([])
    // $effect(() => {
    //     selectedOptions = feedData.selectedOptions
    //     console.log(feedData)
    // })
</script>

{#snippet feedItemTag( feedItem: App.RowData )} 
    {#if (feedItem.artist_name || feedItem.user_added_artist_name) && (feedItem.release_group_name || feedItem.user_added_release_group_name)}
        <div class="feed-item-two-liner-tag-row">
            <NowPlayingTag
                artistName={feedItem.artist_name ?? feedItem.user_added_artist_name}
                itemTitle={feedItem.release_group_name ?? feedItem.user_added_release_group_name}
                itemType='release_group'
            ></NowPlayingTag>
        </div>
    {:else if (feedItem.artist_name || feedItem.user_added_artist_name) && (feedItem.recording_name || feedItem.user_added_recording_name)}
        <div class="feed-item-two-liner-tag-row">
            <NowPlayingTag
                artistName={feedItem.artist_name ?? feedItem.user_added_artist_name}
                itemTitle={feedItem.recording_name ?? feedItem.user_added_recording_name}
                itemType='recording'
            ></NowPlayingTag>
        </div>
    {:else if (feedItem.artist_name || feedItem.user_added_artist_name) && feedItem.episode_title}
        <div class="feed-item-two-liner-tag-row">
            <NowPlayingTag
                artistName={feedItem.artist_name ?? feedItem.user_added_artist_name}
                itemTitle={feedItem.episode}
                itemType='episode'
            ></NowPlayingTag>
        </div>
    {/if}
{/snippet}

<div class="feed-panel">
    {#if showFilters}
        <PanelHeader>
            {#snippet headerText()}
                <span>
                    feed
                </span>
            {/snippet}
            {#snippet button()}
                <OptionsMenu
                    triggerText='filter'
                    optionsGroups={optionsGroups}
                    inputGroup='selected-options'
                ></OptionsMenu>
            {/snippet}
        </PanelHeader>
    {:else}
        <PanelHeader>
            {#snippet headerText()}
                <span>
                    feed
                </span>
            {/snippet}
        </PanelHeader>
    {/if}
        {#if feedItems.length == 0}
        <div class="feed-item-one-liner">
            <p>Nothing in your feed? Try following some more <a href="/users">users</a> and <a href="/collections" >collections</a>.</p>
        </div>
        {:else}
        {#each feedItems as item}
            <div class="feed-item">
                <!-- Now Playing post -->
                {#if item?.item_type == 'now_playing_post'}      
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
                                editState={postEditState}
                                userActionSuccess={userActionSuccess}
                                collections={collections}
                                bind:showCollectionsModal={showCollectionsListModal}
                                bind:showSaveSucessModal={showSaveSucessModal}
                            ></NowPlayingPost>
                        </div>
                    </div>
                <!-- Some user followed user -->
                {:else if item?.item_type == 'social_follow' && item?.target_user_id == sessionUserId}
                    <a href={`/user/${item.username}`}>
                        <div class="feed-item-one-liner">
                                <CoverArt
                                    item={avatarItem(item)}
                                    altText={`${item.display_name}'s avatar`}
                                    imgClass='feed-avatar'
                                ></CoverArt>
                            {item.display_name} followed you
                        </div>
                        {@render feedItemTag(item)}
                    </a>
                <!-- Comment -->
                {:else if item?.item_type == 'comment'}
                    <a href={`/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}#${item.username?.concat(parseTimestamp(item.timestamp))}`}>
                        <div class="feed-item">
                            <div class="feed-item-two-liner-user-row">
                                    <CoverArt
                                        item={avatarItem(item)}
                                        altText={`${item.display_name}'s avatar`}
                                        imgClass='feed-avatar'
                                    ></CoverArt>
                                {item.user_id == sessionUserId ? 'You' : item.display_name} commented on {item.parent_post_user_id == sessionUserId ? 'your' : item.parent_post_display_name.concat(`'s`)} post { (item.artist_name || item.user_added_artist_name) ? 'about' : ''}
                            </div>
                            {@render feedItemTag(item)}
                        </div>
                    </a>
                <!-- Reaction -->
                {:else if item?.item_type == 'reaction'}
                    <a href={ item.reaction_post_type == 'now_playing' ? `/posts/${item.reaction_post_username}/now-playing/${parseTimestamp(item.reaction_post_created_at)}` : `/posts/${item.parent_post_username}/now-playing/${parseTimestamp(item.parent_post_created_at)}#${item.reaction_post_username?.concat(parseTimestamp(item.reaction_post_created_at))}`}>
                        <div class="feed-item">
                            <div class="feed-item-two-liner-user-row">
                                <CoverArt
                                    item={avatarItem(item)}
                                    altText={`${item.display_name}'s avatar`}
                                    imgClass='feed-avatar'
                                ></CoverArt>

                                {item.user_id == sessionUserId ? 'You' : item.display_name} liked {item.reaction_post_user_id == sessionUserId ? 'your' : item.reaction_post_display_name.concat(`'s`)} { item.reaction_post_type == 'now_playing' ? 'post' : 'reply' } { (item.artist_name || item.user_added_artist_name) ? 'about' : ''}
                            </div>
                            {@render feedItemTag(item)}

                        </div>

                    </a>
                <!-- Collection follow -->
                {:else if item?.item_type == 'collection_follow' && ( item?.user_id != item?.collection_owner_id )}
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
                {:else if item?.item_type == 'collection_edit' && !item?.item_type.is_top_albums}
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
                                {item.collection_title}
                            </span>
                            </span>
                        </div>
                    </a>
                <!-- Top albums collection edit -->
                {:else if item?.item_type == 'collection_edit' && item?.item_type.is_top_albums}
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
                {:else if !item?.item_type}
                <span class="blank"></span>
                {/if}
                </div>
        {/each}
        {/if}
    <form method="POST" action="?/loadMore" use:enhance={(form) => {
        loadingMore = true
        return async ({ update }) => {
            await update()
            loadingMore = false
        }
    }}>
        {#if remaining && remaining > 0}
        <div class="button-spacer">
            <button
                class="standard"
                formaction="?/loadMore"
                disabled={loadingMore}
            >
                load more
            </button>
        </div>
        {/if}
    </form>
    {#if mode == 'mini'}
        <div class="button-spacer">
            <button class="standard" onclick={() => goto('/feed')} disabled={loadingMore}>
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
    span.blank {
        display: none;
    }
</style>

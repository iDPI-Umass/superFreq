<script lang="ts">
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import EditPostBody from 'src/lib/components/Posts/EditPostBody.svelte'
    import LikeReact from 'src/lib/components/Posts/LikeReact.svelte'
    import SaveToCollection from '$lib/components/SaveToCollection.svelte'
    import { displayDate, parseMarkdown } from '$lib/resources/parseData'
    import { interactionStates } from '$lib/resources/states.svelte'

    import Reply from '@lucide/svelte/icons/reply'
    import Link from '@lucide/svelte/icons/link-2'
	import ListenEmbed from 'src/lib/components/Posts/ListenEmbed.svelte'
    import NowPlayingTag from 'src/lib/components/Posts/NowPlayingTag.svelte'
    import CoverArt from '$lib/components/CoverArt.svelte'
    import InlineMarkdownText from '$lib/components/InlineMarkdownText.svelte'

    import wave from "$lib/assets/images/logo/freq-wave.svg"
	import { itemDate } from 'src/lib/resources/musicbrainz';

    interface ComponentProps {
        sessionUserId?: string | null
        post: any
        mode?: string | null
        userActionSuccess?: boolean | null
        collections?: App.RowData[]
        showCollectionsModal?: boolean
        showSaveSucessModal?: boolean
    }

    let {
        sessionUserId = null,
        post,
        mode = null, // valid values are null, "feed", and "sample"
        userActionSuccess,
        collections = [],
        showCollectionsModal = $bindable(false),
        showSaveSucessModal = $bindable(false)
    }: ComponentProps = $props()

    const permalinkTimestampString = (post?.created_at ?? post?.timestamp).toISOString()
    const permalinkTimestamp = Date.parse(permalinkTimestampString).toString()

    const permalink = `/posts/${post.username}/now-playing/${permalinkTimestamp}`

    const embedInfo = {
                'id': post?.embed_id,
                'source': post?.embed_source,
                'title': post?.release_group_name ?? post?.recording_name ?? post?.episode_title,
                'artist': post?.artist_name,
                'account': post?.embed_account,
                'url': post?.listen_url
            } as App.Embed

    let reactionActive = $derived(post?.reaction_user_ids ? post?.reaction_user_ids.includes(sessionUserId) : null) as boolean

    let reactionCount = $derived(post?.reaction_count) as number
    let postId = $derived(post?.id ?? post?.post_id) as string

    let avatarItem = {
        'img_url': post.avatar_url,
        'last_fm_img_url': post.last_fm_avatar_url,
        'artist_name': post.avatar_artist_name,
        'release_group_name': post.avatar_release_group_name
    }

    function postItemType( post: App.RowData ) {
        if ( ( post.release_group_name || post.user_added_release_group_name ) && !post.recording_name ) {
            return 'release_group' as string
        }
        else if ( post.recording_name || post.user_added_recording_name ) {
            return 'recording' as string
        }
        else if ( post.episode_title ) {
            return 'episode' as string
        }
        else { return '' as string}
    }

    const artistName = $derived(post.artist_name ?? post.user_added_artist_name) as string

    let editState = $state(false)

</script>

<!-- <svelte:options runes={true} /> -->

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <CoverArt
                    item={avatarItem}
                    altText={`${post.display_name}'s avatar: ${post.avatar_release_group_name} by ${post.avatar_artist_name}`}
                    imgClass="avatar"
                ></CoverArt>
                <div class="row-group-column">
                    <a href="/user/{post.username}">
                        <span class="display-name">
                            {post.display_name}
                        </span>
                    </a>
                    <a href={permalink}>
                        <span class="date" aria-label="permalink">
                            {displayDate(post.created_at ?? post.timestamp)}
                            <Link size="15" color=var(--freq-color-text-muted)></Link>
                        </span>
                    </a>
                </div>
            </div>
            <div class="row-group">
                {#if post.status === "edited"}
                    <span class="status-badge">
                        edited
                    </span>
                {/if}
            </div>
        </div>
        <div class="post-body">
            {#if artistName}
                <NowPlayingTag
                    artistName={artistName}
                    itemTitle={post.recording_name ?? post.user_added_recording_name ?? post.release_group_name ?? post.user_added_release_group_name ?? post.episode_title}
                    itemType={postItemType(post)}
                >
                </NowPlayingTag>
            {/if}
            {#if !editState}
                <InlineMarkdownText text={post.text}></InlineMarkdownText>
            {:else}
                <EditPostBody
                    postData={post}
                    bind:editState={editState}
                ></EditPostBody>
            {/if}
            <!-- {#if formData == true }
                <p>edited!</p>
            {:else if formData == false}
                <p>edit failed</p>
            {/if} -->
            {#if embedInfo?.id != null}
            <ListenEmbed
                embedInfo={embedInfo}
            ></ListenEmbed>
            {/if}
        </div>
        <div class="post-row">
            {#if mode != 'sample'}
                <div class="row-group-icons">
                    <LikeReact
                        postId={postId}
                        reactionActive={reactionActive}
                        reactionCount={reactionCount}
                    ></LikeReact>
                    {#if mode == "feed"}
                        <a href={permalink}>
                            <div class="row-group-icon-description">
                                {#if post.replies && post.replies.length > 0 && post.replies[0]}
                                    <span class="descriptor">
                                        {post.replies.length}
                                    </span>
                                    <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                                    <span class="descriptor">
                                        {post.replies.length >= 2 ? 'replies': 'reply'}
                                    </span>
                                {:else}
                                    <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                                    <span class="descriptor">
                                        reply
                                    </span>
                                {/if}
                            </div>
                        </a>
                    {/if}
                    {#if post.artist_mbid || post.user_added_metadata_id }
                        <SaveToCollection
                            bind:showCollectionsListModal={showCollectionsModal}
                            bind:showSuccessModal={showSaveSucessModal}
                            postId={postId}
                            collections={collections}
                        ></SaveToCollection>
                    {/if}
                </div>
                <div class="row-group-icon-description">
                    {#if post.user_id == sessionUserId }
                        <UserActionsMenu
                            mode='sessionUserPostMenu'
                            postId={post.id ?? post.now_playing_post_id ?? post.post_id}
                            bind:editState={editState}
                            success={userActionSuccess}
                        ></UserActionsMenu>
                    {:else if sessionUserId}
                        <UserActionsMenu
                            mode='postMenu'
                            postId={post.id ?? post.now_playing_post_id ?? post.post_id}
                            success={userActionSuccess}
                        ></UserActionsMenu>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>


<style>
    .box {
        border: var(--freq-border-panel);
    }
    .double-border {
        border-top: var(--freq-border-panel);
        border-bottom: var(--freq-border-panel);
        margin:  var(--freq-spacing-2x-small) 0;
    }
</style>
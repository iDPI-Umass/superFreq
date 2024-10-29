<script lang="ts">
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Reply from 'lucide-svelte/icons/reply'
    import Link from 'lucide-svelte/icons/link-2'
	import ListenEmbed from './ListenEmbed.svelte'
    import NowPlayingTag from './NowPlayingTag.svelte'
    import CoverArt from '../CoverArt.svelte'

    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        sessionUserId?: string | null
        post: any
        editState?: boolean
        mode?: string | null
        reactionActive?: boolean
        reactionCount?: number
        userActionSuccess?: boolean | null
    }

    let {
        sessionUserId = null,
        post,
        editState = $bindable(false),
        mode = null,
        reactionActive,
        reactionCount,
        userActionSuccess
    }: ComponentProps = $props()

    const permalinkTimestampString = (post?.created_at ?? post?.feed_item_timestamp).toISOString()
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

    function toggleEditState() {
        editState = !editState
    }
</script>

<svelte:options runes={true} />

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <CoverArt
                    imgUrl={post.avatar_url}
                    artistName={post.avatar_artist_name}
                    releaseGroupName={post.avatar_release_group_name}
                    altText={`${post.display_name}'s avatar`}
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
                            {displayDate(post.created_at ?? post.feed_item_timestamp)}
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
            <NowPlayingTag
                artistName={post.artist_name}
                itemTitle={post.recording_name ?? post.release_group_name ?? post.episode_title}
                itemType={post.item_type}
            >
            </NowPlayingTag>
            {#if !editState}
                <p>
                    {post.text}
                </p>
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
            <div class="row-group-icons">
                <LikeReact
                postId={post.id ?? post.now_playing_post_id}
                reactionActive={reactionActive as boolean}
                reactionCount={reactionCount as number}
                ></LikeReact>
                {#if mode == "feed"}
                    <a href={permalink}>
                        <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                        <span class="descriptor">
                            reply
                        </span>
                    </a>
                {/if}
            </div>
            <div class="row-group-icon-description">
                {#if post.user_id == sessionUserId }
                    <UserActionsMenu
                        mode='sessionUserPostMenu'
                        postId={post.id ?? post.now_playing_post_id}
                        bind:editState={editState}
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {:else if sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
                        postId={post.id ?? post.now_playing_post_id}
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {/if}
            </div>
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
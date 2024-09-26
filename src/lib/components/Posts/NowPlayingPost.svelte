<script lang="ts">
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Reply from 'lucide-svelte/icons/reply'
    import Link from 'lucide-svelte/icons/link-2'
    import Music from 'lucide-svelte/icons/music'
	import ListenEmbed from './ListenEmbed.svelte'

    import wave from "$lib/assets/images/logo/freq-wave.svg"
	import { parseISO } from 'date-fns';

    export let sessionUserId: string | null = null
    export let post: any
    export let reactionActive: boolean | null =  null
    export let editState: boolean | null | undefined = null
    export let mode: string | null = null
    export let userActionSuccess: boolean | null = null
    $: editState

    const permalinkTimestampString = (post?.created_at ?? post?.feed_item_timestamp).toISOString()
    const permalinkTimestamp = Date.parse(permalinkTimestampString).toString()

    const permalink = `/posts/${post.username}/now-playing/${permalinkTimestamp}`

    const embedInfo = {
                'id': post?.embed_id,
                'source': post?.embed_source,
                'title': post?.release_group_name ?? post?.recording_name ?? post?.episode_title,
                'artist': post?.artist_name,
                'account': post?.embed_account
            } as App.Embed

    function toggleEditState() {
        editState = !editState
    }
</script>

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <img class="avatar" src={post.avatar_url ?? wave} alt={`${post.display_name}'s avatar`}/>
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
            <span class="now-playing-text">
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
                {post.artist_name} • {post.recording_name ?? post.release_group_name ?? post.episode_title}
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
            </span>
            {#if !editState}
                <p class="post-text">
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
            <ListenEmbed
                embedInfo={embedInfo}
            ></ListenEmbed>
        </div>
        <div class="post-row">
            <div class="row-group-icons">
                <LikeReact
                postId={post.id ?? post.now_playing_post_id}
                reactionActive={reactionActive ?? post.reaction_active ?? false}
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
                        postId={post.id}
                        bind:editState={editState}
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {:else if sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
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
    .edit-submit-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
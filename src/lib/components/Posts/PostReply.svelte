<script lang="ts">
    import { slide } from 'svelte/transition'

    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Reply from 'lucide-svelte/icons/reply'
    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Link from 'lucide-svelte/icons/link-2'

    import { Collapsible } from "bits-ui"

    interface ComponentProps {
        reply: any
        sessionUserId?: string | null
        editState?: boolean
        userActionSuccess?: boolean | null
    }

    let {
        reply,
        sessionUserId,
        editState = $bindable(false),
        userActionSuccess = $bindable(null)
    }: ComponentProps = $props()

    let openState = $state() as boolean

    const originalPostTimestampString = reply?.original_post_date.toISOString()
    const originalPostTimestamp = Date.parse(originalPostTimestampString).toString()
    const permalinkTimestampString = reply?.created_at.toISOString()
    const permalinkTimestamp = Date.parse(permalinkTimestampString).toString()
    const permalink = `/posts/${reply.original_poster_username}/now-playing/${originalPostTimestamp}#${reply.username?.concat(permalinkTimestamp)}`

</script>

<svelte:options runes={true} />

<input 
    type="hidden"
    name="post-reply-id" 
    id="post-reply-id"
    form="delete"
    value={reply.id}
/>
<input 
    type="hidden"
    name="post-reply-id" 
    id="post-reply-id"
    form="flagPost"
    value={reply.id}
/>

<div class="comment-panel">    
    <div class="comment">
        <div class="comment-metadata">
            <div class="row-group-user-data">
                <img class="comment-avatar" src={reply.avatar_url} alt={`${reply.display_name}'s avatar`} />
                <div class="row-group-column">
                    <a href="/user/{reply.username}">
                        <span class="comment-display-name">
                            {reply.display_name}
                        </span>
                    </a>
                    <a href={permalink}>
                        <span class="date" aria-label="permalink">
                            {displayDate(reply.created_at)}
                            <Link size="15" color=var(--freq-color-text-muted)></Link>
                        </span>
                    </a>
                </div>

            </div>
            <div class="row-group">
                {#if reply.status === "edited"}
                    <span class="status-badge">edited</span>
                {/if}
            </div>
        </div>
        <p class="comment-text">
            {reply.text}
        </p>
        <div class="comment-reaction-row">
            <div class="row-group">
                <!-- <Collapsible.Root bind:open={openState}>
                    <Collapsible.Trigger>
                        <div class="row-group-icon-description">
                            <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                            <span class="descriptor">
                                reply
                            </span>
                        </div>
                    </Collapsible.Trigger>
                </Collapsible.Root> -->
                <!-- {#each reply.reactions as reaction}
                <div class="row-group-icon-description">
                    <LikeReact
                    postId={reply.id}
                    reactionActive={reply.reactionActive}
                    ></LikeReact>
                </div>
                {/each} -->
            </div>
            <div class="row-group-icon-description">
                {#if reply.user_id == sessionUserId }
                    <UserActionsMenu
                        mode='sessionUserPostMenu'
                        postId={reply.id}
                        bind:editState={editState}
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {:else if reply.user_id != sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {/if}
            </div>
        </div>
    </div>
    <Collapsible.Root open={openState}>
        <Collapsible.Content transition={slide}>
            <PostReplyEditor></PostReplyEditor>
        </Collapsible.Content>
    </Collapsible.Root>
</div>
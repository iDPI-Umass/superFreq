<script lang="ts">
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'

    import CoverArt from '$lib/components/CoverArt.svelte'
    import EditPostBody from 'src/lib/components/posts/EditPostBody.svelte'
    import PostReplyEditor from 'src/lib/components/posts/PostReplyEditor.svelte'
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import LikeReact from 'src/lib/components/posts/LikeReact.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import InlineMarkdownText from '$lib/components/InlineMarkdownText.svelte'
    import { displayDate, parseMarkdown } from '$lib/resources/parseData'

    import Reply from '@lucide/svelte/icons/reply'
    import Heart from '@lucide/svelte/icons/heart'
    import Flag from '@lucide/svelte/icons/flag'
    import Link from '@lucide/svelte/icons/link-2'

    import { parseTimestamp } from '$lib/resources/parseData'
    import { interactionStates, promiseStates } from '$lib/resources/states.svelte'

    import { Collapsible } from "bits-ui"

    interface ComponentProps {
        reply: any
        parentPost: any
        sessionUserId?: string | null
        editState?: boolean
        userActionSuccess?: boolean | null
    }

    let {
        reply,
        parentPost,
        sessionUserId,
        editState = $bindable(false),
        userActionSuccess = $bindable(null)
    }: ComponentProps = $props()

    let openState = $state() as boolean

    const reactionActive = $state( reply.reaction_user_ids.includes(sessionUserId) ? true : false )
    const reactionCount = $state( reply.reaction_count )

    const parentPostTimestampString = parentPost?.created_at.toISOString()
    const parentPostTimestamp = Date.parse(parentPostTimestampString).toString()
    const permalinkTimestampString = reply?.created_at.toISOString()
    const permalinkTimestamp = Date.parse(permalinkTimestampString).toString()
    const permalink = `/posts/${parentPost.username}/now-playing/${parentPostTimestamp}#${reply.username?.concat(permalinkTimestamp)}`

    onMount(() => {
        interactionStates.editState = false
        interactionStates.popOverOpenState = false
    })
</script>

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
<input
    type="hidden"
    name="parent-post-id"
    id="parent-post-id"
    form="delete"
    value={reply.parent_post_id}
/>
<input
    type="hidden"
    name="parent-post-timestamp"
    id="parent-post-timestamp"
    form="delete"
    value={parentPostTimestamp}
/>

<div class="comment-panel">    
    <div class="comment">
        <div class="comment-metadata">
            <div class="row-group-user-data">
                <CoverArt
                    item={reply}
                    altText={`${reply.display_name}'s avatar`}
                    imgClass="avatar"
                ></CoverArt>
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
        {#if !interactionStates.editState}
            <div class="comment-text">
                <InlineMarkdownText text={reply.text}></InlineMarkdownText>
            </div>
        {:else}
            <EditPostBody
                postData={reply}
            ></EditPostBody>
        {/if}
        <div class="comment-reaction-row">
            <div class="row-group">
                <div class="row-group-icons">
                    <LikeReact
                        postId={reply.id}
                        reactionActive={reactionActive}
                        reactionCount={reactionCount}
                    ></LikeReact>
                </div>
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
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {:else if reply.user_id != sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
                        postId={reply.id}
                        success={userActionSuccess}
                    ></UserActionsMenu>
                {/if}
            </div>
        </div>
    </div>
</div>
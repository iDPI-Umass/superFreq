<script lang="ts">
    import { onMount } from 'svelte'
    import { slide } from 'svelte/transition'

    import CoverArt from '$lib/components/CoverArt.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'
    import ReplyTag from '$lib/components/Posts/ReplyTag.svelte'
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
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
        allowReply?: boolean
        sessionUserId?: string | null
        userActionSuccess?: boolean | null
    }

    let {
        reply,
        allowReply = false,
        sessionUserId,
        userActionSuccess = $bindable(null)
    }: ComponentProps = $props()

    let openState = $state() as boolean

    const reactionActive = $state( reply.reaction_user_ids.includes(sessionUserId) ? true : false )
    const reactionCount = $state( reply.reaction_count )

    const replyCreatedAt = $state(reply?.created_at ?? reply?.timestamp) as Date
    const permalinkTimestampString = replyCreatedAt.toISOString() as string
    const permalinkTimestamp = Date.parse(permalinkTimestampString).toString() as string
 
    let permalinkRoot = $state('') as string
    let permalink = $derived(permalinkRoot.concat(`#${reply.username?.concat(permalinkTimestamp)}`)) as string

    const parentPostTimestampString = reply?.parent_post_created_at ? reply?.parent_post_created_at.toISOString() : null
    const parentPostTimestamp = Date.parse(parentPostTimestampString).toString() ?? null

    const parentCollectionId = reply.parent_collection_id


    if ( !reply.parent_collection_id ) {
        permalinkRoot = `/posts/${reply.parent_post_username}/now-playing/${parentPostTimestamp}`
    }
    else if ( reply.parent_collection_id ) {
        permalinkRoot = `/collection/${parentCollectionId}`
    }

    let replyToSlug = $state(null) as string | null

    if ( reply.reply_to ) {
        const replyToCreatedAt = reply?.reply_to_created_at ?? reply?.parent_post_created_at ?? null
        const replyToTimestampString = replyToCreatedAt?.toISOString() ?? null
        const replyToTimestamp = Date.parse(replyToTimestampString).toString()
        const replyToUsername = reply?.reply_to_username ?? reply?.parent_post_username ??null
        replyToSlug = `#${replyToUsername?.concat(replyToTimestamp)}`
    }

    let editState = $state(false)
    let showPostReplyEditor = $state(false)

    let isReplyToReply = $state( reply?.parent_post_id != reply?.reply_to ? true : false ) 

    onMount(() => {
        interactionStates.editState = false
        interactionStates.popOverOpenState = false
    })

</script>

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
<input
    type="hidden"
    name="reply-data"
    id="reply-data"
    form="submitReaction"
    value={JSON.stringify(reply)}
/>

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
                        {displayDate(replyCreatedAt)}
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
    <div class="comment-text">
        {#if isReplyToReply}
            <ReplyTag
                displayName={reply?.reply_to_display_name}
                createdAt={displayDate(reply?.reply_to_created_at)}
                permalinkRoot={permalinkRoot}
                replyToSlug={replyToSlug}
            ></ReplyTag>
        {/if}
        {#if !editState}
            
                <InlineMarkdownText text={reply.text}></InlineMarkdownText>
            
        {:else}
            <EditPostBody
                postData={reply}
                bind:editState={editState}
            ></EditPostBody>
        {/if}
    </div>
    <div class="comment-reaction-row">
        <div class="row-group">
            <div class="row-group-icons">
                <LikeReact
                    postId={reply.post_id ?? reply.id}
                    reactionActive={reactionActive}
                    reactionCount={reactionCount}
                ></LikeReact>
                {#if allowReply}
                    <button class="like" onclick={() => showPostReplyEditor = !showPostReplyEditor}>
                        <Reply class="icon" size="16" color="var(--freq-color-text-muted)"></Reply>
                        <span class="descriptor">
                            reply
                        </span>
                    </button>
                {/if}
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
                    postId={reply.post_id ?? reply.id}
                    bind:editState={editState}
                    success={userActionSuccess}
                ></UserActionsMenu>
            {:else if reply.user_id != sessionUserId}
                <UserActionsMenu
                    mode='postMenu'
                    postId={reply.post_id ?? reply.id}
                    success={userActionSuccess}
                ></UserActionsMenu>
            {/if}
        </div>
    </div>
</div>
{#if showPostReplyEditor}
    <PostReplyEditor
        reply={reply}
    ></PostReplyEditor>
{/if}
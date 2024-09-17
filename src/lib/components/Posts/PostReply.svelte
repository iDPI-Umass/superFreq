<script lang="ts">
    import { slide } from 'svelte/transition'

    import '$lib/styles/posts.css'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Reply from 'lucide-svelte/icons/reply'
    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Link from 'lucide-svelte/icons/link-2'

    import { Collapsible } from "bits-ui";

    export let reply: any
    export let sessionUserId: string
    export let editState = false

    let openState: boolean

    const permalink = `/posts/${reply.username}/now-playing/${reply.original_post_date.toISOString()}#${reply.username?.concat(reply.created_at.toISOString())}`

</script>

<div class="comment-panel">    
    <div class="comment">
        <div class="comment-metadata">
            <div class="row-group-user-data">
                <img class="comment-avatar" src={reply.avatar_url} alt={`${reply.display_name}'s avatar`} />
                <div class="row-group-column">
                    <a href="/posts/{reply.username}">
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
                    ></UserActionsMenu>
                {:else if reply.user_id != sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
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
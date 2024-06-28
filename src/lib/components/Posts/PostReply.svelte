<script lang="ts">
    import { slide } from 'svelte/transition'

    import '$lib/styles/posts.css'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'
    import PostMenuSessionUser from '$lib/components/Posts/PostMenuSessionUser.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'

    import Reply from 'lucide-svelte/icons/reply'
    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'

    import { Collapsible } from "bits-ui";

    export let reply: any
    export let sessionId: string
    export let reactions: any

    let openState: boolean
</script>

<div class="comment-panel">    
    <div class="comment">
        <div class="comment-metadata">
            <div class="row-group-user-data">
                <img class="comment-avatar" src={reply.avatar_url} alt={`${reply.display_name}'s avatar`} />
                <div class="row-group-column">
                    <span class="comment-display-name">
                        {reply.display_name}
                    </span>
                    <span class="comment-date">
                        {reply.created_at}
                    </span>
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
                <Collapsible.Root bind:open={openState}>
                    <Collapsible.Trigger>
                        <div class="row-group-icon-description">
                            <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                            <span class="descriptor">
                                reply
                            </span>
                        </div>
                    </Collapsible.Trigger>
                </Collapsible.Root>
                {#each reply.reactions as reaction}
                <div class="row-group-icon-description">
                    <LikeReact
                    reactionData={reaction}
                    ></LikeReact>
                </div>
                {/each}
            </div>
            <div class="row-group-icon-description">
                {#if reply.userId == sessionId }
                <PostMenuSessionUser></PostMenuSessionUser>
                {:else}
                    <Flag size="16" color="var(--freq-color-text-muted)"></Flag>
                    <span class="descriptor">
                        report
                    </span>
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
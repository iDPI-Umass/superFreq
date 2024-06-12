<script lang="ts">
    import { slide } from 'svelte/transition'
    
    import '$lib/styles/posts.css'
    import PostReplyEditor from '$lib/components/PostReplyEditor.svelte'

    import Reply from 'lucide-svelte/icons/reply'
    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    import { Popover, Collapsible } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts";

    export let replies: any
    export let sessionId: string
</script>

<div class="comment-panel">    
    {#each replies as reply}
        <div class="comment">
            <div class="comment-metadata">
                <div class="row-group-user-data">
                    <img class="comment-avatar" src={reply.avatarUrl} alt={`${reply.displayName}'s avatar`} />
                    <div class="row-group-column">
                        <span class="comment-display-name">
                            {reply.displayName}
                        </span>
                        <span class="comment-date">
                            {reply.createdAt}
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
                    <Collapsible.Root>
                        <Collapsible.Trigger>
                            <div class="row-group-icon-description">
                                <Reply size="16" color="var(--freq-color-text-muted)"></Reply>
                                <span class="descriptor">
                                    reply
                                </span>
                            </div>
                        </Collapsible.Trigger>
                        <Collapsible.Content transition={slide}>
                            <PostReplyEditor></PostReplyEditor>
                        </Collapsible.Content>
                    </Collapsible.Root>
                    {#each reply.reactions as reaction}
                    <div class="row-group-icon-description">
                        <Heart size="16" color="var(--freq-color-text-muted)"></Heart>
                        <span class="descriptor">
                            {reaction.count}
                        </span>
                    </div>
                    {/each}
                </div>
                <div class="row-group-icon-description">
                    {#if reply.userId == sessionId }
                    <Popover.Root>
                        <Popover.Trigger>
                            <Ellipsis size="16" color="var(--freq-color-text-muted)"></Ellipsis>
                        </Popover.Trigger>
                        <Popover.Content transition={flyAndScale}>
                            <div class="row-group-icon-description">
                                <PenLine size="16" color="var(--freq-color-text-muted)"></PenLine>
                                <span class="descriptor">
                                    edit
                                </span>
                            </div>
                            <div class="row-group-icon-description">
                                <Trash2 size="16" color="var(--freq-color-text-muted)"></Trash2>
                                <span class="descriptor">
                                    delete
                                </span>
                            </div>
                        </Popover.Content>
                    </Popover.Root>
                    {:else}
                        <Flag size="16" color="var(--freq-color-text-muted)"></Flag>
                        <span class="descriptor">
                            report
                        </span>
                    {/if}
                </div>
            </div>
        </div>
    {/each}
</div>
<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte';
    let username = "sug_umass"

    export let data: PageData
    let { session, post, replies, reactions } = data
    $: ({ session, post, replies, reactions } = data)

    const sessionId = session?.user.id as string

    const reactionCount = (reactions == null ) ? 0 : reactions[0]["total_reactions"]
</script>

<div class="post-panel">
    <NowPlayingPost
        sessionId={sessionId}
        postData={post}
        reactions={reactionCount} 
    ></NowPlayingPost>
    {#if session}
        <PostReplyEditor></PostReplyEditor>
        {#each replies as reply}
            <PostReply
                reply={reply}
                sessionId={sessionId}
                reactions={reactionCount}
            ></PostReply>
        {/each}
    {/if}
</div>
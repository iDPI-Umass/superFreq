<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte';
    let username = "sug_umass"

    export let data: PageData
    export let form: ActionData;
    let { session, post, replies, reactions } = data
    $: ({ session, post, replies, reactions } = data)

    const sessionUserId = session?.user.id as string
    const postId = post?.id as string

    const reactionCount = (reactions == null ) ? 0 : reactions[0]["total_reactions"]
</script>

<div class="post-panel">
    <form
        method="POST"
        action="?/flagPost"
    >
        <input 
            type="hidden"
            name="session-user-id" 
            id="session-user-id"
            value={sessionUserId}
        />
        <input 
            type="hidden"
            name="post-id" 
            id="post-id"
            value={postId}
        />
    </form>
    <NowPlayingPost
        sessionUserId={sessionUserId}
        postData={post}
        formData={form}
        editState={form?.editState ?? false}
        reactions={reactionCount} 
    ></NowPlayingPost>
    {#if session}
        <PostReplyEditor></PostReplyEditor>
        {#each replies as reply}
            <form
                method="POST"
                action="?/flagPost"
            >
                <input 
                    type="hidden"
                    name="session-user-id" 
                    id="session-user-id"
                    value={sessionUserId}
                />
                <input 
                    type="hidden"
                    name="post-id" 
                    id="post-id"
                    value={reply.id}
                />
            </form>
            <PostReply
                reply={reply}
                sessionUserId={sessionUserId}
                reactions={reactionCount}
            ></PostReply>
        {/each}
    {/if}
</div>
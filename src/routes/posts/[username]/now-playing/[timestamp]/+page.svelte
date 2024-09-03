<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte';
    let username = "sug_umass"

    export let data: PageData
    export let form: ActionData;
    let { sessionUserId, post, postReactionActive, replies, permission } = data
    $: ({ sessionUserId, post, postReactionActive, replies, permission } = data)

    const postId = post?.id as string
</script>

<div class="post-panel">
    {#if sessionUserId}
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="deletePost"
        value={postId}
    />
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="flagPost"
        value={postId}
    />
    <NowPlayingPost
        sessionUserId={sessionUserId}
        post={post}
        formData={form}
        editState={form?.editState ?? false}
        reactionActive={postReactionActive.active} 
    ></NowPlayingPost>
        <PostReplyEditor></PostReplyEditor>
        {#each replies as reply}
            <input 
                type="hidden"
                name="post-id" 
                id="post-id"
                form="deletePost"
                value={reply.id}
            />
            <input 
                type="hidden"
                name="post-id" 
                id="post-id"
                form="flagPost"
                value={reply.id}
            />
            <div id={reply.username?.concat(reply.created_at.valueOf().toString())}>
                <PostReply
                    reply={reply}
                    sessionUserId={sessionUserId}
                ></PostReply>
            </div>
        {/each}
    {/if}
</div>
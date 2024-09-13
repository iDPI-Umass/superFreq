<script lang="ts">
    import { goto } from '$app/navigation'
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte';

    export let data: PageData
    export let form: ActionData
    let { sessionUserId, post, postReactionActive } = data
    $: ({ sessionUserId, post, postReactionActive } = data)

    let replies = data?.replies as App.RowData[]
    $: replies

    const postId = post?.id as string
</script>

<svelte:head>
	<title>
		{post?.display_name}'s Now Playing Post
	</title>
</svelte:head>


<div class="post-panel">
    {#if sessionUserId}
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="submitReply"
        value={postId}
    />
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
        formData={form?.success ?? null}
        editState={form?.editState ?? false}
        reactionActive={postReactionActive ?? false} 
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
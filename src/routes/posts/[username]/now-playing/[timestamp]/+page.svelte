<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();
    let { post, postReactionActive } = $state(data)

    let sessionUserId = data?.sessionUserId as string

    let replies = $state(data?.replies as App.RowData[])

    const postId = post?.id as string

    function replyId ( username: string, createdAt: Date ) {
        const replyTimestampString = createdAt.toISOString()
        const replyTimestamp = Date.parse(replyTimestampString).toString()
        const slug = username?.concat(replyTimestamp)
        return slug
    }
</script>

<svelte:options runes={true} />

<svelte:head>
	<title>
		{post?.display_name}'s Now Playing post
	</title>
</svelte:head>


<div class="post-panel">
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="submitReply"
        value={postId}
    />
    <input 
        type="hidden"
        name="post-username" 
        id="post-username"
        form="submitReply"
        value={post?.username}
    />
    <input 
        type="hidden"
        name="post-created-at" 
        id="post-created-at"
        form="submitReply"
        value={post?.created_at.toISOString()}
    />
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="submitReaction"
        value={postId}
    />
    <input
        type="hidden"
        name="reaction-type"
        id="reaction-type"
        form="submitReaction"
        value="like"
    />
    <input
        type="hidden"
        name="post-username"
        id="post-username"
        form="submitReaction"
        value={post?.username}
    />
    <input
        type="hidden"
        name="post-created-at"
        id="post-created-at"
        form="submitReaction"
        value={post?.created_at.toISOString()}
    />
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form="delete"
        value={postId}
    />
    <input 
        type="hidden"
        name="post-username" 
        id="post-username"
        form="delete"
        value={post?.username}
    />
    <input 
        type="hidden"
        name="post-created-at" 
        id="post-created-at"
        form="delete"
        value={post?.created_at.toISOString()}
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
        editState={form?.editState ?? false}
    ></NowPlayingPost>
    <PostReplyEditor></PostReplyEditor>
    {#each replies as reply}
        <input 
            type="hidden"
            name="post-id" 
            id="post-id"
            form="delete"
            value={reply.id}
        />
        <input 
            type="hidden"
            name="post-id" 
            id="post-id"
            form="flagPost"
            value={reply.id}
        />
        <div id={ replyId( reply.username, reply.created_at )}>
            <PostReply
                reply={reply}
                sessionUserId={sessionUserId}
                userActionSuccess={form?.success}
            ></PostReply>
        </div>
    {/each}
</div>
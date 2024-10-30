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
    let { post, postReactionActive } = $derived(data)

    let sessionUserId = data?.sessionUserId as string

    let replies = $derived(data?.replies as App.RowData[])

    let actionSuccess = $derived(form?.success ?? null)

    const postId = $derived(post?.id) as string

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

{#snippet formInputs(formName: string)}
    <input 
        type="hidden"
        name="post-id" 
        id="post-id"
        form={formName}
        value={postId}
    />
    <input
        type="hidden"
        name="post-username"
        id="post-username"
        form={formName}
        value={post?.username}
    />
    <input
        type="hidden"
        name="post-created-at"
        id="post-created-at"
        form={formName}
        value={post?.created_at.toISOString()}
    />
    <input
        type="hidden"
        name="reaction-type"
        id="reaction-type"
        form="submitReaction"
        value="like"
    />
{/snippet}

<div class="post-panel">
    {@render formInputs("submitReply")}
    {@render formInputs("submitReaction")}
    {@render formInputs("delete")}
    {@render formInputs("flagPost")}
    <NowPlayingPost
        sessionUserId={sessionUserId}
        post={post}
        reactionActive={post?.reaction_active ?? false}
        reactionCount={post?.reaction_count ?? 0}
        editState={form?.editState ?? false}
        userActionSuccess={actionSuccess}
    ></NowPlayingPost>
    <PostReplyEditor></PostReplyEditor>
    {#each replies as reply}
        <div id={ replyId( reply.username, reply.created_at )}>
            <PostReply
                reply={reply}
                sessionUserId={sessionUserId}
                userActionSuccess={form?.success}
            ></PostReply>
        </div>
    {/each}
</div>
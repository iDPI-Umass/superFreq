<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import NowPlayingPost from '$lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from '$lib/components/Posts/PostReply.svelte'
    import PostReplyEditor from '$lib/components/Posts/PostReplyEditor.svelte'

    let { data, form } = $props();
    let { post, replies }: {
        post: App.RowData
        replies: App.RowData[]
    } = $derived(data)

    let sessionUserId = data?.sessionUserId as string

    let actionSuccess = $derived(form?.success as boolean)

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
        editState={form?.editState}
        userActionSuccess={actionSuccess}
    ></NowPlayingPost>
    <PostReplyEditor></PostReplyEditor>
    {#each replies as reply}
        <div id={ replyId( reply.username, reply.created_at )}>
            <PostReply
                reply={reply}
                sessionUserId={sessionUserId}
                userActionSuccess={actionSuccess}
            ></PostReply>
        </div>
    {/each}
</div>
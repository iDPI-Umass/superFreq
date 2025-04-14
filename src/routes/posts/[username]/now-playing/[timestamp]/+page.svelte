<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import SEO from '$lib/components/layout/SEO.svelte'
    import NowPlayingPost from 'src/lib/components/posts/NowPlayingPost.svelte'
    import PostReply from 'src/lib/components/posts/PostReply.svelte'
    import PostReplyEditor from 'src/lib/components/posts/PostReplyEditor.svelte'

    let { data, form } = $props();

    let { post, replies, collections, postTimestamp }: {
        post: App.RowData
        replies?: App.RowData[]
        collections?: App.RowData[]
        postTimestamp: string
    } = $derived(data)

    let sessionUserId = data?.sessionUserId as string

    let actionSuccess = $derived(form?.success as boolean)

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)

    function replyId ( username: string, createdAt: Date ) {
        const replyTimestampString = createdAt.toISOString()
        const replyTimestamp = Date.parse(replyTimestampString).toString()
        const slug = username?.concat(replyTimestamp)
        return slug
    }
</script>

<SEO title="{post?.display_name}'s Now Playing post"></SEO>

{#snippet formInputs(formName: string)}
    <input 
        type="hidden"
        name="post-id"
        id="post-id"
        form={formName}
        value={post?.id}
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
        form={formName}
        value={post?.username}
    />
    <input 
        type="hidden"
        name="post-timestamp"
        id="post-timestamp"
        form={formName}
        value={postTimestamp}
    />
{/snippet}

<div class="post-panel">
    {@render formInputs("submitReply")}
    {@render formInputs("submitReaction")}
    {@render formInputs("delete")}
    {@render formInputs("flagPost")}
    {#if post?.status != 'deleted'}
    <NowPlayingPost
        sessionUserId={sessionUserId}
        post={post}
        editState={form?.editState}
        userActionSuccess={actionSuccess}
        collections={collections}
        showCollectionsModal={showCollectionsListModal}
        showSaveSucessModal={showSaveSucessModal}
    ></NowPlayingPost>
    <PostReplyEditor></PostReplyEditor>
    {#each replies as reply}
        <div id={ replyId( reply.username, reply.created_at )}>
            <PostReply
                reply={reply}
                parentPost={post}
                sessionUserId={sessionUserId}
                userActionSuccess={actionSuccess}
            ></PostReply>
        </div>
    {/each}
    {:else}
    <div class="panel">
        <p>
            This post has been deleted.
        </p>
    </div>
    {/if}
</div>
<script lang="ts">
    import type { PageData, ActionData } from './$types'

    import SEO from '$lib/components/layout/SEO.svelte'
    import NowPlayingPost from 'src/lib/components/Posts/NowPlayingPost.svelte'
    import PostReply from 'src/lib/components/Posts/PostReply.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import RedirectModal from '$lib/components/modals/RedirectModal.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    interface Props {
        data: PageData;
        form: ActionData;
    }

    let { data, form }: Props = $props();

    let { posts, username, sessionUserId, sessionUserCollections } =  $state(data)

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)
</script>

<SEO title="{username}'s' Now Playing posts"></SEO>

<div class="panel-medium">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                {posts[0]['display_name']}'s Now Playing posts
            </span>
        {/snippet}
    </PanelHeader>
    <div class="posts-spacing">
    {#each posts as post}
        <input 
            type="hidden"
            name="post-id" 
            id="post-id"
            form="delete"
            value={post?.id}
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
            name="post-id" 
            id="post-id"
            form="flagPost"
            value={post?.id}
        />
        <input
            type="hidden"
            name="post-id"
            id="post-id"
            form="submitReaction"
            value={post?.id}
        />
        <input
            type="hidden"
            name="reaction-type"
            id="reaction-type"
            form="submitReaction"
            value="like"
        />
        <NowPlayingPost
            sessionUserId={sessionUserId}
            post={post}
            mode="feed"
            userActionSuccess={form?.success}
            collections={sessionUserCollections}
            showCollectionsModal={showCollectionsListModal}
            showSaveSucessModal={showSaveSucessModal}
        >
        </NowPlayingPost>
        <!-- {:else if post.type == "reply"}
        <PostReply
            reply={post}
            sessionUserId={sessionUserId}
        ></PostReply> -->
    {/each}
    </div>
</div>

{#if form?.success}
<NotificationModal
    showModal={form?.success}
>
    {#snippet headerText()}
        <span >
            success!
        </span>
    {/snippet}
</NotificationModal>
{/if}

<style>
    .posts-spacing {
        display: flex;
        flex-direction: column;
        padding: var(--freq-spacing-medium);
        gap: var(--freq-spacer-gap);
    }
</style>
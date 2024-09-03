<script lang="ts">
    import '$lib/styles/posts.css'
    import PostMenuSessionUser from 'src/lib/components/menus/PostMenuSessionUser.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Music from 'lucide-svelte/icons/music'

    export let sessionUserId: string | null = null
    export let post: any
    export let formData: boolean | null = null
    export let reactionActive: boolean | null =  null
    export let editState: boolean | null = null
    $: editState

    function toggleEditState() {
        editState = !editState
    }

</script>

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <img class="avatar" src={post.avatar_url} alt={`${post.display_name}'s avatar`}/>
                <div class="row-group-column">
                    <span class="display-name">
                        {post.display_name}
                    </span>
                    <span class="date">
                        {displayDate(post.created_at)}
                    </span>
                </div>
            </div>
            <div class="row-group">
                {#if post.status === "edited"}
                    <span class="status-badge">
                        edited
                    </span>
                {/if}
            </div>
        </div>
        <div class="post-body">
            <span class="now-playing-text">
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
                {post.artist_name} • {post.recording_name ?? post.release_group_name ?? post.episode_title}
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
            </span>
            {#if !editState}
                <p class="post-text">
                    {post.text}
                </p>
            {:else}
                <EditPostBody
                    postData={post}
                    bind:editState={editState}
                ></EditPostBody>
            {/if}
            {#if formData?.success == true }
                <p>edited!</p>
            {:else if formData?.success == false}
                <p>edit failed</p>
            {/if}
            <iframe title="bandcamp-embed" style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=7134529/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" seamless><a href="https://carlybarton.bandcamp.com/album/heart-scale">Heart Scale by Carly Barton</a></iframe>
        </div>
        <div class="post-row">
            <LikeReact
            postId={post.id}
            reactionCount={post.reaction_count}
            reactionActive={reactionActive}
            ></LikeReact>
            <div class="row-group-icon-description">
                {#if post.user_id == sessionUserId }
                    <UserActionsMenu
                        mode='sessionUserPostMenu'
                        bind:editState={editState}
                    ></UserActionsMenu>
                {:else if sessionUserId}
                    <UserActionsMenu
                        mode='postMenu'
                    ></UserActionsMenu>
                {/if}
            </div>
        </div>
    </div>
</div>


<style>
    .box {
        border: var(--freq-border-panel);
    }
    .double-border {
        border-top: var(--freq-border-panel);
        border-bottom: var(--freq-border-panel);
        margin:  var(--freq-spacing-2x-small) 0;
    }
    .edit-submit-options {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
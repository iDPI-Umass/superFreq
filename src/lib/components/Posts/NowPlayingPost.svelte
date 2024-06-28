<script lang="ts">
    import '$lib/styles/posts.css'
    import PostMenuSessionUser from '$lib/components/Posts/PostMenuSessionUser.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'
    import LikeReact from '$lib/components/Posts/LikeReact.svelte'
    import { displayDate } from '$lib/resources/parseData'

    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Music from 'lucide-svelte/icons/music'

    export let sessionId: string
    export let postData: App.NestedObject
    export let reactions: any = null


    let editState: boolean
    $: editState

    function toggleEditState() {
        editState = !editState
    }

</script>

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <img class="avatar" src={postData.avatar_url} alt={`${postData.display_name}'s avatar`}/>
                <div class="row-group-column">
                    <span class="display-name">
                        {postData.display_name}
                    </span>
                    <span class="date">
                        {displayDate(postData.created_at)}
                    </span>
                </div>
            </div>
            <div class="row-group">
                {#if postData.status === "edited"}
                    <span class="status-badge">
                        edited
                    </span>
                {/if}
            </div>
        </div>
        <div class="post-body">
            <span class="now-playing-text">
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
                {postData.artist_name} • {postData.recording_name ?? postData.release_group_name ?? postData.episode_title}
                <Music size="16" color="var(--freq-color-text-medium-dark)"></Music>
            </span>
            {#if !editState}
                <p class="post-text">
                    {postData.text}
                </p>
            {:else}
            <EditPostBody
                text={postData.text}
                bind:editState={editState}
            ></EditPostBody>
            {/if}
            <iframe title="bandcamp-embed" style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=7134529/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" seamless><a href="https://carlybarton.bandcamp.com/album/heart-scale">Heart Scale by Carly Barton</a></iframe>
        </div>
        <div class="post-row">
            <LikeReact
            reactionData={reactions}
            ></LikeReact>
            <div class="row-group-icon-description">
                {#if postData.userId == sessionId }
                <PostMenuSessionUser
                    bind:editState={editState}
                ></PostMenuSessionUser>
                {:else}
                    <Flag size="16" color="var(--freq-color-text-muted)"></Flag>
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
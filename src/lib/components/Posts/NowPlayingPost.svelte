<script lang="ts">
    import '$lib/styles/posts.css'
    import PostMenuSessionUser from '$lib/components/Posts/PostMenuSessionUser.svelte'
    import EditPostBody from '$lib/components/Posts/EditPostBody.svelte'

    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Music from 'lucide-svelte/icons/music'

    const sessionId = "userId"
    let editState: boolean
    $: editState

    function toggleEditState() {
        editState = !editState
    }

    const postData = {
        "postId": "123",
        "userId": "userId",
        "text": "this is a test post",
        "mbid": "mbid",
        "mbidType": "recording",
        "status": "edited",
        "createdAt": "June, 11 2024",
        "updatedAt": "June 11, 2024",
        "listenUrl": "url",
        "artistName": "Carly Barton",
        "recordingName": "Heart Scale"
    }

    const userData = {
        "userId": "userId",
        "displayName": "Sug",
        "avatarUrl": "https://ia801909.us.archive.org/7/items/mbid-39fe3778-362c-4762-89fc-c03235fd8117/mbid-39fe3778-362c-4762-89fc-c03235fd8117-4477004070.jpg"
    }

    const reactions = [
        {
            "type": "like",
            "count": 12
        }
    ]
</script>

<div class="box">
    <div class="double-border">
        <div class="post-row">
            <div class="row-group-user-data">
                <img class="avatar" src={userData.avatarUrl} alt={`${userData.displayName}'s avatar`}/>
                <div class="row-group-column">
                    <span class="display-name">
                        {userData.displayName}
                    </span>
                    <span class="date">
                        {postData.createdAt}
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
                {postData.artistName} • {postData.recordingName}
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
            <div class="row-group">
                {#each reactions as reaction}
                    <Heart size="16" color="var(--freq-color-text-muted)"></Heart>
                    <span>
                        {reaction.count}
                    </span>
                {/each}
            </div>
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
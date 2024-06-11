<script lang="ts">
	import PencilLine from 'lucide-svelte/icons/pencil-line'
    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'

    const postData = {
        "postId": "123",
        "userId": "userId",
        "text": "this is a test post",
        "mbid": "mbid",
        "mbidType": "recording",
        "status": "edited",
        "createdAt": "June, 11 2024",
        "updatedAt": "June 11, 2024",
        "listenUrl": "url"
    }

    const userData = {
        "userId": "userId",
        "displayName": "sug",
        "avatarUrl": "avatarUrl"
    }

    const reactions = [
        {
            "type": "like",
            "count": 12
        }
    ]
</script>

<div class="panel">
    <div class="post-metadata">
        <div class="metadata-cluster">
            <img src={userData.avatarUrl} alt={`${userData.displayName}'s avatar`} />
            <span>
                {userData.displayName}
            </span>
        </div>
        <div class="metadata-cluster">
            <span>
                {postData.createdAt}
            </span>
            {#if postData.status === "edited"}
                <span class="edited">
                    edited
                </span>
            {/if}
        </div>
    </div>
    <p>{postData.text}</p>
    <div>
        embed
    </div>
    <div class="reactions">
        <div class="reaction-cluster">
            {#each reactions as reaction}
            <Heart size="20" color="var(--freq-color-text-muted)"></Heart>
            <span>{reaction.count}</span>
            {/each}
        </div>
        <Flag size="20" color="var(--freq-color-text-muted)"></Flag>
    </div>
</div>

<style>
    .panel {
        max-width: calc( 0.5 * var(--freq-max-width-primary))
    }
    .post-metadata {
        display: flex;
        flex-direction: row;
        border-bottom: var(--freq-border-panel);
        padding: var(--freq-spacing-x-small);
        justify-content: space-between;
        align-items: center;
    }
    .metadata-cluster {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--freq-inline-gap);
        color: var(--freq-color-text-muted);
        font-size: var(--freq-font-size-small);
    }
    .edited {
        padding:  var(--freq-spacing-2x-small);
        color: var(--freq-color-text-medium);
        background-color: var(--freq-color-background-badge-alt);
        font-size: var(--freq-font-size-x-small);
        text-transform: lowercase;
        letter-spacing: var(--freq-letter-spacing-loose);
    }
    .reactions {
        display: flex;
        flex-direction: row;
        padding: var(--freq-spacing-x-small);
        border-top: var(--freq-border-panel);
        justify-content: space-between;
        align-items: center;
        color: var(--freq-color-text-muted);
        font-size: var(--freq-font-size-small);
    }
    .reaction-cluster {
        display: flex;
        flex-direction: row;
        gap: var(--freq-inline-gap);
        align-items: center;
    }
</style>
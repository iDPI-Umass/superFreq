<script lang="ts">
    import '$lib/styles/posts.css'

    import Heart from 'lucide-svelte/icons/heart'
    import Flag from 'lucide-svelte/icons/flag'
    import Music from 'lucide-svelte/icons/music'
    import Ellipsis from 'lucide-svelte/icons/ellipsis'
    import PenLine from 'lucide-svelte/icons/pen-line'
    import Trash2 from 'lucide-svelte/icons/trash-2'

    import { Popover } from "bits-ui";
    import { flyAndScale } from "$lib/utils/transitions.ts";

    const sessionId = "userId"

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
            <p class="post-text">
                {postData.text}
            </p>
            <!-- <hr /> -->
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
                <Popover.Root>
                    <Popover.Trigger>
                        <Ellipsis size="16" color="var(--freq-color-text-muted)"></Ellipsis>
                    </Popover.Trigger>
                    <Popover.Content transition={flyAndScale}>
                        <div class="row-group-icon-description">
                            <PenLine size="16" color="var(--freq-color-text-muted)"></PenLine>
                            <span class="descriptor">
                                edit
                            </span>
                        </div>
                        <div class="row-group-icon-description">
                            <Trash2 size="16" color="var(--freq-color-text-muted)"></Trash2>
                            <span class="descriptor">
                                delete
                            </span>
                        </div>
                    </Popover.Content>
                </Popover.Root>
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
</style>
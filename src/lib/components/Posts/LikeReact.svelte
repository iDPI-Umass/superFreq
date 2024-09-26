<script lang="ts">
    import { enhance } from '$app/forms'
    import Heart from 'lucide-svelte/icons/heart'

    export let postId: string
    export let reactionCount: number = 0
    export let reactionActive: boolean
</script>

<form 
    method="POST" 
    id="submitReaction"
    action="?/submitReaction" 
    use:enhance
>
    <input
        type="hidden"
        name="post-id"
        id="post-id"
        value={postId}
    />
    <input
        type="hidden"
        name="reaction-type"
        id="reaction-type"
        value="like"
    />
    <button class="like" formaction="?/submitReaction" on:click={() => { reactionActive = !reactionActive }}>
        <div class="row-group-icon-description">
            {#if reactionCount > 0}
                <span>
                    {reactionCount}
                </span>
            {/if}
            {#if !reactionActive}
                <Heart class="icon" size="16" color="var(--freq-color-text-muted)"></Heart>
                <span class="descriptor">
                    like
                </span>
            {:else}
                <Heart class="icon" size="16" color="var(--freq-color-text-muted)" fill="var(--freq-color-text-muted)"></Heart>
                <span class="descriptor">
                    liked
                </span>
            {/if}

        </div>
    </button>
</form>
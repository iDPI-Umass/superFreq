<script lang="ts">
    import { enhance } from '$app/forms'
    import Heart from '@lucide/svelte/icons/heart'

    interface ComponentProps {
        postId?: string
        collectionId?: string
        reactionCount?: number
        reactionActive: boolean
    }
    
    let {
        postId,
        collectionId,
        reactionCount = 0,
        reactionActive
    }: ComponentProps = $props()

    let reactionPromise = $state(false)
    let currentReactionActive = $state( reactionActive ) as boolean
    let currentReactionCount = $state( reactionCount ) as number
    
</script>

<!-- <svelte:options runes={true} /> -->

<form 
    method="POST" 
    id="submitReaction"
    action="?/submitReaction" 
    use:enhance
>
<!-- <form 
    method="POST" 
    id="submitReaction"
    action="?/submitReaction" 
    use:enhance={() => {
        reactionPromise = true
        currentReactionActive = !currentReactionActive
        currentReactionCount = currentReactionActive ? ( ++currentReactionCount ) : ( --currentReactionCount )
        return async ({ update }) => {
            await update()
            reactionPromise = false
        }}
    }
> -->
    <input
        type="hidden"
        name="post-id"
        id="post-id"
        value={postId}
    />
    <input
        type="hidden"
        name="collection-id"
        id="collection-id"
        value={collectionId}
    />
    <input
        type="hidden"
        name="reaction-type"
        id="reaction-type"
        value="like"
    />
    <button 
        class="like" 
        formaction="?/submitReaction"
        disabled={reactionPromise}
        onclick={() => {
            currentReactionActive = !currentReactionActive
            currentReactionCount = currentReactionActive ? ( ++currentReactionCount ) : ( --currentReactionCount )
        }}
    >
        <div class="row-group-icon-description">
            {#if currentReactionCount > 0 }
                <span>
                    {currentReactionCount}
                </span>
            {/if}
            {#if !currentReactionActive}
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
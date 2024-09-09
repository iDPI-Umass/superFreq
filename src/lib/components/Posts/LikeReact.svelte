<!-- 
 submitReaction action needs uses insertReaction and updateReaction from '$lib/resources/backend-calls/posts.ts'

 reactionData needs results from countReactions and getSessionUserReact
-->

<script lang="ts">
    import '$lib/styles/posts.css'
    import Heart from 'lucide-svelte/icons/heart'

    export let postId: string
    // export let reactionCount: number 
    export let reactionActive: boolean
</script>

<form method="POST" action="?/submitReaction">
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
    <button class="like" formaction="?/submitReaction">
        <div class="row-group-icon-description">
            {#if !reactionActive}
                <Heart class="icon" size="16" color="var(--freq-color-text-muted)"></Heart>
            {:else}
                <Heart class="icon" size="16" color="var(--freq-color-text-muted)" fill="var(--freq-color-text-muted)"></Heart>
            {/if}
            <span class="descriptor">
                like
            </span>
        </div>
        <!-- <span>
            {reactionCount ?? 0}
        </span> -->
    </button>
</form>
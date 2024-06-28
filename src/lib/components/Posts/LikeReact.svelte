<!-- 
 submitReaction action needs uses insertReaction and updateReaction from '$lib/resources/backend-calls/posts.ts'

 reactionData needs results from countReactions and getSessionUserReact
-->

<script lang="ts">
    import '$lib/styles/posts.css'
    import Heart from 'lucide-svelte/icons/heart'

    export let reactionData: any

    let reactionStatus: boolean | null = reactionData?.active
</script>

<form method="POST" name="like-reaction" action="?/submitReaction">
    <button class="like">
        {#if !reactionStatus}
            <Heart class="icon" size="16" color="var(--freq-color-text-muted)"></Heart>
        {:else}
            <Heart class="icon" size="16" color="var(--freq-color-text-muted)" fill="var(--freq-color-text-muted)"></Heart>
        {/if}
        <span>
            {reactionData.count ?? 0}
        </span>
    </button>
</form>
<script lang="ts">
    import Reply from '@lucide/svelte/icons/reply'

    interface ComponentProps {
        displayName: string
        createdAt: string | null
        permalinkRoot: string
        replyToSlug: string | null
    }
    
    let {
        displayName,
        createdAt,
        permalinkRoot,
        replyToSlug
    }: ComponentProps = $props()
</script>
<!-- <svelte:options runes={true} /> -->

<a href={permalinkRoot.concat(replyToSlug as string)}>
    <span 
        class="now-playing-text"
        aria-details="Replied to {displayName} ({createdAt})"
    >
        <Reply size="16" color="var(--freq-color-text-medium-dark)"></Reply>
        Replied to {displayName} ({createdAt})
    </span>
</a>

<style>
    .now-playing-text {
        margin-top: var(--freq-height-spacer-half);
    }
</style>
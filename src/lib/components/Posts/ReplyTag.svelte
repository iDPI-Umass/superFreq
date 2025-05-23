<script lang="ts">
    import Reply from '@lucide/svelte/icons/reply'

    interface ComponentProps {
        displayName: string
        createdAt: string
        replyToSlug: string
    }
    
    let {
        displayName,
        createdAt,
        replyToSlug
    }: ComponentProps = $props()
</script>
<!-- <svelte:options runes={true} /> -->

<a href={replyToSlug}>
    <span 
        class="now-playing-text"
        aria-details="Replied to {displayName} ({createdAt})"
    >
        <Reply size="16" color="var(--freq-color-text-medium-dark)"></Reply>
        Replied to {displayName} ({createdAt})
    </span>
</a>


<script lang="ts">
    import Feed from '$lib/components/Feed.svelte'

    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { sessionUserId, feedItems } : { sessionUserId: string, feedData: any } = $derived(data)
</script>

<Feed
    sessionUserId={sessionUserId}
    feedItems={feedItems}
    mode="feed"
></Feed>
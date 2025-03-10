<script lang="ts">
    import SEO from '$lib/components/layout/SEO.svelte'
    import Feed from '$lib/components/Feed.svelte'

    let { data, form } = $props()
    let { sessionUserId, feedItems, remaining, sessionUserCollections } = $derived(data)

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)
</script>

<!-- <svelte:options runes={true} /> -->

<SEO title="Universal feed"></SEO>

<Feed
    sessionUserId={sessionUserId}
    feedItems={feedItems}
    mode="feed"
    remaining={remaining}
    collections={sessionUserCollections}
    showCollectionsListModal={showCollectionsListModal}
    showSaveSucessModal={showSaveSucessModal}
></Feed>
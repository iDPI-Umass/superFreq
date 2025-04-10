<script lang="ts">
    import { setContext } from 'svelte'
    import SEO from '$lib/components/layout/SEO.svelte'
    import Feed from '$lib/components/Feed.svelte'
    import { feedData } from '$lib/resources/states.svelte'

    let { data, form } = $props()
    let { sessionUserId, feedItems, selectedOptions, remaining, sessionUserCollections } = $derived(data)

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)

    feedData.selectedOptions = data.selectedOptions
    
    $effect(() => {
        feedData.selectedOptions = selectedOptions
        feedData.feedItems = feedItems
    })

</script>

<SEO title="Feed"></SEO>

<Feed
    sessionUserId={sessionUserId}
    mode="feed"
    feedItems={feedData.feedItems}
    userActionSuccess={form?.userActionSuccess}
    remaining={remaining}
    collections={sessionUserCollections}
    showCollectionsListModal={showCollectionsListModal}
    showSaveSucessModal={showSaveSucessModal}
></Feed>
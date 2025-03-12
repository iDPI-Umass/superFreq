<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { Toolbar } from "bits-ui"
    import { Select } from "bits-ui"
    import ChevronDown from '@lucide/svelte/icons/chevron-down'
    import LayoutGrid from '@lucide/svelte/icons/layout-grid'
    import AlignJustify from '@lucide/svelte/icons/align-justify'

    import SEO from '$lib/components/layout/SEO.svelte'
    import GridList from "$lib/components/GridList.svelte"
    import InfoBox from '$lib/components/InfoBox.svelte'
    import InlineMarkdownText from '$lib/components/InlineMarkdownText.svelte'
	import { tick } from 'svelte'

    // import { insertCollectionFollow, updateCollectionFollow } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions';


    let { data } = $props();
    let { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData, infoBoxText } = $derived(data);


    const collectionType = $derived(collectionInfo?.type as string)
    const collectionStatus = $derived(collectionInfo?.status as string)
    const collectionUpdatedAt = $derived(collectionInfo?.updated_at as Date)

    let gridListSelect = $state("grid")

    let selected = $state('sort order') as any

    const categories: App.Lookup = {
        "artists": "artists",
        "release_groups": "albums",
        "recordings": "tracks"
    }

    const updatedAt = $derived(new Date(collectionUpdatedAt).toLocaleDateString())

    const sortOptions = ['default', 'reverse', 'artist A --> Z', 'artist Z --> A'] as any

    console.log(collectionInfo)
    let sortOption = $derived(collectionInfo.default_view_sort ?? 'default') as string

    let sortedItems = $state()

    function sort ( option: string ) {
        const items = collectionContents
        if ( option == "default" ) {
            items.sort((a, b) => a.item_position - b.item_position)
        }
        else if ( option == "reverse" ) {
            items.sort((a, b) => b.item_position - a.item_position)
        }
        else if ( option == "artist A --> Z" || option == "artist_asc" ) {
            items.sort((a, b) => {
                const nameA = a.artist_name.toUpperCase()
                const nameB = b.artist_name.toUpperCase()
                if (nameA < nameB) {
                    return -1
                }
                if (nameA > nameB) {
                    return 1
                }
                return 0
            })
        }
        else if ( option == "artist Z --> A" || option == "artist_desc" ) {
            items.sort((a, b) => {
                const nameA = a.artist_name.toUpperCase()
                const nameB = b.artist_name.toUpperCase()
                if (nameA < nameB) {
                    return 1
                }
                if (nameA > nameB) {
                    return -1
                }
                return 0
            })
        }
        else {
            return items
        }

        return items
    }

    $effect(() => {
        sortedItems =  sort(sortOption)
    })

    

</script>

<!-- <svelte:options runes={true} /> -->
<svelte:head>
	<title>
		{collectionInfo?.title}
	</title>
</svelte:head>
<SEO title={collectionInfo?.title}></SEO>


<div class="two-column">
    <div class="collection-container">
        <div class="collection-info">
                <div class="collection-info-row">
                    <h1>{collectionInfo?.title}</h1>
                    <div class="buttons-group">
                        {#if 
                            sessionUserId && ( sessionUserId != collectionInfo?.owner_id )}
                            <form
                                method="POST"
                                action="?/followCollection"
                            >
                                <input 
                                    type="hidden"
                                    name="collection-id" 
                                    id="collection-id"
                                    value={collectionId}
                                />
                                <button 
                                    class="standard" 
                                    formaction="?/followCollection"
                                >
                                {#if followData && followData['follows_now'] == true}
                                    unfollow
                                {:else}
                                    + follow
                                {/if}
                                </button>
                            </form>
                        {/if}
                        {#if sessionUserId && editPermission}
                            <button 
                                class="standard"
                                onclick={() => goto($page.url.pathname + '/edit')}
                            >
                            edit
                            </button>
                        {/if}
                    </div>
                </div>
            <div class="collection-info-row">
                <div class="collection-info-attribution">
                    <p class="collection-info-text">
                        Collection by 
                        <a href="/user/{collectionInfo?.username}">
                            {collectionInfo?.display_name}
                        </a>
                    </p>
                    <p class="collection-date-text">Last updated on {updatedAt}</p>
                </div>
                {#if collectionInfo?.status != 'public'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionStatus]}
                </InfoBox>
                {/if}
            </div>
            <div class="collection-description-text">
                <InlineMarkdownText text={collectionInfo?.description_text}></InlineMarkdownText>
            </div>
        </div>

        <div class="sort">
            <div class="sort-column">
                <Select.Root type="single" bind:value={selected}>
                    <Select.Trigger class="sort-options">
                        <span class="trigger-label">  
                            {selected ?? 'sort order'}
                        </span>
                        <span class="chevron">
                            <ChevronDown size={16}></ChevronDown>
                        </span>
                    </Select.Trigger>
                    <Select.Portal>
                        <Select.Content>
                            {#each sortOptions as option}
                            <Select.Item value={option} label={option}>
                                {option}
                            </Select.Item>
                            {/each}
                        </Select.Content>
                    </Select.Portal>
                </Select.Root>
            </div>
            <div class="sort-column">
                <Toolbar.Root>
                    <Toolbar.Group
                        bind:value={gridListSelect}
                        type="single"
                    >
                        <Toolbar.GroupItem
                            aria-label="grid"
                            value="grid"
                        >
                            <div class="toolbar-icon">
                                <LayoutGrid size={20}></LayoutGrid>
                            </div>
                        </Toolbar.GroupItem>
                        <Toolbar.GroupItem
                            aria-label="list"
                            value="list"
                        >
                            <div class="toolbar-icon">
                                <AlignJustify size={20}></AlignJustify>
                            </div>
                        </Toolbar.GroupItem>
                    </Toolbar.Group>
                </Toolbar.Root>
                <span class="view-mode">view mode: {gridListSelect}</span>
            </div>
        </div>
        <GridList
            collectionContents={sortedItems}
            collectionReturned={viewPermission}
            collectionType={collectionType}
            collectionStatus={collectionStatus}
            layout={gridListSelect}
            mode="view"
        >
        </GridList>
    </div>
</div>

<style>
    span.view-mode {
        padding-top: 0;
        margin-top: 0;
    }
</style>

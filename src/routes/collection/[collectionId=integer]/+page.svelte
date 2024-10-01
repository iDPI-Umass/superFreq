<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { Toolbar } from "bits-ui"
    import LayoutGrid from 'lucide-svelte/icons/layout-grid'
    import AlignJustify from 'lucide-svelte/icons/align-justify'

    import GridList from "$lib/components/GridList.svelte";
    import InfoBox from '$lib/components/InfoBox.svelte'

	import type { PageData } from './$types';
    // import { insertCollectionFollow, updateCollectionFollow } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions';
	
	export let data: PageData;
    let { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData, infoBoxText } = data;
    $: ({ sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData, infoBoxText } = data);

    const collectionType = collectionInfo?.type as string
    const collectionUpdatedAt = collectionInfo?.updated_at as Date

    let gridListSelect = "grid"

    const categories: App.Lookup = {
        "artists": "artists",
        "release_groups": "albums",
        "recordings": "tracks"
    }

    
    const updatedAt = new Date(collectionUpdatedAt).toLocaleDateString()

    const collectionStatus = collectionInfo?.status as string

</script>

<svelte:head>
	<title>
		{collectionInfo?.title}
	</title>
</svelte:head>


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
                                on:click|preventDefault={() => goto($page.url.pathname + '/edit')}
                            >
                            edit
                            </button>
                        {/if}
                    </div>
                </div>
            <div class="collection-info-row">
                <div class="collection-info-attribution">
                    <p class="collection-info-text">
                        Collection of {categories[collectionType]} by 
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
            <p class="collection-description-text">{collectionInfo?.description_text ?? ''}</p>
        </div>

        <div class="sort">
            <p> sorting options </p>
            <div class="sort-column">
                <Toolbar.Root>
                    <Toolbar.Group
                        bind:value={gridListSelect}
                        type="single"
                    >
                        <Toolbar.GroupItem
                            aria-label="grid"
                            value="grid"
                            class="toolbar-item"
                        >
                            <LayoutGrid class="grid-list-icon"></LayoutGrid>
                        </Toolbar.GroupItem>
                        <Toolbar.GroupItem
                        aria-label="list"
                        value="list"
                        class="toolbar-item"
                        >
                            <AlignJustify class="grid-list-icon"></AlignJustify>
                        </Toolbar.GroupItem>
                    </Toolbar.Group>
                </Toolbar.Root>
                <span>sort mode: {gridListSelect}</span>
            </div>
        </div>
        <GridList
            collectionContents={collectionContents}
            collectionReturned={viewPermission}
            collectionType={collectionType}
            layout={gridListSelect}
            mode="view"
        >
        </GridList>

    </div>
</div>
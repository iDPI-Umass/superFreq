<script lang="ts">
    import { goto } from '$app/navigation'
    import { page } from '$app/stores'
    
    import { Toolbar } from "bits-ui"
    import LayoutGrid from 'lucide-svelte/icons/layout-grid'
    import AlignJustify from 'lucide-svelte/icons/align-justify'

    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"
    import GridList from "$lib/components/GridList.svelte";

	import type { PageData } from './$types';
    // import { insertCollectionFollow, updateCollectionFollow } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions';
	
	export let data: PageData;
    let { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data;
    $: ({ sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData } = data);

    const collectionType = collectionInfo?.type as string
    const collectionUpdatedAt = collectionInfo?.updated_at as Date

    let gridListSelect = "grid"

    const categories: App.Lookup = {
        "artists": "artists",
        "release_groups": "albums",
        "recordings": "tracks"
    }

    
    const updatedAt = new Date(collectionUpdatedAt).toLocaleDateString()

</script>

<svelte:head>
	<title>
		{collectionInfo?.title}
	</title>
</svelte:head>


<body>
    <div class="collection-container">
        <div class="collection-info">
            <div class="collection-metadata">
                <div class="collection-title-follow-top-row">
                    <h1>{collectionInfo?.title}</h1>
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
            <div class="frontmatter blurb-formatting">
                <p class="frontmatter-info-text">
                    Collection of {categories[collectionType]} by 
                    <a href="/user/{collectionInfo?.username}">
                        {collectionInfo?.display_name}
                    </a>
                </p>
                <p class="frontmatter-date-text">Last updated on {updatedAt}</p>
                {#if collectionInfo?.description_text}
                    <p>{collectionInfo?.description_text}</p>
                {/if}
            </div>
        </div>

        <div class="sort">
            <p> sorting options </p>
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
            <p>{gridListSelect}</p>
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
</body>

<style>
    .collection-container {
        max-width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: var(--freq-border-panel);
    }
    .collection-info {
        display: flex;
        flex-direction: column;
        padding: var(--freq-width-spacer-half);
    }
    .collection-metadata * {
        margin: var(--freq-spacing-x-small) 0;
    }
    .collection-title-follow-top-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 2vw;
    }
    .sort {
        display: flex;
        flex-direction: row;
        width: inherit;
        padding: 0 var(--freq-width-spacer-half);
        border-top: 1px solid var(--freq-color-background-badge);
        border-bottom: 1px solid var(--freq-color-background-badge);
        align-items: center;
    }
    .sort * {
        padding: var(--freq-spacing-2x-small) var(--freq-spacing-small);
    }
</style>
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
    let { sessionUserId, collectionId, collectionInfo, collectionContents, collectionSocialGraph, permission, followData } = data;
    $: ({ sessionUserId, collectionId, collectionInfo, collectionContents, collectionSocialGraph, permission, followData } = data);

    const collectionType = collectionInfo?.type as string
    const collectionUpdatedAt = collectionInfo?.updated_at as Date

    let gridListSelect = "grid"

    const categories: App.Lookup = {
        "artists": "artists",
        "release_groups": "albums",
        "recording": "tracks"
    }

    
    const updatedAt = new Date(collectionUpdatedAt).toLocaleDateString()

    function editPermission(sessionUserId: string, collectionInfo: any, collectionSocialGraph: any) {
        if ( collectionInfo.owner_id == sessionUserId) {
            return true
        }
        else {
            for (const row of collectionSocialGraph) {
                if ( row.user_id == sessionUserId ) {
                    return true
                }
            }
            return false
        }
    }
</script>

<body>
    <div class="collection-container">
        <div class="collection-info">
            <div class="collection-metadata">
                <div class="collection-title-follow-top-row">
                    <h1>{collectionInfo?.title}</h1>
                    {#if 
                        sessionUserId && !editPermission(sessionUserId, collectionInfo, collectionSocialGraph)}
                    <form
                        method="POST"
                        action="?/followCollection"
                    >
                        <input 
                            type="hidden"
                            name="follow-info" 
                            id="follow-info"
                            value={followData}
                        />
                        <input 
                            type="hidden"
                            name="collection-id" 
                            id="collection-id"
                            value={collectionId}
                        />
                        <input 
                            type="hidden"
                            name="session-user-id" 
                            id="session-user-id"
                            value={sessionUserId}
                        />
                        <button 
                            class="standard" 
                            formaction="followCollection"
                        >
                        {#if followData && followData['follows_now'] == true}
                            unfollow
                        {:else}
                            + follow
                        {/if}
                        </button>
                    </form>
                    {:else if sessionUserId && editPermission(sessionUserId, collectionInfo, collectionSocialGraph)}
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
            collectionReturned={permission}
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
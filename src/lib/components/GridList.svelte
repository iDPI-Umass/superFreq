<!-- 
    Component for switchable grid/list collection builder and view. Modes "new" and "edit" enable drag-and-drop functionality. The "svelte-dnd-action" package has keyboard interaction functionality and ARIA labels have been added to ensure clarity for screen reader users.
-->

<script lang="ts">
    import {flip} from "svelte/animate";
    import {dragHandleZone, dndzone, dragHandle} from "svelte-dnd-action";

    import Grip from '@lucide/svelte/icons/grip'

    import wave from "$lib/assets/images/logo/freq-wave.svg"

    import CoverArt from "$lib/components/CoverArt.svelte"
    import CollectionItemTag from "$lib/components/CollectionItemTag.svelte"
    import { listenUrlWhitelistCheck } from "$lib/resources/parseData";
    import { promiseStates, collectionData } from "$lib/resources/states.svelte";

    interface ComponentProps {
        collectionReturned?: boolean | null
        collectionType?: string | null
        collectionStatus?: string | null
        showTags?: boolean
        layout: string
        mode: string
    }

    let {
        collectionReturned = null,
        collectionType, // "artists" | "release_groups" | "recordings" | "labels"
        collectionStatus = "public", // "open", "public", "private", "deleted"
        showTags = true,
        layout, // "grid" | "condensed-grid" | "list"
        mode, // "view" | "edit"
    }: ComponentProps = $props()    

    const format: App.NestedObject = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"],
        "condensed-grid": ["media-grid-condensed", "media-grid-item"],
    }

    function ariaLabel ( item: any, itemType: string) {
        let text = ''
        if ( itemType.includes("artist") ) {
            text = item["artistName"]
        }
        else if ( itemType.includes("release_group") ) {
            text = `${item["release_group_name"]} by ${item["artist_name"]}`
        }
        else if ( itemType.includes("recording") ) {
            text = `${item["recording_name"]} by ${item["artist_name"]}`
        }
        return text
    }

    function altText ( item: any, itemType: string ) {
        let text = ''
        if ( itemType.includes('release_group')) {
            text = `${item['release_group_name']}" by ${item['artist_name']}`
        }
        else if ( itemType.includes("recording") )
            {
                text = `"${item['recording_name']}" by ${item['artist_name']}`
            }
        return text
    } 

    let items = $state(collectionData.collectionItems)

    $effect(() => {
        items = collectionData.collectionItems
    })

    const flipDurationMs = 300;

    function handleSort( e: any ) {
        items = e.detail.items;
    }

	function handleFinalize( e: any ) {
		const { items: newItems } = e.detail;
        collectionData.collectionItems = newItems
	}

    // delete item from collection editor
	function deleteItem( item: any ) {
		items = items.filter(i => i != item)

        if ( item.inserted_at ){
            item.item_position = null
            collectionData.deletedItems.push(item)
        }

		for (const i of items) {
            const itemIndex = items.indexOf(i)
			i["id"] = itemIndex
            i["item_position"] = itemIndex
		}
        collectionData.collectionItems = items
	}

    const undersizedCollection = $derived(( mode == 'view' && ( layout == 'grid' && collectionData.collectionItems.length < 6 ) || ( layout == 'condensed-grid' && collectionData.collectionItems.length < 4 )) ? true : false)

    function getGridSpacers ( items: any, layout: string ) {
        const spacesArray = [] as number[]
        if ( !undersizedCollection || layout == 'list' ) {
            return spacesArray
        }

        const remainingSpaces = ( layout == 'grid' ) ? 6 - items.length : 4 - items.length

        let n = 0
        while ( n < remainingSpaces ) {
            spacesArray.push(n)
            n++
        }
        return spacesArray
    }

    const gridSpacers = $derived(getGridSpacers(items, layout))
</script>

<!-- <svelte:options runes={true} /> -->

{#snippet editorInteractions(item: any, labelText: string)}
    <div class="editor-interactions">
        <button class="standard" onclick={() => deleteItem(item)}>
            x remove
        </button>
        <div use:dragHandle aria-label="drag-handle for {labelText}" class="handle">
            <Grip size="20" color=var(--freq-color-text-muted)></Grip>
        </div>
    </div>
{/snippet}

{#snippet editorItemImage(item: any, altText: string)}
    {#await promiseStates.imgPromise}
        <img 
            src={wave} 
            alt="loading cover art"
        />
    {:then}
        <img 
            src={item["img_url"] ?? item["last_fm_img_url"] ?? wave} 
            alt="{item["img_url"] ? altText : 'no available'} cover art"
        />
    {/await}
{/snippet}

{#snippet coverArt( item: any, itemType: string, mode: string )}
    {#if itemType.includes("release_group") && mode == "edit"}
        {#key items.length}
            {#if ( item["img_url"] != null ) || ( item["last_fm_img_url"] != null )}
                <CoverArt
                    item={item}
                    altText={`"${item['release_group_name']}" by ${item['artist_name']}`}
                ></CoverArt>
            {:else if ( item["img_url"] == null ) && ( item["last_fm_img_url"] == null )}
                {@render editorItemImage(item, item["release_group_name"])}
            {/if}
        {/key}
    {:else if itemType.includes("release_group") && mode == "view"}
        <CoverArt
            item={item}
            altText={item['release_group_name']}
        ></CoverArt>
    {:else if itemType.includes("recording") && mode == "edit"}
        {#key items.length}
            {#if ( item["img_url"] != null ) || ( item["last_fm_img_url"] != null )}
                <CoverArt
                    item={item}
                    altText={altText(item, ( collectionType ?? item["item_type"] ))}
                ></CoverArt>
            {:else if ( item["img_url"] == null ) && ( item["last_fm_img_url"] == null )}
                {@render editorItemImage(item, item["recording_name"])}
            {/if}
        {/key}
    {:else if itemType.includes("recording") && mode == "view"}
        <CoverArt
            item={item}
            altText={item["recording_name"]}
        ></CoverArt>
    {:else if itemType.includes("episode")}
        <CoverArt
            item={item}
            altText={item["episode_title"]}
        ></CoverArt>
    {:else if itemType.includes("artist")}
        <CoverArt
            item={item}
            altText={item["artist_name"]}
        ></CoverArt>
    {/if}
{/snippet}

{#snippet metadataBlurb( item: any, itemType: string, mode: string )}
    {#if itemType.includes("artist")}
        <CollectionItemTag
            display={showTags}
            itemType={itemType}
        ></CollectionItemTag>
        <span class="artist">
            {#if item['artist_mbid'] && item['artist_mbid'].length > 0 && mode == "view"}
                <a href={`https://musicbrainz.org/artist/${item["artist_mbid"]}`}>
                    {item["artist_name"]}
                </a>
            {:else}
                {item["artist_name"] ?? item["user_added_artist_name"]}
            {/if}
            </span>
    {:else if itemType.includes("release_group")}
        <CollectionItemTag
            display={showTags}
            itemType={itemType}
        ></CollectionItemTag>
        <span class="title">
            {#if item['release_group_mbid'] && item['release_group_mbid'].length > 0  && mode == "view"} 
            <a href={`https://musicbrainz.org/release-group/${item["release_group_mbid"]}`}>
                {item["release_group_name"]}
            </a>
            {:else}
                {item["release_group_name"] ?? item["user_added_release_group_name"]}
            {/if}
        </span>
        <span class="artist">
            {#if item['artist_mbid'] && item['artist_mbid'].length > 0  && mode == "view"}
                <a href={`https://musicbrainz.org/artist/${item["artist_mbid"]}`}>
                    {item["artist_name"]}
                </a>
            {:else}
                {item['artist_name'] ?? item["user_added_artist_name"]}
            {/if}
        </span>
    {:else if itemType.includes("recording")}
        <CollectionItemTag
            display={showTags}
            itemType={itemType}
        ></CollectionItemTag>
        <span class="title">
            {#if item['recording_mbid'] && item['recording_mbid'].length > 0 && mode == "view"}
                <a href={`https://musicbrainz.org/recording/${item["recording_mbid"]}`}>
                    {item["recording_name"]}
                </a>
            {:else}
                {item["recording_name"] ?? item["user_added_recording_name"]}
            {/if}
        </span>
        <span class="artist">
            {#if item['artist_mbid'] && item['artist_mbid'].length > 0 && mode == "view"}
                <a href={`https://musicbrainz.org/artist/${item["artist_mbid"]}`}>
                    {item["artist_name"]}
                </a>
            {:else}
                {item["artist_name"] ?? item["user_added_artist_name"]}
            {/if}
        </span>
    {:else if itemType.includes("episode")}
        <CollectionItemTag
            display={showTags}
            itemType={itemType}
        ></CollectionItemTag>
        <span class="title">
            {#if item["user_added_listen_url"] && item['user_added_listen_url'].length > 0 && listenUrlWhitelistCheck(item["user_added_listen_url"]) && mode == "view"}
            <a href={item["user_added_listen_url"]}>
                {item["episode_title"] ?? item["user_added_episode_title"]}
            </a>
            {:else}
                {item["episode_title"] ?? item["user_added_episode_title"]}
            {/if}
        </span>
        <span class="artist">
            {#if item['artist_mbid'] && item['artist_mbid'].length > 0 && mode == "view"}
                <a href={`https://musicbrainz.org/artist/${item["artist_mbid"]}`}>
                    {item["artist_name"]}
                </a>
            {:else}
                {item["artist_name"] ?? item["user_added_artist_name"]}
            {/if}
        </span>
    {/if}
{/snippet}

{#snippet itemAttribution(item: any, status: string)}
    {#if  status == "open"}
        <a class="attribution" href="/user/{item.inserted_by_username}">
            {item.inserted_by_display_name}
        </a>
    {/if}
{/snippet}

{#snippet underSizedCollection()}
    {#if undersizedCollection}
        {#each gridSpacers as spacer}
            <div class='media-grid-item'> </div>
        {/each}
    {/if}
{/snippet}

{#await collectionData.collectionItems.length > 0 then}
    {#if mode == "edit"}
        <ul 
            aria-label="collection items" 
            class={format[layout][0]}
            use:dragHandleZone={{items, flipDurationMs}} 
            onconsider={handleSort} 
            onfinalize={handleFinalize}
        >
            {#each items as contentItem(contentItem.id)}
                <li 
                    aria-label={ariaLabel(contentItem, ( contentItem["item_type"] ?? collectionType ))} 
                    animate:flip="{{duration: flipDurationMs}}" 
                    class={format[layout][1]}
                >
                    {@render coverArt(contentItem, ( contentItem["item_type"] ?? collectionType ), mode)}
                    <div class="metadata-blurb">
                        {@render metadataBlurb(contentItem, ( contentItem["item_type"] ?? collectionType ), mode)}
                    </div>
                    {@render editorInteractions(contentItem, contentItem["recording_name"])}
                </li>
            {/each}
        </ul>
    {:else if mode == "view" }
        <ul
            aria-label="collection items" 
            class={format[layout][0]}
        >
            {#each collectionData.collectionItems as contentItem}                  
                <li class={format[layout][1]}>
                    {@render coverArt(contentItem, ( contentItem["item_type"] ?? collectionType ), mode)}
                    <div class="metadata-blurb">
                        {@render metadataBlurb(contentItem, ( contentItem["item_type"] ?? collectionType ), mode)}
                    </div>
                    {@render itemAttribution(contentItem, collectionStatus)}
                </li>
            {/each}
            {@render underSizedCollection()}
        </ul>
    {/if}
{/await}

<style>
    /* li {
        display: flex;
        flex-direction: row;
        gap: 0.25em;
        margin: auto 0;
    } */
     ul {
        padding: 0;
     }
    button.standard {
        display: flex;
        flex-direction: row;
        width: auto;
        border-style: none;
        text-wrap: nowrap;
    }
    .item-data {
        display: flex;
    }
    .editor-interactions {
        display: flex;
        flex-direction: row;
        width: 200px;
        align-items: center;
        margin-right: 0;
    }
    a.attribution {
        width: fit-content;
        background: var(--freq-color-background-badge-light);
        margin: auto 0 0 auto;
        padding: var(--freq-height-spacer-quarter) var(--freq-width-spacer-quarter);
        color: var(--freq-color-text-medium);
        font-size: var(--freq-font-size-small);
        text-align: right;
        text-decoration: underline;
    }
    @media screen and (max-width: 600px) {
        .editor-interactions {
            justify-content:right;
            gap: var(--freq-width-spacer-half);
        }
        button.standard  {
           padding: 0;
           font-size: var(--freq-font-size-2x-small);
        }
        a.attribution {
            padding: var(--freq-height-spacer-quarter) calc(var(--freq-width-spacer-quarter) * 0.75);
            margin-bottom: -1px;
        }
    }
</style>
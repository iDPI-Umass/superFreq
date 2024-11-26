<!-- 
    Component for switchable grid/list collection builder and view. Modes "new" and "edit" enable drag-and-drop functionality. The "svelte-dnd-action" package has keyboard interaction functionality and ARIA labels have been added to ensure clarity for screen reader users.
-->

<script lang="ts">
    import {flip} from "svelte/animate";
    import {dragHandleZone, dndzone, dragHandle} from "svelte-dnd-action";
    import Grip from 'lucide-svelte/icons/grip'

    import wave from "$lib/assets/images/logo/freq-wave.svg"
    import loadingImage from "$lib/assets/images/loading-image.png"
    import imgNotFound from "$lib/assets/images/image-not-found.png"

    import CoverArt from "src/lib/components/CoverArt.svelte"

    interface ComponentProps {
        collectionContents: any
        deletedItems?: any
        collectionReturned?: boolean
        collectionType: string
        collectionStatus: string
        layout: string
        mode: string
        imgPromise?: any
    }

    let {
        collectionContents = $bindable([]),
        deletedItems = $bindable([]),
        collectionReturned,
        collectionType, // "artists" | "release_groups" | "recordings" | "labels"
        collectionStatus, // "open", "public", "private", "deleted"
        layout, // "grid" | "condensed-grid" | "list"
        mode, //"view" | "edit"
        imgPromise = $bindable(null)
    }: ComponentProps = $props()
    
    const format: App.NestedObject = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"],
        "condensed-grid": ["media-grid-condensed", "media-grid-item"],
    }

    let items = $state(collectionContents)
    $effect(() => { items = collectionContents })

    const flipDurationMs = 300;

    function handleSort( e: any ) {
        items = e.detail.items;
    }

	function handleFinalize( e: any ) {
		const { items: newItems } = e.detail;
        items = newItems
        collectionContents = newItems
	}

    // delete item from collection editor
	function deleteItem( item: any ) {
		items = items.filter(i => i != item);
		for (const i of items) {
			i["id"] = items.indexOf(i) + 1;
		}
        collectionContents = items

        if ( item.inserted_at ){
            item.item_position = null
            deletedItems.push(item)
        }
	}

    const undersizedCollection = $derived(( mode == 'view' && ( layout == 'grid' && collectionContents.length < 6 ) || ( layout == 'condensed-grid' && collectionContents.length < 4 )) ? true : false)

    function getGridSpacers ( items: any, layout: string ) {
        const spacesArray = [] as number[]
        if ( !undersizedCollection || layout == 'list' ) {
            return spacesArray
        }

        const remainingSpaces = ( layout == 'grid' ) ? items.length % 6 : items.length % 4

        let n = 0
        while ( n < remainingSpaces ) {
            spacesArray.push(n)
            n++
        }
        return spacesArray
    }

    const gridSpacers = $derived(getGridSpacers(items, layout))
</script>

<svelte:options runes={true} />

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
    {#await imgPromise}
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

{#await collectionContents.length > 0 then}
    {#if mode == "edit"}
        <ul 
        aria-label="collection items" 
        class={format[layout][0]}
        use:dragHandleZone={{items, flipDurationMs}} 
        onconsider={handleSort} 
        onfinalize={handleFinalize}
        >   
            {#each items as contentItem, index(contentItem.id)}
                {#if collectionType == "artists"}
                    <li
                        aria-label={contentItem["artistName"]}
                        animate:flip="{{duration: flipDurationMs}}" 
                        class={format[layout][1]} 
                    >
                        <div class="metadata-blurb">
                            <p>
                                {contentItem["artist_name"]}
                            </p>
                        </div>
                        {@render editorInteractions(contentItem, contentItem["artist_name"])}
                    </li>
                {:else if collectionType == "release_groups"  }
                    <li 
                        aria-label="{contentItem["release_group_name"]} by ${contentItem["artist_name"]}" 
                        animate:flip="{{duration: flipDurationMs}}" 
                        class={format[layout][1]} 
                    >
                    {#key items.length}
                        {#if ( contentItem["img_url"] != null ) || ( contentItem["last_fm_img_url"] != null )}
                            <CoverArt
                                item={contentItem}
                                altText={`"${contentItem['release_group_name']}" by ${contentItem['artist_name']}`}
                            ></CoverArt>
                        {:else if ( contentItem["img_url"] == null ) && ( contentItem["last_fm_img_url"] == null )}
                            {@render editorItemImage(contentItem, contentItem["release_group_name"])}
                        {/if}
                    {/key}
                        <div class="metadata-blurb">
                            <h2>
                                {contentItem["release_group_name"]}
                            </h2>
                            <p>
                                {contentItem["artist_name"]}
                            </p>
                        </div>
                        {@render editorInteractions(contentItem, contentItem["release_group_name"])} 
                    </li>
                {:else if collectionType == "recordings"}
                    <li 
                        aria-label="{contentItem["recording_name"]} by ${contentItem["artist_name"]}" 
                        animate:flip="{{duration: flipDurationMs}}" 
                        class={format[layout][1]}
                    >
                    {#key items.length}
                        {#if ( contentItem["img_url"] != null ) || ( contentItem["last_fm_img_url"] != null )}
                            <CoverArt
                                item={contentItem}
                                altText={`"${contentItem['recording_name']}" by ${contentItem['artist_name']}`}
                            ></CoverArt>
                        {:else if ( contentItem["img_url"] == null ) && ( contentItem["last_fm_img_url"] == null )}
                            {@render editorItemImage(contentItem, contentItem["recording_name"])}
                        {/if}
                    {/key}
                        <div class="metadata-blurb">
                            <h2>{contentItem["recording_name"]}</h2>
                            <p>{contentItem["artist_name"]}</p>
                        </div>
                        {@render editorInteractions(contentItem, contentItem["recording_name"])}
                    </li>
                {/if}
            {/each}
        </ul>
    {:else if mode == "view" }
        <ul class={format[layout][0]}>
            {#each collectionContents as contentItem}
                {#if collectionType == "artists" || contentItem["item_type"] == "artist"}                    
                    <li class={format[layout][1]}>
                        <p>
                            <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                                
                                    {contentItem["artists"]["artist_name"]}
                            </a>
                        </p>
                        {@render itemAttribution(contentItem, collectionStatus)}
                    </li>
                {:else if collectionType == "release_groups" || contentItem["item_type"] == "release_group"}
                    <li class={format[layout][1]}>
                        <CoverArt
                            item={contentItem}
                            altText={contentItem['release_group_name']}
                        ></CoverArt>
                        <div class="metadata-blurb">
                            <h2>
                                <a href={`https://musicbrainz.org/release-group/${contentItem["release_group_mbid"]}`}>
                                    {contentItem["release_group_name"]}
                                </a>
                            </h2>
                            <p>
                                <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                                    {contentItem["artist_name"]}
                                </a>
                            </p>
                        </div>
                        {@render itemAttribution(contentItem, collectionStatus)}
                    </li>
                {:else if collectionType == "recordings" || contentItem["item_type"] == "recording"}
                    <div class={format[layout][0]}>
                        <div class={format[layout][1]}>
                            <CoverArt
                                item={contentItem}
                                altText={contentItem["recording_name"]}
                            ></CoverArt>
                            <div class="metadata-blurb">
                                <h2>
                                    <a href={`https://musicbrainz.org/recording/${contentItem["recording_mbid"]}`}>
                                        {contentItem["recording_name"]}
                                    </a>
                                </h2>
                                <p>
                                    <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                                        {contentItem["artist_name"]}
                                    </a>
                                </p>
                                {@render itemAttribution(contentItem, collectionStatus)}
                            </div>
                        </div>
                    </div>
                {/if}
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
        margin: 0 0 0 auto;
        padding: var(--freq-height-spacer-quarter) var(--freq-width-spacer-quarter);
        color: var(--freq-color-text-medium);
        font-size: var(--freq-font-size-small);
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
    }
</style>
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
        collectionReturned: boolean
        collectionType: string
        layout: string
        mode: string
        imgPromise?: any
    }

    let {
        collectionContents = $bindable(),
        deletedItems = $bindable([]),
        collectionReturned,
        collectionType, // "artists" | "release_groups" | "recordings" | "labels"
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

    const flipDurationMs = 300;

    function handleSort( e: any ) {
        items = e.detail.items;
    }

	function handleFinalize( e: any ) {
		const { items: newItems } = e.detail;
        items = newItems
        collectionContents = newItems
	}

    function updateIds( collectionContents: any ) {
        for (const [index, item] of collectionContents.entries()) {
			item.id = index + 1
		}
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

    const undersizedCollection = ( mode == 'view' && ( layout == 'grid' && collectionContents.length < 6 ) || ( layout == 'condensed-grid' && collectionContents.length < 4 )) ? true : false

    function getGridSpacers ( items: any ) {
        const spacesArray = [] as number[]
        if ( !undersizedCollection || layout == 'list' ) {
            return spacesArray
        }

        const remainingSpaces = ( layout == 'grid' ) ? 6 % items.length : 4 % items.length
        let n = 0
        while ( n < remainingSpaces ) {
            spacesArray.push(n)
            n++
        }
        return spacesArray
    }

    const gridSpacers = $derived(getGridSpacers(items))
    
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
            src={item["img_url"] ?? wave} 
            alt="{item["img_url"] ? altText : 'no available'} cover art"
        />
    {/await}
{/snippet}

{#snippet underSizedCollection()}
    {#if undersizedCollection}
        {#each gridSpacers as spacer}
            <div class='media-grid-item'></div>
        {/each}
    {/if}
{/snippet}

{#if ( collectionReturned || collectionContents.length > 0 ) && mode == "edit"}
    <ul 
    aria-label="collection items" 
    class={format[layout][0]}
    use:dragHandleZone={{items, flipDurationMs}} 
    onconsider={handleSort} 
    onfinalize={handleFinalize}>
        {#if collectionType == "artists"}
            {#each items as contentItem, index(contentItem.id)}
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
            {/each}
        {:else if collectionType == "release_groups" }
            {#each items as contentItem, index(contentItem.id)}
            
            <li 
                aria-label="{contentItem["release_group_name"]} by ${contentItem["artist_name"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][1]} 
            >
                {#if ( contentItem["img_url"] != null ) || ( contentItem["last_fm_img_url"] != null )}
                    <CoverArt
                        item={contentItem}
                        altText={`"${contentItem['release_group_name']}" by ${contentItem['artist_name']}`}
                    ></CoverArt>
                {:else if ( contentItem["img_url"] == null ) && ( contentItem["last_fm_img_url"] == null )}
                    {@render editorItemImage(contentItem, contentItem["release_group_name"])}
                {/if}
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
            {/each}
        {:else if collectionType == "recordings" }
            {#each items as contentItem, index(contentItem.id)}
            <li 
                aria-label="{contentItem["recording_name"]} by ${contentItem["artist_name"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][1]}
            >
            {#if ( contentItem["img_url"] != null ) || ( contentItem["last_fm_img_url"] != null )}
                <CoverArt
                    item={contentItem}
                    altText={`"${contentItem['recording_name']}" by ${contentItem['artist_name']}`}
                ></CoverArt>
            {:else if ( contentItem["img_url"] == null ) && ( contentItem["last_fm_img_url"] == null )}
                {@render editorItemImage(contentItem, contentItem["recording_name"])}
            {/if}
                <div class="metadata-blurb">
                    <h2>{contentItem["recording_name"]}</h2>
                    <p>{contentItem["artist_name"]}</p>
                </div>
                {@render editorInteractions(contentItem, contentItem["recording_name"])}
            </li>
            {/each}
        {/if}
    </ul>
{:else if ( collectionReturned || collectionContents.length > 0 ) && mode == "view" }
    {#if collectionType == "artists"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                <p>
                    <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                        
                            {contentItem["artists"]["artist_name"]}
                    </a>
                </p>
            </div>
            {/each}
            {@render underSizedCollection()}
        </div>
    {:else if collectionType == "release_groups"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
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
            </div>
            {/each}
            {@render underSizedCollection()}
        </div>
    {:else if collectionType == "recordings"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
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
                </div>
            </div>
            {/each}
            {@render underSizedCollection()}
        </div>
    {/if}
{/if}

<style>
    li {
        display: flex;
        flex-direction: row;
        gap: 0.25em;
        margin: auto 0;
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
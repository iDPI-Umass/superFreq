<!-- 
    Component for switchable grid/list collection builder and view. Modes "new" and "edit" enable drag-and-drop functionality. The "svelte-dnd-action" package has keyboard interaction functionality and ARIA labels have been added to ensure clarity for screen reader users.
-->

<script lang="ts">
    import {flip} from "svelte/animate";
    import {dragHandleZone, dndzone, dragHandle} from "svelte-dnd-action";
    import Grip from 'lucide-svelte/icons/grip';
    import { imgPromiseStore } from '$lib/stores'

    import wave from "$lib/assets/images/logo/freq-wave.svg"
    import loadingImage from "$lib/assets/images/loading-image.png"
    import imgNotFound from "$lib/assets/images/image-not-found.png"

    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"

    export let collectionContents: any
    export let deletedItems: any = []
    export let collectionReturned: boolean
    export let collectionType: string // "artists" | "release_groups" | "recordings" | "labels"
    export let layout: string // "grid" | "condensed-grid" | "list"
    export let mode: string //"view" | "edit"
    export let imgPromise: any = null
    
    const format: App.NestedObject = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"],
        "condensed-grid": ["media-grid-condensed", "media-grid-item"],
    }

    let items = collectionContents

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
</script>

{#if ( collectionReturned || collectionContents.length > 0 ) && mode == "edit"}
    <ul 
    aria-label="collection items" 
    class={format[layout][0]}
    use:dragHandleZone={{items, flipDurationMs}} 
    on:consider={handleSort} 
    on:finalize={handleFinalize}>
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
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["artist_name"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>
            {/each}
        {:else if collectionType == "release_groups" }
            {#each items as contentItem, index(contentItem.id)}
            
            <li 
                aria-label="{contentItem["release_group_name"]} by ${contentItem["artist_name"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][1]} 
            >
            {#await imgPromise then}
                <img 
                    src={contentItem["img_url"] ?? wave} 
                    alt="{contentItem["img_url"] ? contentItem["release_group_name"] : 'no available'} cover art"
                />
            {/await}
                <div class="metadata-blurb">
                    <h2>
                        {contentItem["release_group_name"]}
                    </h2>
                    <p>
                        {contentItem["artist_name"]}
                    </p>
                </div>
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["release_group_name"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>

            {/each}
        {:else if collectionType == "recordings" }
            {#each items as contentItem, index(contentItem.id)}
            <li 
                aria-label="{contentItem["recording_name"]} by ${contentItem["artist_name"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][1]}
            >
                <img src={contentItem["img_url"] ?? wave}  alt={contentItem["recording_name"]} />
                <div class="metadata-blurb">
                    <h2>{contentItem["recording_name"]}</h2>
                    <p>{contentItem["artist_name"]}</p>
                </div>
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["recording_name"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>
            {/each}
        {/if}
    </ul>
{:else if ( collectionReturned || collectionContents.length > 0 ) && mode == "view" }
    {#if collectionType == "artists"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                <div class={format[layout][1]}>
                    <p>{contentItem["artists"]["artist_name"]}</p>
                </div>
            </a>
            {/each}
        </div>
    {:else if collectionType == "release_groups"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                    <img src={contentItem['img_url'] ?? wave} 
                        alt={contentItem['release_group_name']} />
                    <div class="metadata-blurb">
                        <a href={`https://musicbrainz.org/release-group/${contentItem["release_group_mbid"]}`}>
                            <h2>{contentItem["release_group_name"]}</h2>
                        </a>
                        <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                            <p>{contentItem["artist_name"]}</p>
                        </a>
                    </div>
            </div>
            {/each}
        </div>
    {:else if collectionType == "recordings"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                    <img src={contentItem["img_url"] ?? wave}  alt={contentItem["recording_name"]} />
                    <div class="metadata-blurb">
                        <a href={`https://musicbrainz.org/recording/${contentItem["recording_mbid"]}`}>
                            <h2>{contentItem["recording_name"]}</h2>
                        </a>
                        <a href={`https://musicbrainz.org/artist/${contentItem["artist_mbid"]}`}>
                            <p>{contentItem["artist_name"]}</p>
                        </a>
                    </div>
            </div>
            {/each}
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
        flex-wrap: none;
        border-style: none;
        margin: auto;
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
</style>
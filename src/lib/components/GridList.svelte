<!-- 
    Component for switchable grid/list collection builder and view. Modes "new" and "edit" enable drag-and-drop functionality. The "svelte-dnd-action" package has keyboard interaction functionality and ARIA labels have been added to ensure clarity for screen reader users.

    Expects props:
    -- colllectionContents: array of objects
    -- collectionReturned: boolean
    -- collectionType ("arists", "release_groups", "recordings", or "labels")
    -- layout ("grid" or "list")
    -- mode ("view" or "edit")
-->

<script lang="ts">
    import {flip} from "svelte/animate";
    import {dragHandleZone, dndzone, dragHandle} from "svelte-dnd-action";
    import Grip from 'lucide-svelte/icons/grip';

    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"

    export let collectionContents: itemData[]
    export let collectionReturned: boolean
    export let collectionType: string
    export let layout: string
    export let mode: string

    const format: itemData = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"]
    }

    let items = collectionContents

    interface itemData {
		[index: string]: number | string | string[] | itemData
	}

    const flipDurationMs = 300;

    function handleSort( e: any ) {
        items = e.detail.items;
    }

	function handleFinalize( e: any ) {
		const {items:newItems} = e.detail;
        items = newItems
        collectionContents = newItems
		for (const item of newItems) {
            console.log(item.id, item["release_groups"]["release_group_name"])
		}
	}

    function updateIds( collectionContents: itemData[] ) {
        for (const [index, item] of collectionContents.entries()) {
			item.id = index + 1
            console.log(item.id, item["release_groups"]["release_group_name"])
		}
        console.log(collectionContents)
    }

    // delete item from collection editor
	function deleteItem( item: itemData ) {
		items = items.filter(i => i != item);
		for (const i of items) {
			i["id"] = items.indexOf(i) + 1;
		}
        collectionContents = items
	}
</script>

{#if collectionReturned && mode == "edit"}
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
                    {contentItem["artistName"]}
                </p>
            </div>
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["artistName"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>
            {/each}
        {:else if collectionType == "release_groups"}
            {#each items as contentItem, index(contentItem.id)}
            <li 
                aria-label="{contentItem["releaseGroupName"]} by ${contentItem["artistName"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][1]} 
            >
                <img 
                    src={contentItem["imgUrl"]} 
                    alt="{contentItem["releaseGroupName"]} cover art"
                />
                <div class="metadata-blurb">
                    <h2>
                        {contentItem["releaseGroupName"]}
                    </h2>
                    <p>
                        {contentItem["artistName"]}
                    </p>
                </div>
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["releaseGroupName"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>
            {/each}
        {:else if collectionType == "recordings"}
            {#each items as contentItem, index(contentItem.id)}
            <li 
                aria-label="{contentItem["recordingName"]} by ${contentItem["artistName"]}" 
                animate:flip="{{duration: flipDurationMs}}" 
                class={format[layout][0]}
            >
                <img src={contentItem["imgUrl"]}  alt={contentItem["recordingName"]} />
                <div class="metadata-blurb">
                    <h2>{contentItem["recordingName"]}</h2>
                    <p>{contentItem["artistName"]}</p>
                </div>
                <div class="editor-interactions">
                    <button class="standard" on:click|preventDefault={() => deleteItem(contentItem)}>
                        x remove
                    </button>
                    <div use:dragHandle aria-label="drag-handle for {contentItem["recordingName"]}" class="handle">
                        <Grip size="20" color=var(--freq-color-text-muted)></Grip>
                    </div>
                </div>
            </li>
            {/each}
        {/if}
    </ul>
{:else if collectionReturned && mode == "view"}
    {#if collectionType == "artists"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                <p>{contentItem["artists"]["artist_name"]}</p>
            </div>
            {/each}
        </div>
    {:else if collectionType == "release_groups"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                    <img src={contentItem["release_groups"]["img_url"]} alt={contentItem["release_groups"]["release_group_name"]} />
                    <div class="metadata-blurb">
                        <h2>{contentItem["release_groups"]["release_group_name"]}</h2>
                        <p>{contentItem["artists"]["artist_name"]}</p>
                    </div>
            </div>
            {/each}
        </div>
    {:else if collectionType == "recordings"}
        <div class={format[layout][0]}>
            {#each collectionContents as contentItem}
            <div class={format[layout][1]}>
                    <img src={contentItem["release_groups"]["img_url"]}  alt={contentItem["recordings"]["recording_name"]} />
                    <div class="metata-blurb">
                        <h2>{contentItem["recordings"]["recording_name"]}</h2>
                        <p>{contentItem["artists"]["artist_name"]}</p>
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
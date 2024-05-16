<script lang="ts">
    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"

    export let collectionContents
    export let collectionReturned
    export let collectionType
    export let gridListSelect

    const format = {
        "grid": ["media-grid", "media-grid-item"],
        "list": ["media-list", "media-list-item"]
    }

    gridListSelect = "grid"
</script>

{#if collectionReturned}
    {#if collectionType == "artists"}
        <div class={format[gridListSelect][0]}>
            {#each collectionContents as contentItem}
                <div class={format[gridListSelect][1]}>
                    <p>{contentItem["artists"]["artist_name"]}</p>
                </div>
            {/each}
        </div>
    {:else if collectionType == "release_groups"}
        <div class={format[gridListSelect][0]}>
            {#each collectionContents as contentItem}
            <div class={format[gridListSelect][1]}>
                    <img src={contentItem["release_groups"]["img_url"]} alt={contentItem["release_groups"]["release_group_name"]} />
                    <div class="metadata-blurb">
                        <h2>{contentItem["release_groups"]["release_group_name"]}</h2>
                        <p>{contentItem["artists"]["artist_name"]}</p>
                    </div>
            </div>
            {/each}
        </div>
    {:else if collectionType == "recordings"}
        <div class={format[gridListSelect][0]}>
            {#each collectionContents as contentItem}
            <div class={format[gridListSelect][1]}>
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
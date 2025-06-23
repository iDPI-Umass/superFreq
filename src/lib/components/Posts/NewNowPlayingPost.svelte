<script lang="ts">
    import { enhance } from '$app/forms'
    import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte'
    import MusicBrainzSearch from 'src/lib/components/Search/MusicBrainzSearch.svelte'
    import Tooltip from 'src/lib/components/layout/Tooltip.svelte'
    import { collectionData } from 'src/lib/resources/states.svelte'

    import { Tabs } from "bits-ui";

    interface ComponentProps {
        parsedUrlInfo?: App.RowData | null
    }
    
    let {
        parsedUrlInfo
    }: ComponentProps = $props()

    let addedItem = $derived(collectionData.singleItem)

    let imgUrl = $derived(addedItem["img_url"]) as string
    let lastFmImgUrl = $derived(addedItem["last_fm_img_url"]) as string


    let posting = $state(false)

    let listenUrl = $state('')

    // submit form to parse data at listenUrl and autocomplete 'post' form when url is entered, after a short delay to make sure user has stopped typing
    let timeout = null
    const timeoutDurationMs = 1000
    let parseFormSubmit = null

    async function getUrlData ( listenUrl: string ) {
        clearTimeout(timeout)
        timeout = await setTimeout(async function() {
            return parseFormSubmit.requestSubmit()
        }, timeoutDurationMs)
    }
</script>

{#snippet postForm( itemType: string, addedItem: App.RowData )}
    <form method="POST" action="?/post" class="vertical" use:enhance={() => {
        posting = true
        return async ({ update }) => {
            await update()
            posting = false
        }}
    }>
        <input
            id="item-type" 
            name="item-type" 
            type="hidden" 
            value={itemType}
        />
        <input
            id="artist-mbid" 
            name="artist-mbid" 
            type="hidden" 
            value={addedItem?.artist_mbid ?? null} 
        />
        <input
            id="release-group-mbid" 
            name="release-group-mbid" 
            type="hidden" 
            value={addedItem?.release_group_mbid ?? null} 
        />
        <input
            id="recording-mbid" 
            name="recording-mbid" 
            type="hidden" 
            value={addedItem?.recording_mbid ?? null} 
        />
        <input
            id="remixer-artist-mbid" 
            name="remixer-artist-mbid" 
            type="hidden" 
            value={addedItem?.remixer_artist_mbid ?? null} 
        />
        <input
            id="release-date" 
            name="release-date" 
            type="hidden" 
            value={addedItem?.release_date ?? null} 
        />
        <input
            id="label" 
            name="label" 
            type="hidden" 
            value={addedItem?.label ?? null} 
        />
        <input
            id="img-url" 
            name="img-url" 
            type="hidden" 
            value={imgUrl} 
        />
        <input
            id="last-fm-img-url" 
            name="last-fm-img-url" 
            type="hidden" 
            value={lastFmImgUrl} 
        />
        <input 
            id="parsed-url-data"
            name="parsed-url-data"
            type="hidden"
            value={JSON.stringify(parsedUrlInfo)}
        />
        <div class="tooltip-group">
            <label 
                class="text-label" 
                for="listen-url"
            >
                listen link
            </label>
            <Tooltip>
                A link from Bandcamp, Soundcloud, or YouTube can be embedded in your post.
            </Tooltip>
        </div>
        <input 
            oninput={() => getUrlData(listenUrl)}
            class="text" 
            id="listen-url" 
            name="listen-url" 
            type="url"
            placeholder="paste link"
            bind:value={listenUrl}
        />
        <div class="label-group">
            <label 
                class="text-label" 
                for="artist-name"
            >
                {itemType == 'episode' ?  'host / dj' : 'artist name'}
            </label>        
            <span class="label-explainer">
                * required
            </span>
        </div>
        <input
            class="text"  
            id="artist-name" 
            name="artist-name" 
            type="text"
            placeholder="artist name" 
            value={addedItem?.artist_name ?? null}
            required
        />
        {#if itemType == 'release_group'}

            <div class="label-group">
                <label 
                    class="text-label" 
                    for="release-group-name"
                >
                    album name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                id="release-group-name" 
                name="release-group-name" 
                type="text"
                placeholder="album name"
                value={addedItem?.release_group_name ?? null}
                required
            />
        {:else if itemType == 'recording'}
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="release-group-name"
                >
                    album name
                </label>
            </div>
            <input 
                class="text" 
                id="release-group-name" 
                name="release-group-name" 
                type="text"
                placeholder="album name"
                value={addedItem?.release_group_name ?? null}
            />
        {/if}
        {#if itemType == 'recording'}
            <div class="label-group">
                <label
                    class="text-label" 
                    for="recording-name"
                >
                    track name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text"    
                id="recording-name" 
                name="recording-name" 
                type="text"
                placeholder="track title" 
                value={addedItem?.recording_name ?? null}
                required
            />
        {/if}
        {#if itemType == 'episode'}
            <div class="label-group">
                <label
                    class="text-label" 
                    for="episode"
                >
                    episode / mix title
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text"    
                id="episode" 
                name="episode" 
                type="text"
                placeholder="episode" 
                value={addedItem?.episode_name ?? null}
                required
            />
            <label
                class="text-label" 
                for="show"
            >
                show name / mix series
            </label>
            <input 
                class="text"    
                id="show" 
                name="show" 
                type="text"
                placeholder="show" 
                value={addedItem?.show_title ?? null}
            />
        {/if}
        <label 
            class="text-label" 
            for="post-text"
        >
            thoughts
        </label>
        <textarea
            cols="1"
            rows="5"
            id="post-text"
            name="post-text"
            spellcheck=true 
            placeholder="Some prompts: What do you like about this? Does it remind you of something? Are you looking for more like it?"
        ></textarea>
        <button class="standard" formaction='?/post' type="submit" disabled={posting}>
            submit
        </button>
    </form>
    <form 
        method="POST" 
        action="?/parseListenUrl" 
        bind:this={parseFormSubmit} 
        use:enhance={() => {
            return async({update}) => {
                await update()
                if ( parsedUrlInfo ) {
                    const itemType = parsedUrlInfo?.item_type
                    const source = parsedUrlInfo?.source
                    collectionData.singleItem = {
                        'artist_name': parsedUrlInfo?.artist,
                        'release_group_name': (itemType == 'album') ? parsedUrlInfo?.title : null,
                        'recording_name': (itemType == 'track') ? parsedUrlInfo?.title : null,
                        'img_url': parsedUrlInfo?.img_url,
                        'episode_name': ( source == 'soundcloud' || itemType == 'episode' ) ? parsedUrlInfo?.title : null,
                        'show_title': ( source == 'soundcloud' ) ? parsedUrlInfo?.account : null,
                    } 
                }
            }
        }}
    >
        <input 
            id="listen-url" 
            name="listen-url" 
            type="hidden"
            value={listenUrl}
        />
        <input   
            id="episode" 
            name="episode" 
            type="hidden"
            value={addedItem?.episode_name ?? null}
        />
        <input
            id="artist-name" 
            name="artist-name" 
            type="hidden"
            value={addedItem?.artist_name ?? null}
        />
        <input 
            id="release-group-name" 
            name="release-group-name" 
            type="hidden"
            value={addedItem?.release_group_name ?? null}
        />
        <input  
            id="recording-name" 
            name="recording-name" 
            type="hidden"
            value={addedItem?.recording_name ?? null}
        />
    </form>
{/snippet}

<div class="border">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                what are you listening to?
            </span>
        {/snippet}
    </PanelHeader>
    <Tabs.Root value="album">
        <Tabs.List>
            <Tabs.Trigger value="album">
                album
            </Tabs.Trigger>
            <Tabs.Trigger value="track">
                track
            </Tabs.Trigger>
            <Tabs.Trigger value="mix">
                episode / mix
            </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="album">
            <div class="search">
                <MusicBrainzSearch
                    searchCategory="release_groups"
                    searchButtonText="search"
                    searchPlaceholder="look up an album"
                    mode="single"
                    limit="10"
                ></MusicBrainzSearch>
                <Tooltip>
                    Search for an album to autofill this form. If it's not coming up search: "album name" artist (using the quotation marks).
                </Tooltip>
            </div>
            {@render postForm('release_group', addedItem)}
        </Tabs.Content>
        <Tabs.Content value="track">
            <div class="search">
                <MusicBrainzSearch
                    searchCategory="recordings"
                    searchButtonText="search"
                    searchPlaceholder="look up a track"
                    mode="single"
                ></MusicBrainzSearch>
                <Tooltip>
                    Search for a track to autofill this form. If it's not coming up search: "track name" artist (using the quotation marks).
                </Tooltip>
            </div>
            {@render postForm('recording', addedItem)}
        </Tabs.Content>
        <Tabs.Content value="mix">
            {@render postForm('episode', addedItem)}
        </Tabs.Content>
    </Tabs.Root>
</div>


<style>
    .border {
        display: flex;
        flex-direction: column;
        width: calc( 0.75 * var(--freq-max-width-primary));
        margin: var(--freq-spacing-large) auto;
        border: var(--freq-border-panel);
    }
    .search {
        display: flex;
        flex-direction: row;
        margin: var(--freq-height-spacer) var(--freq-width-spacer);
        align-items: center;
        gap: var(--freq-height-spacer-gap-quarter);
    }
</style>
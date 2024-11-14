<script lang="ts">
    import { enhance } from '$app/forms'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'

    import { Tabs } from "bits-ui";

    interface ComponentProps {
        addedItem?: any
        newItemAdded?: boolean
    }

    let {
        addedItem = {},
        newItemAdded = $bindable(false),
    }: ComponentProps = $props()

    const actionLookup = {
        'release_group': '?/postAlbum',
        'recording': '?/postTrack',
        'episode': '?/postMix'
    } as App.StringLookupObject

</script>
<svelte:options runes={true} />

{#snippet postForm( itemType: string, addedItem: App.RowData )}
    <form method="POST" action="?/post" class="vertical" use:enhance>
        <input
            id="item-type" 
            name="item-type" 
            type="hidden" 
            value={itemType}
        />
        <input
            id="mbid" 
            name="mbid" 
            type="hidden" 
            value={addedItem?.release_group_mbid ?? addedItem?.artist_mbid ?? null} 
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
            class="text" 
            id="listen-url" 
            name="listen-url" 
            type="url"
            placeholder="paste link" 
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
        {#if itemType == 'release_group' || itemType == 'recording'}
            <input  
                id="artist-mbid" 
                name="artist-mbid" 
                type="hidden"
                value={addedItem?.artist_mbid ?? null}
            />
            <input
                class="text"  
                id="artist-name" 
                name="artist-name" 
                type="text"
                placeholder="artist name" 
                value={addedItem?.artist_name ?? null}
            />
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="album-name"
                >
                    album name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input  
                id="release-group-mbid" 
                name="release-group-mbid" 
                type="hidden"
                value={addedItem?.release_group_mbid ?? null}
            />
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
                    for="track-name"
                >
                    track name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
                <input  
                id="recording-mbid" 
                name="recording-mbid" 
                type="hidden"
                value={addedItem?.recording_mbid ?? null}
            />
            <input 
                class="text"    
                id="recording-name" 
                name="track-name" 
                type="text"
                placeholder="track title" 
                value={addedItem?.recording_name ?? null}
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
                value={addedItem?.show_name ?? null}
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
        <button class="standard" formaction='?/post' type="submit">
            submit
        </button>
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
    <Tabs.Root>
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
                    bind:addedItems={addedItem}
                    bind:newItemAdded={newItemAdded}
                    mode="single"
                    limit="10"
                ></MusicBrainzSearch>
                <Tooltip>
                    Search for an album to autofill this form.
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
                    bind:addedItems={addedItem}
                    bind:newItemAdded={newItemAdded}
                    mode="single"
                ></MusicBrainzSearch>
                <Tooltip>
                    Search for a track to autofill this form.
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
<script lang="ts">
    import { enhance } from '$app/forms'
    import type { ActionData } from '../../../routes/$types'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
    import { username } from '$lib/resources/localStorage.ts'

    import { Tabs } from "bits-ui";

    // export let form: ActionData | null = null
    let addedItem: any
    let newItemAdded: boolean
    let type: string
    let listenUrl: string
    $: listenUrl

    // const listenLinkQuery = form?.success ? `${form?.embedInfo.title} ${form?.embedInfo.artist}` : ''
</script>


<div class="border">
    <PanelHeader>
        what are you listening to?
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
            <form method="POST" action="?/postAlbum" name="album" class="vertical" use:enhance>
                <input
                    id="item-type" 
                    name="item-type" 
                    type="hidden" 
                    value="release_group"
                />
                <input
                    id="mbid" 
                    name="mbid" 
                    type="hidden" 
                    value={addedItem?.releaseGroupMbid ?? null} 
                />
                <!-- <input
                    id="listen-url" 
                    name="listen-url" 
                    type="hidden" 
                    value={form?.embedInfo.url ?? null}
                /> -->
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
                <!-- <form method="POST" action="?/parseListenUrl"> -->
                    <input 
                        class="text" 
                        id="listen-url" 
                        name="listen-url" 
                        type="url"
                        placeholder="paste link" 
                    />
<!-- 
                    <button formaction="?/parseListenUrl">
                        get data
                    </button>
                </form> -->
                <div class="label-group">
                    <label 
                        class="text-label" 
                        for="artist-name"
                    >
                        artist name
                    </label>        
                    <span class="label-explainer">
                        * required
                    </span>
                </div>
                <input  
                    id="artist-mbid" 
                    name="artist-mbid" 
                    type="hidden"
                    value={addedItem?.artistMbid ?? null}
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
                    class="text" 
                    id="album-name" 
                    name="album-name" 
                    type="text"
                    placeholder="album name"
                    value={addedItem?.release_group_name ?? null}
                />
                <input  
                    id="release-group-mbid" 
                    name="release-group-mbid" 
                    type="hidden"
                    value={addedItem?.release_group_mbid ?? null}
                />
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
                />
                <button class="standard" formaction="?/postAlbum" type="submit">
                    submit
                </button>
            </form>
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
            <form method="POST"  name="track" class="vertical" action="?/postTrack" use:enhance>
                <input
                    id="item-type" 
                    name="item-type" 
                    type="hidden" 
                    value="recording"
                />
                <input
                    id="mbid-type" 
                    name="mbid-type" 
                    type="hidden" 
                    value="recording"
                />
                <input
                    id="mbid" 
                    name="mbid" 
                    type="hidden" 
                    value={addedItem?.recording_mbid ?? null} 
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
                        artist name
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
                />
                <input  
                    id="artist-mbid" 
                    name="artist-mbid" 
                    type="hidden"
                    value={addedItem?.artist_mbid ?? null}
                />
                <label 
                    class="text-label" 
                    for="album-name"
                >
                    album name
                </label>
                <input 
                    class="text" 
                    id="album-name" 
                    name="album-name" 
                    type="text"
                    placeholder="album name" 
                    value={addedItem?.release_group_name ?? null}
                />
                <input  
                    id="release-group-mbid" 
                    name="release-group-mbid" 
                    type="hidden"
                    value={addedItem?.release_group_mbid ?? null}
                />
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
                    class="text"    
                    id="track-name" 
                    name="track-name" 
                    type="text"
                    placeholder="track title" 
                    value={addedItem?.recording_name ?? null}
                />
                <input  
                    id="recording-mbid" 
                    name="recording-mbid" 
                    type="hidden"
                    value={addedItem?.recording_mbid ?? null}
                />
                <label 
                    class="text-label" 
                    for="postText"
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
                />
                <button class="standard" formaction="?/postTrack" type="submit">
                    submit
                </button>
            </form>
        </Tabs.Content>
        <Tabs.Content value="mix">
            <!-- <MusicBrainzSearch
                searchCategory="artists"
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch> -->
            <form method="POST" name="mix" class="vertical" action="?/postMix" use:enhance>
                <input
                    id="item-type" 
                    name="item-type" 
                    type="hidden" 
                    value="episode"
                />
                <input
                    id="mbid" 
                    name="mbid" 
                    type="hidden" 
                    value={addedItem?.artist_mbid ?? null} 
                />
                <div class="tooltip-group">
                    <label 
                        class="text-label" 
                        for="listen-url"
                    >
                        listen link
                    </label>
                    <Tooltip>
                        A link from Bandcamp, Soundcloud, Mixcloud, or YouTube can be embedded in your post. 
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
                    host / dj
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
                />
                <input  
                    id="artist-mbid" 
                    name="artist-mbid" 
                    type="hidden"
                    value={addedItem?.artist_mbid ?? null}
                />
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
                />
                <button class="standard" formaction="?/postMix" type="submit">
                    submit
                </button>
            </form>
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
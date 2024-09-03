<script lang="ts">
    import '$lib/styles/posts.css'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import { username } from '$lib/resources/localStorage.ts'

    import { Tabs } from "bits-ui";

    let addedItem: any
    let newItemAdded: boolean
    let type: string
</script>


<div class="border">
    <PanelHeader>
        now playing
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
                show episode / dj mix
            </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="album">
            <MusicBrainzSearch
                searchCategory="release_groups"
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form method="POST" action="?/postAlbum" name="album" class="vertical">
                <input
                    id="username"
                    name="username"
                    type="hidden"
                    value={username}
                />
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
                <label 
                    class="text-label" 
                    for="listen-url"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="listen-url" 
                    name="listen-url" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist-name"
                >
                    artist name
                </label>
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
                    value={addedItem?.artistName ?? null}
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
                    value={addedItem?.releaseGroupName ?? null}
                />
                <input  
                    id="release-group-mbid" 
                    name="release-group-mbid" 
                    type="hidden"
                    value={addedItem?.releaseGroupMbid ?? null}
                />
                <label 
                    class="text-label" 
                    for="post-text"
                >
                    write something
                </label>
                <textarea
                    cols="1"
                    rows="5"
                    id="post-text"
                    name="post-text"
                    spellcheck=true 
                />
                <button class="standard" formaction="?/postAlbum" type="submit">
                    submit
                </button>
            </form>
        </Tabs.Content>
        <Tabs.Content value="track">
            <MusicBrainzSearch
                searchCategory="recordings"
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form name="track" class="vertical">
                <input
                    id="username"
                    name="username"
                    type="hidden"
                    value={username}
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
                    value={addedItem?.recordingMbid ?? null} 
                />
                <label 
                    class="text-label" 
                    for="listen-url"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="listen-url" 
                    name="listen-url" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist-name"
                >
                    artist name
                </label>
                <input
                    class="text"  
                    id="artist-name" 
                    name="artist-name" 
                    type="text"
                    placeholder="artist name" 
                    value={addedItem?.artistName ?? null}
                />
                <input  
                    id="artist-mbid" 
                    name="artist-mbid" 
                    type="hidden"
                    value={addedItem?.artistMbid ?? null}
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
                    value={addedItem?.releaseGroupName ?? null}
                />
                <input  
                    id="release-group-mbid" 
                    name="release-group-mbid" 
                    type="hidden"
                    value={addedItem?.releaseGroupMbid ?? null}
                />
                <label
                    class="text-label" 
                    for="track-name"
                >
                    track name
                </label>
                <input 
                    class="text"    
                    id="track-name" 
                    name="track-name" 
                    type="text"
                    placeholder="track title" 
                    value={addedItem?.recordingName ?? null}
                />
                <input  
                    id="recording-mbid" 
                    name="recording-mbid" 
                    type="hidden"
                    value={addedItem?.recordingMbid ?? null}
                />
                <label 
                    class="text-label" 
                    for="postText"
                >
                    write something
                </label>
                <textarea
                    cols="1"
                    rows="5"
                    id="postText"
                    name="postText"
                    spellcheck=true 
                />
                <button class="standard" type="submit">
                    submit
                </button>
            </form>
        </Tabs.Content>
        <Tabs.Content value="mix">
            <MusicBrainzSearch
                searchCategory="artists"
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form name="mix" class="vertical">
                <input
                    id="username"
                    name="username"
                    type="hidden"
                    value={username}
                />
                <input
                    id="item-type" 
                    name="item-type" 
                    type="hidden" 
                    value="artist"
                />
                <input
                    id="mbid" 
                    name="mbid" 
                    type="hidden" 
                    value={addedItem?.artistMbid ?? null} 
                />
                <label 
                    class="text-label" 
                    for="listen-url"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="listen-url" 
                    name="listen-url" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist-name"
                >
                    host / dj
                </label>
                <input
                    class="text"  
                    id="artist-name" 
                    name="artist-name" 
                    type="text"
                    placeholder="artist name" 
                    value={addedItem?.artistName ?? null}
                />
                <input  
                    id="artist-mbid" 
                    name="artist-mbid" 
                    type="hidden"
                    value={addedItem?.artistMbid ?? null}
                />
                <label
                    class="text-label" 
                    for="episode"
                >
                    episode / mix title
                </label>
                <input 
                    class="text"    
                    id="episode" 
                    name="episode" 
                    type="text"
                    placeholder="episode" 
                    value={addedItem?.episodeName ?? null}
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
                    value={addedItem?.showName ?? null}
                />
                <label 
                    class="text-label" 
                    for="post-text"
                >
                    write something
                </label>
                <textarea
                    cols="1"
                    rows="5"
                    id="post-text"
                    name="post-text"
                    spellcheck=true 
                />
                <button class="standard" type="submit">
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
        margin: var(--freq-spacing-large) var(--freq-spacing-x-large);
        border: var(--freq-border-panel);
    }
    form.vertical {
        margin-top: 0;
    }
</style>
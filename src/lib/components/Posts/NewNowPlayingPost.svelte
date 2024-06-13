<script lang="ts">
    import '$lib/styles/posts.css'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

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
                searchCategory={type}
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form name="album" class="vertical">
                <input
                    id="type" 
                    name="type" 
                    type="hidden" 
                    value={type} 
                />
                <label 
                    class="text-label" 
                    for="embed"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="embed" 
                    name="embed" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist"
                >
                    artist name
                </label>
                <input
                    class="text"  
                    id="artist" 
                    name="artist" 
                    type="text"
                    placeholder="artist" 
                />
                <label 
                    class="text-label" 
                    for="album"
                >
                    album name
                </label>
                <input 
                    class="text" 
                    id="album" 
                    name="album" 
                    type="text"
                    placeholder="album" 
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
                />
                <button class="standard" type="submit">
                    submit
                </button>
            </form>
        </Tabs.Content>
        <Tabs.Content value="track">
            <MusicBrainzSearch
                searchCategory={type}
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form name="track" class="vertical">
                <input
                    id="type" 
                    name="type" 
                    type="hidden" 
                    value={type} 
                />
                <label 
                    class="text-label" 
                    for="embed"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="embed" 
                    name="embed" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist"
                >
                    artist name
                </label>
                <input
                    class="text"  
                    id="artist" 
                    name="artist" 
                    type="text"
                    placeholder="artist" 
                />
                <label 
                    class="text-label" 
                    for="album"
                >
                    album name
                </label>
                <input 
                    class="text" 
                    id="album" 
                    name="album" 
                    type="text"
                    placeholder="album" 
                />
                <label
                    class="text-label" 
                    for="track"
                >
                    track name
                </label>
                <input 
                    class="text"    
                    id="track" 
                    name="track" 
                    type="text"
                    placeholder="track" 
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
                />
                <button class="standard" type="submit">
                    submit
                </button>
            </form>
        </Tabs.Content>
        <Tabs.Content value="mix">
            <MusicBrainzSearch
                searchCategory={type}
                searchButtonText="search"
                searchPlaceholder="look it up"
                bind:addedItems={addedItem}
                bind:newItemAdded={newItemAdded}
                mode="single"
            ></MusicBrainzSearch>
            <form name="mix" class="vertical">
                <input
                    id="type" 
                    name="type" 
                    type="hidden" 
                    value={type} 
                />
                <label 
                    class="text-label" 
                    for="embed"
                >
                    listen link
                </label>
                <input 
                    class="text" 
                    id="embed" 
                    name="embed" 
                    type="text"
                    placeholder="paste link" 
                />
                <label 
                    class="text-label" 
                    for="artist"
                >
                    host / dj
                </label>
                <input
                    class="text"  
                    id="artist" 
                    name="artist" 
                    type="text"
                    placeholder="artist" 
                />
                <label
                    class="text-label" 
                    for="mix"
                >
                    episode / mix title
                </label>
                <input 
                    class="text"    
                    id="mix" 
                    name="mix" 
                    type="text"
                    placeholder="mix" 
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
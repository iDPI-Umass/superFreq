<script lang="ts">
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'

    let query: String
    let collectionType = "release_groups"
    let collectionTitle: String
    let collectionStatus: String
    let collectionReturned: Boolean
    // let collectionContents: Object
    let layout = "list"
    let mode = "new"
    let collectionItems = []
    $: collectionItems
    let itemAdded: boolean
    let buttonText = "search"
    let placeholderText = "placeholder text"
</script>

<div class="collection-builder">
    <div class="builder-header">
        <h1>
            new collection
        </h1>
    </div>
    <form class="form-box">
        <div class="form-block">
            <label class="text-label" for="collection-title">
                collection name
            </label>
            <input class="text" type="text" name="collection-title" id="collection-title" bind:value={collectionTitle} required />
            <fieldset>
                <legend>Type of collection</legend>
                <ul>
                    <li>
                        <input class="radio" type="radio" name="collection-type" id="artists" value="artists" bind:group={collectionType} />
                        <label for="artists">artists</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="collection-type" id="albums" value="release_groups" bind:group={collectionType} />
                        <label for="albums">albums</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="type" id="tracks" value="recordings" bind:group={collectionType} />
                        <label for="tracks">tracks</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset>
                <legend>Status of collection</legend>
                <ul>
                    <li>
                        <input class="radio" type="radio" name="status" id="open" value="open" bind:group={collectionStatus} />
                        <label for="open">open</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="status" id="public" value="public" bind:group={collectionStatus} />
                        <label for="public">public</label>
                    </li>
                    <li>
                        <input class="radio" type="radio" name="status" id="private" value="private" bind:group={collectionStatus} />
                        <label for="private">private</label>
                    </li>
                </ul>
            </fieldset>
        </div>
        <div class="form-block">
            <label class="text-label" for="description">
                Collection Description
            </label>
            <textarea
                id="description"
                name="description"
                rows="10"
                cols="1"
                spellcheck=true 
                required
            ></textarea>
            <!-- <button 
                class="double-border-top" 
                type="submit"
                on:click|preventDefault={submitCollectionContents}
                disabled={!(collectionStatus && collectionTitle)}
            >
                <div class="inner-border">
                    submit
                </div>
            </button> -->
        </div>
    </form>
    <div class="search-bar">
        <MusicBrainzSearch 
            collectionType={collectionType}
            bind:collectionItems={collectionItems}
            bind:itemAdded={itemAdded}
            searchButtonText={buttonText}
            searchPlaceholder={placeholderText}
        ></MusicBrainzSearch>
    </div>
    {#key collectionItems.length}
        <GridList 
            bind:collectionContents={collectionItems}
            collectionReturned={itemAdded}
            collectionType={collectionType}
            layout="list"
            mode="edit"
        ></GridList>
    {/key}
</div>

<style>
    .collection-builder {
        width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: var(--freq-border-panel);
    }
    .builder-header {
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        margin: var(--freq-spacing-3x-small) 0;
        align-items: center;
    }
    .builder-header h1 {
        text-transform: uppercase;
        font-size: var(--freq-font-size-medium);
        color: var(--freq-color-primary);
        padding: 0 var(--freq-width-spacer);
    }
    form {
        display: flex;
        flex-direction: row;
        gap: var(--freq-width-spacer);
        padding: var(--freq-width-spacer);
    }
    form label.text-label {
        text-transform: uppercase;
    }
    form input {
        width: auto;
    }
    .form-block {
        display: flex;
        flex-direction: column;
        width: 100%;
    }
    .search-bar {
        width: 100%;
        border-top: 1px solid var(--freq-color-border-panel);
        border-bottom: 1px solid var(--freq-color-border-panel);
        padding: 2vh 2vw;
    }
    .search-form {
        display: flex;
        flex-direction: row;
        gap: 0;
        align-items: center;
        width: 100%;
    }
    .search-form button{
        width: 150px;
    }
</style>
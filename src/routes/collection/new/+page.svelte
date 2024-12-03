<!--
	Search MusicBrainz database, populate an object with collection items, and insert rows into tables collections_info, collections_contents, and collections_social to create new collection in database.
-->

<script lang="ts">
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from '$lib/components/GridList.svelte'
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
	import InfoBox from 'src/lib/components/InfoBox.svelte'
    import CollectionEditor from '$lib/components/CollectionEditor.svelte'

    interface Props {
        data: any;
    }

    let { data }: Props = $props();
    let { sessionUserId, infoBoxText } = $state(data)

	let collectionTitle = $state() as string
	let collectionType = $state() as string
	let collectionStatus = $state() as string
    let defaultSort = $state() as string

	let collectionItems = $state([]) as object[]

	let itemAdded = $state(false)
    let imgPromise = $state(null)

	// UI
	const buttonTextLookup: {[index: string]: string} = {
		"": "...",
		"artists": "artists",
		"release_groups": "albums",
		"recordings": "tracks"
	}

    function searchButtonLabel ( lookup: string ) {
        if (!lookup) {
            return '...'
        }
        else return lookup
    }
	let placeholderText = "Search for items to add to your collection"
</script>

<svelte:options runes={true} />
<svelte:head>
	<title>
		New Collection
	</title>
</svelte:head>

<InfoBox mode="compact">
    A collection is a list of albums, tracks, mixes, or artists. Among many other things, you can make a colleciton to keep track of music you want to listen to or create a resource for other people who might want to learn more about music you love.
</InfoBox>

<div class="collection-container">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                new collection
            </span>
        {/snippet}
    </PanelHeader>
    <form
        class="horizontal"
        method="POST"
        action="?/insertCollection"
    >
        <div class="form-column">
            <input 
                type="hidden"
                name="collection-contents"
                id="collection-contents"
                value={JSON.stringify(collectionItems)}
            />
            <div class="label-group">
                <label 
                    class="text-label" 
                    for="collection-title"
                >
                    collection name
                </label>
                <span class="label-explainer">
                    * required
                </span>
            </div>
            <input 
                class="text" 
                type="text" 
                name="collection-title" 
                id="collection-title" 
                bind:value={collectionTitle} 
                required 
            />
            <!-- <fieldset>
                <div class="label-group">
                    <legend>Type of collection</legend>
                    <Tooltip>
                        All items in a collection must be the same type. You can not mix and match artists, ablums, and tracks.
                    </Tooltip>
                </div>
                <span class="label-explainer">
                    * required
                </span>
                <ul>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="artists" 
                            value="artists" 
                            bind:group={collectionType} 
                        />
                        <label for="artists">artists</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="albums" 
                            value="release_groups" 
                            bind:group={collectionType} 
                        />
                        <label for="albums">albums</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="collection-type" 
                            id="tracks" 
                            value="recordings" 
                            bind:group={collectionType} 
                        />
                        <label for="tracks">tracks</label>
                    </li>
                </ul>
            </fieldset> -->
            <fieldset>
                <div class="label-group">
                    <legend>view sort</legend>
                    <Tooltip>
                        This how your collection is sorted by default when other users view it. This does not change or effect the order of the items in the editor below.
                    </Tooltip>
                </div>
                <ul>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="view-sort" 
                            id="default" 
                            value="default" 
                            checked
                        />
                        <label for="default">default</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="view-sort" 
                            id="reverse" 
                            value="reverse" 
                        />
                        <label for="reverse">reverse</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="view-sort" 
                            id="artist-asc" 
                            value="artist_asc" 
                        />
                        <label for="artist-asc">artists a --> z</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="view-sort" 
                            id="artist-desc" 
                            value="artist_desc" 
                        />
                        <label for="artist-desc">artists z --> a</label>
                    </li>
                </ul>
            </fieldset>
            <fieldset>
                <div class="label-group">
                    <legend>Status of collection</legend>
                    <Tooltip>
                        <u>Open</u> collections can be viewed and edited by anyone.
                        <br />
                        <br />
                        <u>Public</u> collections can be viewed by anyone, but only edited by you.
                        <br />
                        <br />
                        <u>Private</u> collections can only be viewed and edited by you.
                    </Tooltip>
                </div>
                <span class="label-explainer">
                    * required
                </span>
                <ul>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="open" 
                            value="open" 
                            bind:group={collectionStatus} 
                        />
                        <label for="open">open</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="public" 
                            value="public" 
                            bind:group={collectionStatus} 
                        />
                        <label for="public">public</label>
                    </li>
                    <li>
                        <input 
                            class="radio" 
                            type="radio" 
                            name="status" 
                            id="private" 
                            value="private" 
                            bind:group={collectionStatus} 
                        />
                        <label for="private">private</label>
                    </li>
                </ul>
            </fieldset>
            {#if collectionStatus && collectionStatus != 'public'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionStatus]}
                </InfoBox>
            {/if}
        </div>
        <div class="form-column">
            <label 
                class="text-label" 
                for="description"
            >
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
            <div class="collection-info-button-spacing">
                <button 
                    class="double-border-top" 
                    type="submit"
                    formAction="?/insertCollection"
                    disabled={!(collectionStatus && collectionTitle && (collectionItems.length > 0))}
                >
                    <div class="inner-border">
                        create new collection
                    </div>
                </button>
            </div>
        </div>
    </form>
	<CollectionEditor
		bind:collectionItems={collectionItems}
		collectionType={collectionType}
        collectionStatus={collectionStatus}
		bind:itemAdded={itemAdded}
		bind:imgPromise={imgPromise}
	></CollectionEditor>
    <div class="bottom-double-border"></div>
</div>

<div class="buffer"></div>

<style>
    .bottom-double-border {
        padding-top: var(--freq-spacing-3x-small);
    }
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
</style>
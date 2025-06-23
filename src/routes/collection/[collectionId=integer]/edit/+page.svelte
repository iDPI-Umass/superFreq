<script lang="ts">
    import { onMount } from 'svelte'
    import SEO from '$lib/components/layout/SEO.svelte'
    import CollectionEditor from 'src/lib/components/collections/CollectionEditor.svelte'
    import Tooltip from 'src/lib/components/layout/Tooltip.svelte'
    import InfoBox from 'src/lib/components/layout/InfoBox.svelte'
	import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte'
    import SingleActionModal from '$lib/components/modals/SingleActionModal.svelte'
    import { promiseStates, collectionData, searchResults } from '$lib/resources/states.svelte'

    let { form, data } = $props()
    let { collection } = $state(data)

    const { sessionUserId, collectionId, infoBoxText, collectionSearchResults }: 
    {
        sessionUserId: string
        collectionId: string
        infoBoxText: App.StringLookupObject
        collectionSearchResults: App.RowData[]
    } = $derived(data)

    const collectionMetadata = $state(collection?.collectionMetadata as App.RowData)

	collectionData.title = collectionMetadata["title"]
	collectionData.type = collectionMetadata["type"] 
	collectionData.status = collectionMetadata["status"] 
	collectionData.descriptionText = collectionMetadata["description_text"]
    collectionData.defaultSort = collectionMetadata["default_view_sort"]

	collectionData.collectionItems = collection.collectionContents as App.RowData[]
	
    collectionData.deletedItems = collection.deletedCollectionContents as App.RowData[]

    const isOwner = $derived(( sessionUserId == collectionMetadata.owner_id ) ? true : false)

    let showModal = $state(false)

    onMount(() => {
        promiseStates.newItemAdded = false
        promiseStates.imgPromise = null
    })

    $effect(() => {
        searchResults.results = collectionSearchResults
        searchResults.category = 'collections'
    })
</script>

<SEO title="Edit {collectionMetadata.title}"></SEO>

<div class="collection-container">
    <PanelHeader>
        {#snippet headerText()}
            <span >
                edit collection
            </span>
        {/snippet}
    </PanelHeader>
    <form 
        class="horizontal" 
        method="POST" 
        action ="?/updateCollection"
    >
        <div class="form-column">
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
                value={collectionData.title} required 
            />       
            <input 
                type="hidden"
                name="status"
                value={collectionData.status}
            />
            {#key collectionData.collectionItems.length}
                <input 
                    type="hidden"
                    name="collection-contents"
                    value={JSON.stringify(collectionData.collectionItems)}
                />
            {/key}
            {#key collectionData.deletedItems.length}
                <input 
                    type="hidden"
                    name="deleted-items"
                    value={JSON.stringify(collectionData.deletedItems)}
                />
            {/key}
            {#if isOwner}
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
                                id="view-sort" 
                                value="default" 
                                bind:group={collectionData.defaultSort}
                            />
                            <label for="default">default</label>
                        </li>
                        <li>
                            <input 
                                class="radio" 
                                type="radio" 
                                name="view-sort" 
                                id="view-sort" 
                                value="reverse" 
                                bind:group={collectionData.defaultSort}
                            />
                            <label for="reverse">reverse</label>
                        </li>
                        <li>
                            <input 
                                class="radio" 
                                type="radio" 
                                name="view-sort" 
                                id="view-sort" 
                                value="artist_asc" 
                                bind:group={collectionData.defaultSort}
                            />
                            <label for="artist-asc">artists a --> z</label>
                        </li>
                        <li>
                            <input 
                                class="radio" 
                                type="radio" 
                                name="view-sort" 
                                id="view-sort" 
                                value="artist_desc" 
                                bind:group={collectionData.defaultSort}
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
                    <ul>
                        <li>
                            <input 
                                class="radio" 
                                type="radio" 
                                name="status" 
                                id="open" 
                                value="open" 
                                bind:group={collectionData.status} 
                            />
                            <label for="open">
                                open
                            </label>
                        </li>
                        <li>
                            <input 
                                class="radio"
                                type="radio" 
                                name="status" 
                                id="public" 
                                value="public" 
                                bind:group={collectionData.status}  
                             />
                            <label for="public">
                                public
                            </label>
                        </li>
                        <li>
                            <input 
                                class="radio" 
                                type="radio" 
                                name="status" 
                                id="private" 
                                value="private" 
                                bind:group={collectionData.status}  
                            />
                            <label for="private">
                                private
                            </label>
                        </li>
                    </ul>
                </fieldset>
            {/if}
            {#if collectionData.status && collectionData.status != 'public'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionData.status]}
                </InfoBox>
            {/if}
        </div>
        <div class="form-column">
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
            >{collectionData.descriptionText}</textarea>
            <div class="collection-info-button-spacing">
                <button 
                    type="button"
                    class="double-border-top"
                    onclick={() => showModal = true}
                >
                    <div class="inner-border">
                        delete collection
                    </div>
                </button>
                <button 
                    class="double-border-top" 
                    formAction = '?/updateCollection'
                    disabled={!(collectionData.status && collectionData.title)}
                >
                    <div class="inner-border">
                        save edits
                    </div>
                </button>
            </div>
        </div>
    </form>
	<CollectionEditor
	></CollectionEditor>
    <div class="bottom-double-border"></div>
</div>

<SingleActionModal
    bind:showModal={showModal}
    formAction="?/deleteCollection"
    buttonText="delete collection"
    success={form?.success}
>
    {#snippet headerText()}
        delete collection?
    {/snippet} 
    {#snippet message()}
        Do you want to delete this collection? You will never be able to access it again.
    {/snippet} 
</SingleActionModal>

<div class="buffer"></div>

<style>
    .bottom-double-border {
        padding-top: var(--freq-spacing-3x-small);
    }
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
</style>
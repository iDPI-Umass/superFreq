<script lang="ts">
    import type { PageData } from './$types';

    import SEO from '$lib/components/layout/SEO.svelte'
    import CollectionEditor from '$lib/components/CollectionEditor.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
    import InfoBox from '$lib/components/InfoBox.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'
    import SingleActionModal from 'src/lib/components/modals/SingleActionModal.svelte'

    let { form, data }:  {data: PageData} = $props()
    let { collection } = $state(data)

    const { sessionUserId, collectionId, infoBoxText }: 
    {
        sessionUserId: string
        collectionId: string
        infoBoxText: App.StringLookupObject
    } = data

    let imgPromise = $state(null)

    const collectionInfo = $state(collection?.info as App.RowData)

	let collectionTitle = $state(collectionInfo["title"]) 
	let collectionType = collectionInfo["type"] 
	let collectionStatus = $state(collectionInfo["status"]) 
	let descriptionText = $state(collectionInfo["description_text"] )
    let defaultSort = $state(collectionInfo["default_view_sort"])

	let collectionItems = $state(collection?.collectionContents as App.RowData[])

	let itemAdded = $state(false)
	
    let deletedItems = $state(collection?.deletedCollectionContents as App.RowData[])

    const isOwner = $derived(( sessionUserId == collectionInfo.owner_id ) ? true : false)

    let showModal = $state(false)

</script>

<SEO title="Edit {collectionInfo.title}"></SEO>

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
                bind:value={collectionTitle} required 
            />       
            <input 
                type="hidden"
                name="status"
                value={collectionStatus}
            />
            {#key collectionItems?.length}
                <input 
                    type="hidden"
                    name="collection-contents"
                    value={JSON.stringify(collectionItems)}
                />
            {/key}
            {#key deletedItems?.length}
                <input 
                    type="hidden"
                    name="deleted-items"
                    value={JSON.stringify(deletedItems)}
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
                                bind:group={defaultSort}
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
                                bind:group={defaultSort}
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
                                bind:group={defaultSort}
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
                                bind:group={defaultSort}
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
                                bind:group={collectionStatus} 
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
                                bind:group={collectionStatus} 
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
                                bind:group={collectionStatus} 
                            />
                            <label for="private">
                                private
                            </label>
                        </li>
                    </ul>
                </fieldset>
            {/if}
            {#if collectionStatus && collectionStatus != 'public'}
                <InfoBox
                    mode="inline"
                >
                    {infoBoxText[collectionStatus]}
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
            >{descriptionText}</textarea>
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
                    disabled={!(collectionStatus && collectionTitle)}
                >
                    <div class="inner-border">
                        save edits
                    </div>
                </button>
            </div>
        </div>
    </form>
	<CollectionEditor
		bind:collectionItems={collectionItems}
		bind:deletedItems={deletedItems}
		collectionType={collectionType}
        collectionStatus={collectionStatus}
		bind:itemAdded={itemAdded}
		bind:imgPromise={imgPromise}
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
<script lang="ts">
    import type { PageData } from './$types';

    import CollectionEditor from '$lib/components/CollectionEditor.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
    import InfoBox from '$lib/components/InfoBox.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'


    let { data }:  {data: PageData} = $props()
    let { collection } = $state(data)

    const { sessionUserId, collectionId, infoBoxText }: 
    {
        sessionUserId: string
        collectionId: string
        infoBoxText: App.StringLookupObject
    } = data

    let imgPromise = $state(null)

	/* 
	Let's declare some variables for...
	*/

    const collectionInfo = $state(collection?.info as App.RowData)

	// collections_info
	let collectionTitle = $state(collectionInfo["title"]) 
	let collectionType = collectionInfo["type"] 
	let collectionStatus = $state(collectionInfo["status"]) 
	let descriptionText = $state(collectionInfo["description_text"] )

	let collectionItems = $state(collection?.collectionContents as App.RowData[])

	let itemAdded = $state(false)
	
    let deletedItems = $state(collection?.deletedCollectionContents as App.RowData[])

    const isOwner = $derived(( sessionUserId == collectionInfo.owner_id ) ? true : false)

</script>
<svelte:options runes={true} />

<svelte:head>
	<title>
		Edit {collectionInfo.title}
	</title>
</svelte:head>


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
                {#if collectionStatus && collectionStatus != 'public'}
                    <InfoBox
                        mode="inline"
                    >
                        {infoBoxText[collectionStatus]}
                    </InfoBox>
                {/if}
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

<div class="buffer"></div>

<style>
    .bottom-double-border {
        padding-top: var(--freq-spacing-3x-small);
    }
    .buffer {
        padding-bottom: var(--freq-spacing-large);
    }
</style>
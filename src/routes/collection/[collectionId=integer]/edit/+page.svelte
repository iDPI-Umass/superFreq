<script lang="ts">
    import type { PageData } from './$types';

    import CollectionEditor from '$lib/components/CollectionEditor.svelte'
    import Tooltip from '$lib/components/Tooltip.svelte'
    import InfoBox from '$lib/components/InfoBox.svelte'
	import PanelHeader from '$lib/components/PanelHeader.svelte'


	export let data: PageData;
    let { collection, sessionUserId, collectionId, infoBoxText } = data;
    $: ({ collection, sessionUserId, collectionId, infoBoxText } = data);

    let imgPromise
    $: imgPromise

	/* 
	Let's declare some variables for...
	*/

    const collectionInfo = collection?.info as App.RowData

	// collections_info
	let collectionTitle = collectionInfo["title"] 
	let collectionType = collectionInfo["type"] 
	let collectionStatus = collectionInfo["status"] 
	let descriptionText = collectionInfo["description_text"] 

    $: collectionStatus

	let collectionItems = collection?.collectionContents as App.RowData[]
	$: collectionItems
	let itemAdded = false
	
    let deletedItems = collection?.deletedCollectionContents as App.RowData[]
    $: deletedItems

    const isOwner = ( sessionUserId == collectionInfo.owner_id ) ? true : false
</script>

<svelte:head>
	<title>
		Edit {collectionInfo.title}
	</title>
</svelte:head>


<div class="collection-container">
    <PanelHeader>
        <span slot="text">
            edit collection
        </span>
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
            <input class="text" type="text" name="collection-title" id="collection-title" bind:value={collectionTitle} required />
            <input 
                type="hidden"
                name="collection-id"
                value={collectionId}
            />
            <input 
                type="hidden"
                name="collection-type"
                value={collectionType}
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
            <input 
                type="hidden"
                name="updated-by"
                value={sessionUserId}
            />
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
                    edit collection
                </div>
                </button>
            </div>
        </div>
    </form>
	<CollectionEditor
		bind:collectionItems={collectionItems}
		bind:deletedItems={deletedItems}
		collectionType={collectionType}
		itemAdded={itemAdded}
		bind:imgPromise={imgPromise}
	></CollectionEditor>
</div>

<style>
    @media screen and (max-width: 600px) {
        form.horizontal {
            flex-direction: column;
        }
    }
</style>
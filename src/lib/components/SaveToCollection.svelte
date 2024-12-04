<script lang="ts">
    import { enhance } from '$app/forms'
    import Save from 'lucide-svelte/icons/save'

    import ListModal from '$lib/components/modals/ListModal.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    interface ComponentProps {
        showCollectionsListModal: boolean,
        showSuccessModal: boolean,
        item: App.RowData,
        soureCollectionInfo?: App.RowData,
        collections: App.RowData[]
    }

    let { 
        showCollectionsListModal = $bindable(false),
        showSuccessModal = $bindable(false), 
        item,
        soureCollectionInfo,
        collections = [],
    }: ComponentProps = $props()

    let addingItem = $state(false)

    let savedToCollectionId = $state() as string
    let savedToCollectionTitle = $state() as string
    let savedToCollectionRoute = $state() as string

    function savedToCollection ( collection: App.RowData ) {
        savedToCollectionId = collection.collection_id
        savedToCollectionTitle = collection.title
        savedToCollectionRoute = `/collection/${savedToCollectionId}`
        addingItem = false
    }

    
</script>

<svelte:options runes={true} />

<form 
    method="POST"
    action="?/getCollectionList" 
    use:enhance
>
    <button 
        class="like" 
        type="submit"
    >
        <Save class="icon" size="16" color="var(--freq-color-text-muted)"></Save>
        Save
    </button>
</form>

<ListModal
    bind:showModal={showCollectionsListModal}
>
    {#snippet headerText()}
        Save item to a collection
    {/snippet}
    {#snippet list()}
        
        {#await collections}
            loading list of your collections
        {:then}
            <ol class="list-modal">
                {#each collections as collection}
                    <form 
                        method="POST"
                        action="?/saveToCollection" 
                        use:enhance={() => {
                            addingItem = true
                            savedToCollection ( collection )
                            return async ({ update }) => {
                                await update()
                                addingItem = false
                            }}
                        }
                    >
                        <input 
                            type="hidden" 
                            id="artist-mbid" 
                            name="artist-mbid" 
                            value={item.artist_mbid} 
                        />
                        <input 
                            type="hidden" 
                            id="release-group-mbid" 
                            name="release-group-mbid" 
                            value={item.release_group_mbid} 
                        />
                        <input 
                            type="hidden" 
                            id="recording-mbid" 
                            name="recording-mbid" 
                            value={item.recording_mbid} 
                        />
                        <input 
                            type="hidden" 
                            id="item-type" 
                            name="item-type" 
                            value={item.item_type} 
                        />
                        <input 
                            type="hidden" 
                            id="saved-from-post" 
                            name="saved-from-post" 
                            value={item.now_playing_post_id ?? item.id} 
                        />
                        <input 
                            type="hidden" 
                            id="saved-from-collection" 
                            name="saved-from-collection" 
                            value={soureCollectionInfo?.collection_id} 
                        />
                        <input 
                            type="hidden" 
                            id="collection-id" 
                            name="collection-id" 
                            value={collection.collection_id} 
                        />
                        <li class="list-modal">
                            <div class="list-modal-li-row">
                                <div class="list-modal-li-row-button-spacing">
                                    <button
                                        class="add"
                                        type="submit"
                                        disabled={addingItem}
                                    >
                                        + save
                                    </button>
                                </div>
                                {collection.title}
                            </div>
                        </li>
                    </form>
                {/each}
            </ol>
        {/await}
    {/snippet}
</ListModal>

<NotificationModal
    bind:showModal={showSuccessModal}
>
    {#snippet headerText()}
        Success!
    {/snippet}
    {#snippet message()}
        Item saved to your collection <a href={savedToCollectionRoute}>{savedToCollectionTitle}</a>.
    {/snippet}
</NotificationModal>

<style>
    a {
        text-decoration: underline;
        color: var(--freq-color-primary);
    }
    a:is(:hover, :focus) {
        color: var(--freq-color-text);
    }
</style>
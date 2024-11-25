<script lang="ts">
    import { enhance } from '$app/forms'
    import Save from 'lucide-svelte/icons/save'

    import ListModal from '$lib/components/modals/ListModal.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'
	import { addCollectionItem } from '../resources/musicbrainz';

    interface ComponentProps {
        showCollectionsListModal: boolean,
        showSuccessModal: boolean,
        item: App.RowData,
        collectionInfo?: App.RowData,
        collections: App.RowData[]
    }

    let { 
        showCollectionsListModal = $bindable(false),
        showSuccessModal = $bindable(false), 
        item,
        collectionInfo,
        collections,
    }: ComponentProps = $props()

    let addingItem = $state(false)
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
                        use:enhance
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
                            id="saved-from-post" 
                            name="saved-from-post" 
                            value={item.now_playing_post_id ?? item.id} 
                        />
                        <input 
                            type="hidden" 
                            id="saved-from-collection" 
                            name="saved-from-collection" 
                            value={collectionInfo?.collection_id} 
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
        Item saved to your collection.
    {/snippet}
</NotificationModal>
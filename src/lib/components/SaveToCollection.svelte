<script lang="ts">
    import { enhance } from '$app/forms'
    import Save from 'lucide-svelte/icons/save'

    import ListModal from '$lib/components/modals/ListModal.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'

    interface ComponentProps {
        showCollectionsListModal: boolean
        showSuccessModal: boolean
        postId?: string
        collections: App.RowData[]
    }

    let { 
        showCollectionsListModal = $bindable(false),
        showSuccessModal = $bindable(false), 
        postId,
        collections = [],
    }: ComponentProps = $props()

    let addingItem = $state(false)

    let savedToCollectionId = $state() as string
    let savedToCollectionTitle = $state() as string
    let savedToCollectionRoute = $state() as string

    function savedToCollection ( collection: App.RowData ) {
        savedToCollectionId = collection.collection_id
        savedToCollectionTitle = collection.title
        savedToCollectionRoute = `/collection/${collection.id}`
    }

</script>

<svelte:options runes={true} />

<form 
    method="POST"
    action="?/getCollectionList" 
    use:enhance
>
    <input 
        type="hidden" 
        id="post-id" 
        name="post-id" 
        value={postId} 
    />
    <button 
        class="like" 
        type="submit"
    >
        <div class="row-group-icon-description">
            <Save class="icon" size="16" color="var(--freq-color-text-muted)"></Save>
            <span class="descriptor">
                Save
            </span>
        </div>
    </button>
</form>

<ListModal
    bind:showModal={showCollectionsListModal}
>
    {#snippet headerText()}
        Save item to a collection
    {/snippet}

    {#snippet list()}
        <ol class="list-modal">
            {#each collections as collection}
            <li class="list-modal">
                <div class="list-modal-li-row">
                    <div class="list-modal-li-row-button-spacing">
                        <form 
                            method="POST"
                            action="?/saveToCollection" 
                            use:enhance={() => {
                                addingItem = true
                                savedToCollectionId = collection.collection_id
                                savedToCollectionTitle = collection.title
                                savedToCollectionRoute = `/collection/${collection.collection_id}`
                                return async ({ update }) => {
                                    await update()
                                    addingItem = false
                                    return{ savedToCollectionId, savedToCollectionTitle, savedToCollectionRoute }
                                }}
                            }
                        >
                            <input 
                                type="hidden" 
                                id="collection-id" 
                                name="collection-id" 
                                value={collection?.collection_id} 
                            />
                            <button
                                class="add"
                                type="submit"
                                disabled={addingItem}
                            >
                                + save
                            </button>
                        </form>
                    </div>
                    {collection.title}
                </div>
            </li>
            {/each}
        </ol>
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
<script lang="ts">
    import { enhance } from '$app/forms'
	import ListModal from 'src/lib/components/modals/ListModal.svelte'
	import { addCollectionItemNoImg } from '$lib/resources/musicbrainz';
    import { searchResults, collectionData } from '$lib/resources/states.svelte'


	interface ComponentProps {
        searchCategory: string
		searchButtonText: string
		searchPlaceholder: string
        query?: string
		mode?: string
		limit?: string | null
        results: App.RowData[]
        resultsCategory?: string | null
	}

	let {
        searchCategory,
		searchButtonText,
		searchPlaceholder,
        query = '',
		mode = 'search', // "search", "collection"
		limit = '25',
        results = [],
        resultsCategory
	}: ComponentProps = $props()

	let showModal = $state( false )
	let addingItem = $state(false)

    let loading = $state(false)

    let searchComplete = $derived( results.length > 0 ? true : false )

    let validQuery = $derived( query && query.length > 0 ? true : false)

    // async function addCollectionItem ( mode: string, item: App.RowData ) {
    //     const collectionItems = await addCollectionItemNoImg( item, collectionData.collectionItems, collectionData.deletedItems, limit, searchCategory, mbidCategory )
    //     collectionData.collectionItems = collectionItems.addedItems
    //     collectionData.deletedItems = collectionItems.deletedItems
    //     query = ""
    //     searchResults.results = []
    //     showModal = false
    //     addingItem = false
    //     return { query, searchComplete, showModal }
    // }
	
</script>

<div class="search-bar">
	<ListModal bind:showModal>
		{#snippet headerText()}
			{#if !searchResults.query}
			Please enter valid input in the search bar.
			{:else }
			Results for {searchResults.category} search <span class="dialog-header">{searchResults.query}</span>
			{/if}
		{/snippet}
		{#snippet list()}
			<div>
				{#await results.length > 0 then}
					<ol class="list-modal">
						{#each results as item}
						<li class="list-modal">
							<div class="list-modal-li-row">
								{#if collectionEditor}
                                    <div class="list-modal-li-row-button-spacing">
                                        <button 
                                            class="add"
                                            aria-label="add item"
                                            onclick={() => {
                                                addCollectionItem(mode, item)
                                                }}
                                            disabled={addingItem}
                                        >
                                            + add
                                        </button>
                                    </div>
								{/if}
								{#if resultsCategory == "collections"}
									<span class="list-modal">
										<span class="list-modal-bold">
											{item.title}
										</span>
										<br />
										by {item.display_name} <span class="data-muted">({item.username})</span>
									</span>
								{/if}
							</div>
						</li>
						{/each}
					</ol>
                {:catch}
                    <p>no results</p>
				{/await}
			</div>
		{/snippet}
	</ListModal>
	<form
        method="POST" 
        class="search"
        action="?/search"
        use:enhance={({formData, formElement}) => {
            loading = true
            searchResults.query = query
            searchResults.category = searchCategory
            return async ({ update }) => {
                await update()
                showModal = true
                loading = false
                return
            }
        }}
    >
		<button 
            type="submit"
			class="double-border-top"
			disabled={!validQuery || loading}
		>
			<div class="inner-border">
				{searchButtonText}
			</div>
		</button>
		<div class="input-sizing">
			<input
				class="search" 
				type="search" 
				id="query" 
				name="query" 
				placeholder={searchPlaceholder}
				aria-label={searchPlaceholder}
				size="40" 
				bind:value={query}
			/>
            <input 
                type="hidden"
                name="results-limit"
                id="results-limit"
                value={limit}
            />
            <input 
                type="hidden"
                name="search-category"
                id="search-category"
                value={searchCategory}
            />
            <input 
                type="hidden"
                name="query-type"
                id="query-type"
                value="title"
            />
		</div>
	</form>
</div>

<style>
	.search-layout {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
    .search-bar {
        display: flex;
        flex-direction: row;
		height: fit-content;
        gap: 0;
        align-items: center;
    }
	span.dialog-header {
		text-transform: uppercase;
	}
	.input-sizing {
		max-width: 100%;
	}
	.result-image {
		width: 100px;
		margin-left: auto;
		margin-right: 0;
	}
    span.username {
        font-style: italic;
        color: var(--freq-color-text-muted);
    }
	@media screen and (max-width: 600px) {
		form.search {
			display: flex;
			flex-wrap: wrap-reverse;
			align-items: start;
		}
        /* .search-bar * {
            flex-direction: column;
			align-items: start;
        } */
    }
</style>
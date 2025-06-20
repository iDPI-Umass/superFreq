<script lang="ts">
	import { onMount } from 'svelte'
	import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from 'src/lib/components/layout/PanelHeader.svelte'
	import CollectionEditor from 'src/lib/components/Collections/CollectionEditor.svelte'
	import { enhance } from '$app/forms'
	import { promiseStates, collectionData } from '$lib/resources/states.svelte'

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { collectionContents, deletedCollectionContents } =  $state(data)

	collectionData.collectionItems = collectionContents ? collectionContents : [] as App.RowData[]
	collectionData.deletedItems = deletedCollectionContents ? deletedCollectionContents : [] as App.RowData[]
	collectionData.status = 'public'
	collectionData.type = 'release_groups'

	let loadingSubmission = $state(false)

	onMount(() => {
		promiseStates.newItemAdded = false
		promiseStates.imgPromise =  null
	})
</script>

<SEO title="Choose top albums"></SEO>


<div class="panel">
    <PanelHeader>
		{#snippet headerText()}
			<span >
				my top albums
			</span>
		{/snippet}
    </PanelHeader>
    <form class="horizontal" method="POST" action='?/submitCollection' use:enhance={( form ) => {
		loadingSubmission = true
		return async ({ update }) => {
			await update();
			loadingSubmission = false
		}
	}}>
		<p>Pick your top 8 albums to display on your profile.</p>
		{#key collectionData.collectionItems.length}
		<input 
			type="hidden"
			name="collection-items"
			id="collection=items"
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
        <button 
            class="double-border-top" 
            type="submit"
			disabled={loadingSubmission}
        >
            <div class="inner-border">             
                submit
            </div>
        </button>
    </form>
	<CollectionEditor
		limit="8"
		mode="release_group"
	></CollectionEditor>
</div>

<style>
	.horizontal {
		justify-content: space-between;
		align-items: center;
	}
</style>
<script lang="ts">
	import { onMount } from 'svelte'
	import SEO from '$lib/components/layout/SEO.svelte'
    import PanelHeader from '$lib/components/PanelHeader.svelte'
	import CollectionEditor from '$lib/components/CollectionEditor.svelte'
	import { enhance } from '$app/forms'
	import { actionStates } from '$lib/resources/states.svelte';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { collectionContents, deletedCollectionContents } =  $state(data)

	let collectionType = "release_groups"

	let imgPromise = $state(null)

	let collectionItems = $state(collectionContents ? collectionContents : [] as App.RowData[])

	let deletedItems = $state(deletedCollectionContents ? deletedCollectionContents : [] as App.RowData[])

	let loadingSubmission = $state(false)

	onMount(() => {
		actionStates.newItemAdded = false
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
		{#key collectionItems?.length}
		<input 
			type="hidden"
			name="collection-items"
			id="collection=items"
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
		bind:collectionItems={collectionItems}
		bind:deletedItems={deletedItems}
		collectionStatus="public"
		collectionType={collectionType}
		limit="8"
		mode="release_group"
		bind:imgPromise={imgPromise}
	></CollectionEditor>
</div>

<style>
	.horizontal {
		justify-content: space-between;
		align-items: center;
	}
</style>
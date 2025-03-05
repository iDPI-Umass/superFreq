<script lang="ts">
    import PanelHeader from '$lib/components/PanelHeader.svelte'
	import CollectionEditor from '$lib/components/CollectionEditor.svelte'

	interface Props {
		data: any;
	}

	let { data }: Props = $props();
	let { collectionContents, deletedCollectionContents } =  $state(data)

	let collectionType = "release_groups"

	let imgPromise = $state(null)

	let collectionItems = $state(collectionContents ? collectionContents : [] as App.RowData[])

	let deletedItems = $state(deletedCollectionContents ? deletedCollectionContents : [] as App.RowData[])

	let itemAdded = $state(false)
</script>

<!-- <svelte:options runes={true} /> -->
<svelte:head>
	<title>
		Choose Top Albums
	</title>
</svelte:head>


<div class="panel">
    <PanelHeader>
		{#snippet headerText()}
			<span >
				my top albums
			</span>
		{/snippet}
    </PanelHeader>
    <form class="horizontal" method="POST" action='?/submitCollection'>
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
		mode="release_group"
		itemAdded={itemAdded}
		bind:imgPromise={imgPromise}
	></CollectionEditor>
</div>

<style>
	.horizontal {
		justify-content: space-between;
		align-items: center;
	}
</style>
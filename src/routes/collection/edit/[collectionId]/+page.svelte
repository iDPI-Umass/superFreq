<script lang="ts">
    import {dndzone} from 'svelte-dnd-action';
	import {flip} from 'svelte/animate';

    export let data;
    let { supabase, session, collectionContents } = data;
    $: ({ supabase, session, collectionContents } = data);

	const flipDurationMs = 200;

	function handleSort(e) {
		items = e.detail.items;
	}

	let title = "";

    let items = {};
    for ( const contentItem of collectionContents ) {
        contentItem["id"] = collectionContents.indexOf(contentItem) + 1;
		title = contentItem["title"];
    }

	items = collectionContents;

	
</script>

<h1>{title}</h1>
<section aria-label={title} use:dndzone={{items, flipDurationMs}} on:consider={handleSort} on:finalize={handleSort}>
	{#each items as item(item.id)}
		<div aria-label={item.release_group_name} class="sort-item" animate:flip={{duration:flipDurationMs}}>
			{item.release_group_name}	
		</div>
	{/each}
</section>

<style>
    section {
        width: 50%;
        padding: 0.3em;
        border: 1px solid white;
        /* this will allow the dragged element to scroll the list */
        overflow: scroll;
        height: 200px;
    }
    .sort-item {
        width: 50%;
        padding: 0.2em;
        border: 1px solid var(--freq-purple);
        margin: 0.15em 0;
    }
</style>
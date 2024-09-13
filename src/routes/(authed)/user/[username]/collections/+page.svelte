<script lang="ts">
    export let data

    let { collections, username } = data
    $: ({ collections, username } = data)
</script>

<svelte:head>
	<title>
		${username}'s collections
	</title>
</svelte:head>

<ul>
    {#each collections as collection}
    <li>
        <a href="/collection/${collection.id}">
            {collection.title} by {collection.display_name}
        </a>
    </li>
    {/each}
</ul>
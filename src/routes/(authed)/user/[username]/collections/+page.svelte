<script lang="ts">
    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { collections, username } = $derived(data)

</script>

<svelte:options runes={true} />
<svelte:head>
	<title>
		${username}'s collections
	</title>
</svelte:head>

<ul>
    {#each collections as collection}
    <li>
        <a href="/collection/{collection.id}">
            {collection.title} by {collection.display_name}
        </a>
    </li>
    {/each}
</ul>
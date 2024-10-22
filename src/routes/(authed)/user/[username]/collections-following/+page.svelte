<script lang="ts">
    import { run } from 'svelte/legacy';

    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { collections, username } = $state(data)
    run(() => {
        ({ collections, username } = data)
    });
</script>

<svelte:head>
	<title>
		Collections ${username} follows
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
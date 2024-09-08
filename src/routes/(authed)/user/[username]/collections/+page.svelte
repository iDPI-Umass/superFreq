<script lang="ts">
    export let data

    let { collections } = data
    $: ({ collections } = data)
</script>

<ul>
    {#each collections as collection}
    <li>
        <a href="/collection/${collection.id}">
            ${collection.title} by ${collection.display_name}
        </a>
    </li>
    {/each}
</ul>
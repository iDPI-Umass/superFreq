<script lang='ts'>
    let { data, form } = $props()

    let { results } = $derived(data)

    $effect(() => {
        console.log(results)
    })
</script>

<div class="panel">
    <form method="POST" action="?/searchCollections">
        <input
            type="text"
            name="collection-query"
            id="collection-query"
            required
        />
        <button type="submit" class="standard">
            search
        </button>
    </form>
</div>

<div class="panel">
    <ul class="search-results">
    {#each results as result}
        <li>
            {result.title}
            <span class="search-result-tag">collection</span>
        </li>
    {/each}
    </ul>
</div>

<style>
    .search-results {
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: none;
        padding: 0;
    }
    .search-results li {
        display: flex;
        flex-direction: column;
        gap: var(--freq-height-spacer-gap-quarter);
        border-bottom: var(--freq-border-panel);
        padding: var(--freq-spacing-medium)
    }
    .search-results li:last-child {
        border-bottom: none;
    }
    .search-results li:is(:hover, :focus) {
        color: var(--freq-color-text-dark);
	    background: var(--freq-color-button-lens-active);
        text-decoration: underline;
    }
    .search-results li:active {
        background: var(--freq-color-button-lens-active);
        color: var(--freq-color-text);
        text-decoration: underline;
        transition: all;
    }
    .search-results li:is(:hover, :focus, :active) .search-result-tag {
        text-decoration: none !important;
    }
    .search-result-tag {
        color: var(--freq-color-text-medium);
        font-size: var(--freq-font-size-x-small);
        text-transform: uppercase;
        font-weight: var(--freq-font-weight-semi-bold);
        letter-spacing: var(--freq-letter-spacing-looser);
    }
</style>
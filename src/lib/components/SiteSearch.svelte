<script lang="ts">
    import { enhance } from "$app/forms"
    import { Popover } from "bits-ui"
    import Search from '@lucide/svelte/icons/search'


    interface ComponentProps {
        query?: string
        searchPlaceholder?: string
        formAction: string
        results: App.RowData[]
    }

    let { 
        query, 
        searchPlaceholder,
        formAction, 
        results 
    }: ComponentProps = $props()

    let loading = $state(false)
    let searchBarOpen = $state(false)
    let searchResultsOpen = $state(false)
</script>

<div class="constrain">
<Popover.Root bind:open={searchBarOpen}>
    <Popover.Trigger class="search">
        <Search size="16" color="var(--freq-color-text-medium-dark)"></Search>
        Search
    </Popover.Trigger>
    <Popover.Content class="search">
        <form 
            method="POST" 
            action="?/{formAction}" 
            use:enhance={() => {
                loading = true
                return async ({ update }) => {            
                    await update()
                    loading = false
                    searchResultsOpen = true
            }}}
        >
            <input
                type="text"
                name="collection-query"
                id="collection-query"
                placeholder={searchPlaceholder}
                bind:value={query}
                required
            />
            <button type="submit" class="standard" disabled={loading}>
                search
            </button>
        </form>
        <ul class="search-results">
            {#each results as result}
                {#if result.result_type == 'collection'}
                    <li>
                        <a href="/collection/{result.collection_id}">
                        {result.title}
                            <div class="result-row">
                                by 
                                <span class="display-name">{result.display_name}</span> 
                                <span class="data-muted">({result.username})</span>
                            </div>
                            <span class="search-result-tag">collection</span>
                        </a>
                    </li>
                {:else if result.result_type == 'user'}
                    <li>
                        <a href="/user/{result.username}">
                            <div class="result-row">
                                <span class="display-name">{result.display_name}</span> 
                                <span class="data-muted">{result.username}</span>
                            </div>
                            <span class="search-result-tag">user</span>
                        </a>
                    </li>
                {/if}
            {/each}
            </ul>
    </Popover.Content>
</Popover.Root>
</div>



<style>
    form {
        display: flex;
        flex-flow: row;
        align-items: center;
        gap: var(--freq-inline-gap-double);
        margin: var(--freq-spacing-small) auto var(--freq-spacing-2x-small) auto;
        padding: 0;
    }
    .search-results {
        display: flex;
        flex-direction: column;
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .search-results a {
        color: var(--freq-color-text);
        padding: var(--freq-spacing-medium);
    }
    .search-results li {
        display: flex;
        flex-direction: column;
        gap: var(--freq-height-spacer-gap-quarter);
        border-bottom: var(--freq-border-panel);
    }
    .search-results li:first-child {
        border-top: var(--freq-border-panel);
    }
    .search-results li:last-child {
        border-bottom: none;
    }
    .search-results li:is(:hover, :focus) {
        color: var(--freq-color-text-dark);
	    background: var(--freq-color-button-lens-active);
        text-decoration: underline;
        text-decoration-color: var(--freq-color-text);
    }
    .search-results li:active {
        background: var(--freq-color-primary);
        color: var(--freq-color-text-dark);
        text-decoration: underline;
        text-decoration-color: var(--freq-color-text-dark);
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
    .result-row {
        display: flex;
        flex-wrap: row;
        gap: var(--freq-inline-gap-double);
        align-items: center;
    }
    .data-muted {
        font-size: var(--freq-font-size-small);
    }
</style>
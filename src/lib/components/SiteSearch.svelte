<script lang="ts">
    import { enhance } from "$app/forms"
    import { Popover } from "bits-ui"
    import Search from '@lucide/svelte/icons/search'
    import { searchResults } from "$lib/resources/states.svelte"
	import { goto } from "$app/navigation";

    interface ComponentProps {
        query?: string
        searchPlaceholder?: string
        formAction: string
        results?: App.RowData[]
        mode?: string
        screenSize?: string
    }

    let { 
        query, 
        searchPlaceholder,
        formAction, 
        results,
        mode = 'site',
        screenSize='desktop'
    }: ComponentProps = $props()

    let loading = $state(false)
    let searchBarOpen = $state(false)
    let searchResultsOpen = $state(false)

    let siteSearchResults = $state(results) as App.RowData[]

    const responsiveStyling = {
        'mobile': {
            'fontSize': 'xx-small-font',
            'iconSize': 14
        },
        'desktop': {
            'fontSize': 'medium-font',
            'iconSize': 16
        }
    } as any

    $effect(() => {
        console.log(siteSearchResults)
        console.log(searchResults.results)
    })
</script>

<div class="constrain">
<Popover.Root bind:open={searchBarOpen}>
    <Popover.Trigger class="search">
        <Search size={responsiveStyling[screenSize]['iconSize']} color="var(--freq-color-text-medium-dark)"></Search>
        <span class={responsiveStyling[screenSize]['fontSize']}>Search</span>
    </Popover.Trigger>
    <Popover.Content class="search">
        {#if mode == "redirect"}
        <form>
            <input
                type="text"
                name="query"
                id="query"
                placeholder={searchPlaceholder}
                bind:value={query}
                required
            />
            <button type="submit" class="standard" disabled={loading} onclick={() => {
                goto(`/search?type=site&query=${query}`)
                searchBarOpen = false
            }}>
                search
            </button>
        </form>
        {:else if mode == "dropdown"}
        <form 
            method="POST" 
            action="?/{formAction}" 
            use:enhance={() => {
                loading = true
                return async ({ update }) => {            
                    await update()
                    siteSearchResults = searchResults.results
                    loading = false
                    searchResultsOpen = true
            }}}
        >
            <input
                type="text"
                name="query"
                id="query"
                placeholder={searchPlaceholder}
                bind:value={query}
                required
            />
            <button type="submit" class="standard" disabled={loading}>
                search
            </button>
        </form>
        <ul class="search-results">
            {#each siteSearchResults as result}
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
        {/if}
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
        padding: 0 var(--freq-spacing-medium);
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
    .xx-small-font {
        font-size: var(--freq-font-size-2x-small);
    }
    .x-small-font {
        font-size: var(--freq-font-size-x-small);
    }
    .small-font {
        font-size: var(--freq-font-size-small);
    }
    .medium-font {
        font-size: var(--freq-font-size-medium);
    }
</style>

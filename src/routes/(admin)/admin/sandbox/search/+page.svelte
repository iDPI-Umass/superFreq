<script lang='ts'>
    import SiteSearch from "src/lib/components/Search/SiteSearch.svelte"
    let { data, form } = $props()

    let { results } = $derived(data)

    $effect(() => {
        console.log(results)
    })
</script>

<div class="half-width-panel">
    <SiteSearch
        formAction="searchCollections"
        results={results}
    ></SiteSearch>
</div>


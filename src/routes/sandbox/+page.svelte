<script lang="ts">
    import OptionsMenu from "src/lib/components/menus/OptionsMenu.svelte"
    import GlobalSearch from "src/lib/components/GlobalSearch.svelte";
	import { format } from "date-fns";
    import { searchResults } from "src/lib/resources/states.svelte.js";

    const { data, form } = $props()
    const { results } = $derived(data)

    const items = [
        {
            'id': 'option1',
            'value': 'one'
        },
        {
            'id': 'option1',
            'value': 'two'
        },
        {
            'id': 'option3',
            'value': 'three'
        }
    ]

    const inputGroup = 'input-group'
</script>

<GlobalSearch
    searchCategory='collections'
    searchButtonText='search'
    searchPlaceholder='placeholder'
    resultsCategory='collections'
    results={results}
></GlobalSearch>
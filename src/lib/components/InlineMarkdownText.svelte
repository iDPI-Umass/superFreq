<script lang="ts">
    import { parseMarkdown } from "$lib/resources/parseData"
    
    let {
        text
    } : { text: string } = $props()
</script>

{#await parseMarkdown(text) then text}
    {@html text}
{:catch}
    {''}
{/await}
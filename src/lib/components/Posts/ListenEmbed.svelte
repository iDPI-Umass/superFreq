<script lang="ts">
    import {DOMParser, parseHTML} from 'linkedom'
    export let listenUrl: string


</script>

{#if listenUrl.includes('bandcamp.com')}
<iframe title="bandcamp-embed" style="border: 0; width: 100%; height: 42px;" src="https://bandcamp.com/EmbeddedPlayer/album=7134529/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" seamless></iframe>
{/if}
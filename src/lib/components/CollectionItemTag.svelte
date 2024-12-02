<script lang="ts">
    import BoomBox from 'lucide-svelte/icons/boom-box'
    import Disc from 'lucide-svelte/icons/disc-2'
    import MusicNote from 'lucide-svelte/icons/music'
    import Palette from 'lucide-svelte/icons/palette'

    interface ComponentProps {
        itemType: string
    }
    
    let {
        itemType
    }: ComponentProps = $props()
</script>
<svelte:options runes={true} />

<span class="collection-item-tag">
    {#if itemType.includes("artist")}
        <Palette size="12" color="var(--freq-color-text-medium-dark)"></Palette>
        <span>artist</span>
    {:else if itemType.includes("release_group")}
        <Disc size="12" color="var(--freq-color-text-medium-dark)"></Disc>
        <span>album</span>
    {:else if itemType.includes("recording")}
        <MusicNote size="12" color="var(--freq-color-text-medium-dark)"></MusicNote>
        <span>track</span>
    {:else if itemType.includes("episode")}
        <BoomBox size="12" color="var(--freq-color-text-medium-dark)"></BoomBox>
        <span>mix</span>
    {:else}
        <span>item</span>
    {/if}
</span>

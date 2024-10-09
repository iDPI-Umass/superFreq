<script lang="ts">
    import MusicNote from 'lucide-svelte/icons/music'
    import Disc from 'lucide-svelte/icons/disc-2'
    import BoomBox from 'lucide-svelte/icons/boom-box'

    export let artistName: string
    export let itemTitle: string
    export let itemType: string
</script>


{#if itemType == "release_group"}
    <span 
        class="now-playing-text"
        aria-details="Now Playing album {itemTitle} by {artistName}"
    >
        <Disc size="16" color="var(--freq-color-text-medium-dark)"></Disc>
        {artistName} • {itemTitle}
        <Disc size="16" color="var(--freq-color-text-medium-dark)"></Disc>
    </span>
{:else if itemType == "recording"}
    <span 
        class="now-playing-text"
        aria-details="Now Playing track {itemTitle} by {artistName}"
    >
        <MusicNote size="16" color="var(--freq-color-text-medium-dark)"></MusicNote>
        {artistName} • {itemTitle}
        <MusicNote size="16" color="var(--freq-color-text-medium-dark)"></MusicNote>
    </span>
{:else if itemType == "episode"}
    <span 
        class="now-playing-text"
        aria-details="Now Playing mix {itemTitle} by {artistName}"
    >
        <BoomBox size="16" color="var(--freq-color-text-medium-dark)"></BoomBox>
        {artistName} • {itemTitle}
        <BoomBox size="16" color="var(--freq-color-text-medium-dark)"></BoomBox>
    </span>
{/if}

<script lang="ts">
    import MusicNote from '@lucide/svelte/icons/music'
    import Disc from '@lucide/svelte/icons/disc-2'
    import BoomBox from '@lucide/svelte/icons/boom-box'

    interface ComponentProps {
        artistName: string
        itemTitle: string
        itemType: string
    }
    
    let {
        artistName,
        itemTitle,
        itemType
    }: ComponentProps = $props()

</script>
<!-- <svelte:options runes={true} /> -->

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
{:else if itemType == "avatar"}  
    <div class="profile-avatar">
        <span class="title">
            {itemTitle}
        </span>
        <span class="artist">
            {artistName}
        </span>
    </div>
{/if}

<style>
    .profile-avatar {
        display: flex;
        flex-direction: column;
        margin: 0 auto;
        max-width: inherit;
        padding: var(--freq-spacing-2x-small) var(--freq-spacing-3x-small);
        margin-top: var(--freq-spacing-small);
        gap: var(--freq-spacer-gap-quarter);
        background-color: var(--freq-color-background-badge-medium);
        background: var(--freq-grid-dark-background);
        color: var(--freq-color-text-medium-dark);
        font-size: var(--freq-font-size-x-small);
        text-transform: uppercase;
        /* color: var(--freq-color-text-medium); */
        font-weight: var(--freq-font-weight-semi-bold);
        letter-spacing: var(--freq-letter-spacing-looser);
    }
    .title {
        font-weight: var(--freq-font-weight-bold);
    }
</style>
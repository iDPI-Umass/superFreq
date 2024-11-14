<script lang="ts">
    import MusicBrainzSearch from '$lib/components/MusicBrainzSearch.svelte'
    import CoverArt from '$lib/components/CoverArt.svelte'

    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        newItemAdded: boolean,
        displayName: string,
        avatarUrl: string,
        avatarItem: App.RowData,
        avatarInfo: App.RowData,
        imgPromise: any
    }

    let {
        newItemAdded = $bindable(false),
        displayName,
        avatarUrl,
        avatarItem = $bindable({}),
        avatarInfo,
        imgPromise = $bindable(null)
    }: ComponentProps = $props()

    let avatarArtistName = $derived(avatarInfo['artist_name']) as string
    let avatarReleaseGroupName = $derived(avatarInfo['release_group_name']) as string
</script>

{#snippet editorItemImage(avatarItem: any, altText: string)}
    {#await imgPromise}
    <img 
        src={wave} 
        alt="loading cover art"
    />
	<p>Loading cover art.</p>
    {:then}
        <img 
            src={(avatarItem["img_url"] ?? avatarItem["last_fm_img_url"]) ?? wave } 
            alt="{(avatarItem["img_url"] ?? avatarItem["last_fm_img_url"]) ? altText : 'no available'} cover art"
        />
    {/await}
{/snippet}

<div class="mb-search">
    <MusicBrainzSearch
        searchCategory="release_groups"
        searchButtonText="search"
        searchPlaceholder="Search for an album"
        bind:addedItems={avatarItem}
        bind:newItemAdded={newItemAdded}
        mode="avatar-search"
        limit="10"
        bind:imgPromise={imgPromise}
    >
    </MusicBrainzSearch>
</div>
<span class="tip">
    search for album cover to make your profile image
</span>
{#if avatarUrl && !newItemAdded}
    <CoverArt
        item={avatarInfo}
        altText="{displayName}'s avatar: {avatarReleaseGroupName} by {avatarArtistName}"
    ></CoverArt>
{:else if avatarItem && newItemAdded}
    {@render editorItemImage(avatarItem, avatarReleaseGroupName)}
{/if}

<style>
    .mb-search {
		margin: var(--freq-height-spacer-half) 0;
	}
	img {
		margin: var(--freq-height-spacer-half) 0 0 0;
		width: 90%;
	}
</style>
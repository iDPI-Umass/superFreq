<!-- 
Needs *either* an item object *or* imgUrl, aritstName, and releaseGroupName props. 
 
Currently configured to server Last.fm images on the client side by default on account of Internet Archive's Cover Art Archive being down.
-->


<script lang="ts">
    import { onMount } from "svelte"
    import { checkFetchedCoverArt, getLastFmCoverArt, getCoverArt, getCoverArtClientSide } from "$lib/resources/musicbrainz"
    import wave from "$lib/assets/images/logo/freq-wave.svg"
    import { promiseStates } from "$lib/resources/states.svelte";

    interface ComponentProps {
        item?: any
        imgUrl?: string | null
        lastFmImgUrl?: string | null
        artistName?: string | null
        releaseGroupName?: string | null
        altText: string
        imgClass?: string | null
    }

    let {
        item = null,
        imgUrl = null,
        lastFmImgUrl = null,
        artistName = null,
        releaseGroupName = null,
        altText,
        imgClass,
    }: ComponentProps = $props()

    const coverArtItem = $derived({
        'img_url': imgUrl ?? item.img_url ?? item.avatar_url ?? null,
        'last_fm_img_url': lastFmImgUrl ?? item.last_fm_img_url ?? item.last_fm_avatar_url ?? null,
        'artist_name': artistName ?? item.artist_name ?? item.avatar_artist_name ?? null,
        'artist_mbid': item.artist_mbid ?? null,
        'release_group_name': releaseGroupName ?? item.release_group_name ?? item.avatar_release_group_name ?? null,
        'release_group_mbid': item.release_group_mbid ?? null
    })

    const coverArtSearchTerms = $derived({
        'artist_name': artistName ?? item.artist_name ?? item.avatar_artist_name ?? null,
        'release_group_name': releaseGroupName ?? item.release_group_name?? item.avatar_release_group_name ?? null,
        'artist_mbid': item.artist_mbid ?? null,
        'release_group_mbid': item.release_group_mbid ?? null
    })

    const coverArtArchiveImgUrl = $derived(item ? coverArtItem['img_url'] : null)

    const continuePromise = $derived(promiseStates.continueClientSideImgPromise)

</script>

{#if item && (coverArtItem['last_fm_img_url'] || coverArtItem['img_url']) } 
    <img src={coverArtItem['last_fm_img_url'] ?? coverArtItem['img_url']} alt={altText} class={imgClass}  /> 
{:else if !item || (item && (!coverArtItem['last_fm_img_url'] && !coverArtItem['img_url'])) }
    {#await getCoverArtClientSide(coverArtSearchTerms, continuePromise)}
        <img src={wave} alt="loading" class={imgClass} />
    {:then result}
        <img src={result.lastFmCoverArtUrl ?? result.coverArtArchiveUrl ??  result.wave} alt={result ? altText : 'not found'} class={imgClass}  />
    {:catch}
        <img src={wave} alt="not found" class={imgClass}  />
    {/await}
{:else}
    <img src={wave} alt="not found" class={imgClass}  />
{/if}

<style>
    img {
        width: inherit;
    }
</style>
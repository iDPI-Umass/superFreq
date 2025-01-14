<!-- 
Needs *either* an item object *or* imgUrl, aritstName, and releaseGroupName props. 
 
Currently configured to server Last.fm images on the client side by default on account of Internet Archive's Cover Art Archive being down.
-->


<script lang="ts">
    import { onMount } from "svelte"
    import { checkFetchedCoverArt, getLastFmCoverArt } from "$lib/resources/musicbrainz"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        item?: any
        imgUrl?: string | null
        artistName?: string | null
        releaseGroupName?: string | null
        altText: string
        imgClass?: string | null
    }

    let {
        item,
        imgUrl,
        artistName,
        releaseGroupName,
        altText,
        imgClass
    }: ComponentProps = $props()

    const coverArtItem = $derived(( item != null ) ? item : {
        'img_url': imgUrl ?? null,
        'last_fm_img_url': null,
        'artist_name': artistName,
        'release_group_name': releaseGroupName
    })

    const coverArtArchiveImgUrl = $derived(item ? coverArtItem['img_url'] : null)
    const lastFmImgUrl = $derived(item ? (item['last_fm_img_url'] ?? item['last_fm_avatar_img_url']) : null)

    let coverArt = $state(wave)
    let text = $state('loading')

    onMount(async () => {
        const getCoverArt = await getLastFmCoverArt(coverArtItem)
        coverArt = getCoverArt ? getCoverArt : wave
        text = getCoverArt ? altText : 'not found'
        return coverArt
    })

</script>

<svelte:options runes={true} />

<!-- {#if coverArtArchiveImgUrl ?? lastFmImgUrl}
    <img src={lastFmImgUrl ?? coverArtArchiveImgUrl ?? wave} alt={altText} class={imgClass} /> -->

<!-- {#if coverArtItem['artist_name'] && coverArtItem['artist_name'] != null}
    {#await getLastFmCoverArt(coverArtItem)}
        <img src={wave} alt="loading" class={imgClass} />
    {:then result}
        <img src={result ? result : wave} alt={result ? altText : 'not found'} class={imgClass}  />
    {:catch}
        <img src={wave} alt="not found" class={imgClass}  />
    {/await}
{:else}
    <img src={wave} alt="not found" class={imgClass}  />
{/if} -->

<img src={coverArt} alt={text} class={imgClass} />

<style>
    img {
        width: inherit;
    }
</style>
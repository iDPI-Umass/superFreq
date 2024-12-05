<!-- 
Needs *either* an item object *or* imgUrl, aritstName, and releaseGroupName props. 
 
Currently configured to server Last.fm images on the client side by default on account of Internet Archive's Cover Art Archive being down.
-->


<script lang="ts">
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
        'img_url': imgUrl,
        'artist_name': artistName,
        'release_group_name': releaseGroupName
    })

    const coverArtArchiveImgUrl = $derived(item ? item['img_url'] : null)
    const lastFmImgUrl = $derived(item ?  item['last_fm_img_url'] : null)
</script>

<svelte:options runes={true} />

{#if coverArtArchiveImgUrl || lastFmImgUrl }
    <img src={coverArtArchiveImgUrl ?? lastFmImgUrl} alt={altText} class={imgClass} />
{:else}
    {#await getLastFmCoverArt(coverArtItem)}
        <img src={wave} alt="loading" class={imgClass} />
    {:then result}
        <img src={result ? result : wave} alt={result ? altText : 'not found'} class={imgClass}  />
    {:catch}
        <img src={wave} alt="not found" class={imgClass}  />
    {/await}
{/if}

<style>
    img {
        width: inherit;
    }
</style>
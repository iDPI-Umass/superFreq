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
        clientSideLoad?: boolean
    }

    let {
        item = null,
        imgUrl = null,
        lastFmImgUrl = null,
        artistName = null,
        releaseGroupName = null,
        altText,
        imgClass,
        clientSideLoad = false
    }: ComponentProps = $props()

    const coverArtItem = $derived({
        'img_url': imgUrl ?? item?.img_url ?? item?.avatar_url ?? null,
        'last_fm_img_url': lastFmImgUrl ?? item?.last_fm_img_url ?? item?.last_fm_avatar_url ?? null,
        'artist_name': artistName ?? item?.artist_name ?? item?.avatar_artist_name ?? null,
        'artist_mbid': item?.artist_mbid ?? null,
        'release_group_name': releaseGroupName ?? item?.release_group_name ?? item?.avatar_release_group_name ?? null,
        'release_group_mbid': item?.release_group_mbid ?? null,
        'artist_discogs_img_url': item?.artist_discogs_img_url ?? null
    })

    const coverArtSearchTerms = $derived({
        'artist_name': artistName ?? item?.artist_name ?? item?.avatar_artist_name ?? null,
        'release_group_name': releaseGroupName ?? item?.release_group_name?? item?.avatar_release_group_name ?? null,
        'artist_mbid': item?.artist_mbid ?? null,
        'release_group_mbid': item?.release_group_mbid ?? null
    })

    const waveStaticUrl = 'https://www.freq.social/images/logo/freq-wave.svg'

    const continuePromise = $derived( promiseStates.continueClientSideImgPromise )

    const imageSelector = function ( coverArtItem: App.RowData ) {
        const validUrl = ( coverArtItem['last_fm_img_url'] || coverArtItem['img_url'] || coverArtItem['artist_discogs_img_url'] ) ? true : false
        let url = ''

        if ( coverArtItem['artist_discogs_img_url'] && !( coverArtItem['last_fm_img_url'] || coverArtItem['img_url'] )) {
            url = coverArtItem['artist_discogs_img_url']
        }
        else if ( coverArtItem['last_fm_img_url'] ) {
            url = coverArtItem['last_fm_img_url']
        }
        else if ( !coverArtItem['last_fm_img_url'] && coverArtItem['img_url'] ) {
            url = coverArtItem['img_url']
        }

        return { validUrl, url }
    }

    const { validUrl, url } = $derived( imageSelector( coverArtItem ))

    console.log(wave)

</script>

{#if validUrl } 
    <img src={url} onerror={(event) => event.currentTarget.src = wave} alt={altText} class={imgClass} loading='lazy' /> 
{:else if !validUrl && clientSideLoad }
    {#await getCoverArtClientSide(coverArtSearchTerms, continuePromise)}
        <img src={wave} alt="loading" class={imgClass} loading='lazy' />
    {:then result}
        <img src={result.lastFmCoverArtUrl} onerror={(event) => event.currentTarget.src = wave} alt={result ? altText : 'not found'} class={imgClass} loading='lazy' />
    {:catch}
        <img src={wave} alt="not found" class={imgClass} loading='lazy' />
    {/await}
{:else if !validUrl && !clientSideLoad }
    <img src={wave} alt="not found" class={imgClass} loading='lazy' />
{/if}
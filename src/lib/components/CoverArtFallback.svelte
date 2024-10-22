<!-- 
 Needs *either* an item object *or* imgUrl, aritstName, and releaseGroupName props. Allows for more flexible use depending on structure of data for a given route's layout.
-->


<script lang="ts">
    import { checkFetchedCoverArt } from "$lib/resources/musicbrainz"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    interface ComponentProps {
        item: any
        imgUrl?: string | null
        artistName?: string | null
        releaseGroupName?: string | null
        altText: string
        imgClass?: string | null
    }

    let {
        item = null,
        imgUrl = null,
        artistName =  null,
        releaseGroupName = null,
        altText,
        imgClass = null
    }: ComponentProps = $props()

    const coverArtItem = ( item != null ) ? item : {
        'img_url': imgUrl,
        'artist_name': artistName,
        'release_group_name': releaseGroupName
    }
</script>

{#await checkFetchedCoverArt(coverArtItem)}
    <img src={wave} alt="loading" class={imgClass} />
{:then result}
    <img src={result} alt={altText} class={imgClass}  />
{:catch}
    <img src={wave} alt="not found" class={imgClass}  />
{/await}
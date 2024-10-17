<!-- 
 Needs *either* an item object *or* imgUrl, aritstName, and releaseGroupName props. Allows for more flexible use depending on structure of data for a given route's layout.
-->


<script lang="ts">
    import { checkFetchedCoverArt } from "$lib/resources/musicbrainz"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    export let item: any = null
    export let imgUrl: string | null = null
    export let artistName: string | null = null
    export let releaseGroupName: string | null = null
    export let altText: string

    const coverArtItem = item ? item : {
        'img_url': imgUrl,
        'artist_name': artistName,
        'release_group_name': releaseGroupName
    }
</script>

{#await checkFetchedCoverArt(coverArtItem)}
    <img src={wave} alt="loading" />
{:then result}
    <img src={result} alt={altText} />
{:catch}
    <img src={wave} alt="not found" />
{/await}
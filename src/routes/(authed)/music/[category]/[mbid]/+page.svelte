<script lang="ts"> 
    import { getYear } from 'date-fns'
    import SEO from 'src/lib/components/layout/SEO.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    const { data } = $props()
    const { musicbrainzMetadata, wikipediaExtract, discogsData, category, mbid } = $state(data)

    console.log(musicbrainzMetadata)

    const pageTitle = $derived(musicbrainzMetadata?.name ?? musicbrainzMetadata?.title) as string

    function selectHeaderImage ( discogsData: App.RowData | null ) {
        let imgUrl = wave

        if ( !discogsData ) {
            return imgUrl
        }

        if ( category == 'artist' ) {
            imgUrl = discogsData.artist.images.find((element) => element.type == 'primary')['resource_url']
        }
        else if ( category == 'album' ) {
            imgUrl = discogsData.release.images.find((element) => element.type == 'primary')['resource_url']
        }
        else if ( category == 'label' ) {
            imgUrl = discogsData.label.images.find((element) => element.type == 'primary')['resource_url']
        }
        
        return imgUrl
    }

    function albumFilter ( albums: App.RowData[] | null ) {
        function hasSecondaryType( album: App.RowData ) {
            return !album['secondary-types'] || album['secondary-types'].length == 0
        }
        const filtered = albums?.filter(hasSecondaryType) ?? null
        return filtered
    } 

    const filteredAlbums = albumFilter(musicbrainzMetadata['release-groups'])

    function yearFromFirstReleaseDate ( dateString: string ) {
        const releaseDate = new Date (dateString)
        const year = getYear(releaseDate)
        return year
    }

    function getArtists ( musicbrainzMetadata: App.RowData ) {
        const artists = [] as App.RowData[]
        const artistCredits = musicbrainzMetadata['artist-credit']
        for ( const credit of artistCredits) {
            const artist = {
                'artist_mbid': credit.id,
                'artist_name': credit.name
            }
            artists.push(artist)
        }
        return artists
    }

    const artists = $derived(getArtists(musicbrainzMetadata))
</script>

<SEO title={pageTitle}></SEO>

<div class="two-column">
    <div class="column-half">    
        <h2>{category}</h2>
        <img src={selectHeaderImage(discogsData)} alt={pageTitle} />
        <h3>{musicbrainzMetadata?.name ?? musicbrainzMetadata?.title}</h3>
        <div>
            {#if category == 'album'}
            <h3>
                {#each artists as artist}
                    <a href="/music/artist/{artist.artist_mbid}">{artist.artist_name}</a>
                {/each}
            </h3>
            <p>dummy</p>
            {/if}
        </div>
    </div>
    <div class="column-half">
        {#if wikipediaExtract}
            <h3>From Wikipedia:</h3>
            <p>
                {wikipediaExtract.extract}
            </p>
            <a href={wikipediaExtract.url}>Continue reading at Wikipedia</a>
            <p>Wikipedia content provided under the terms of the <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons BY-SA license</a></p>
        {/if}
        {#if filteredAlbums}
            <h3>Discography</h3>
            <ul>
                {#each filteredAlbums as album}
                <li>
                    <a href="/music/album/{album.id}">
                    {album.title} ({getYear(album['first-release-date'])})
                    </a>
                </li>
                {/each}
            </ul>
        {/if}
    </div>
</div>


<style>
    h2 {
        text-transform: capitalize;
    }
    ul {
        padding-left: 0;
    }
    li {
        list-style: none;
    }
</style>
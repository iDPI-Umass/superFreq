<script lang="ts"> 
    import { getYear, format } from 'date-fns'
    import SEO from 'src/lib/components/layout/SEO.svelte'
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    const { data } = $props()
    const { musicbrainzMetadata, wikipediaExtract, discogsData, category } = $derived(data)

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
        else if ( category == 'track' ) {
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

    let filteredAlbums = $derived(albumFilter(musicbrainzMetadata['release-groups']))

    function yearFromFirstReleaseDate ( dateString: string ) {
        const releaseDate = new Date (dateString)
        const year = getYear(releaseDate)
        return year
    }

    function getArtists ( musicbrainzMetadata: App.RowData ) {
        const artists = [] as App.RowData[]
        const artistCredits = musicbrainzMetadata['artist-credit'] ?? null

        if ( !artistCredits ) {
            return null
        }

        for ( const credit of artistCredits) {
            const artist = {
                'artist_mbid': credit.artist.id,
                'artist_name': credit.name
            }
            artists.push(artist)
        }
        return artists
    }

    function getReleaseDate ( musicbrainzMetadata: App.RowData ) {
        if ( category == 'artist' || category == 'label' ) {
            return null
        }
        else if ( category == 'album' || category == 'track' ) {
            const date = new Date(musicbrainzMetadata['first-release-date'])
            return format(date, "MMMM do, y")
        }
    }

    let artists = $derived(getArtists(musicbrainzMetadata))

    let tracks = $derived(musicbrainzMetadata['tracks'] ?? null)
    let label = $derived(musicbrainzMetadata['label'] ?? null)
</script>

<SEO title={pageTitle}></SEO>

<div class="two-column">
    <div class="column-half">    
        <h2>{category}</h2>
        <img src={selectHeaderImage(discogsData)} alt={pageTitle} />
        <h3 class="title">
            {musicbrainzMetadata?.name ?? musicbrainzMetadata?.title}
        </h3>

        <div>
            {#if category == 'artist'}
            {#if filteredAlbums}
                <h4>Discography</h4>
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
            {:else if category == 'album'}
                <p class="album-metadata">
                    <span class="album-artist">
                        {#each artists as artist}
                            <a href="/music/artist/{artist.artist_mbid}">{artist.artist_name}</a>
                        {/each}
                    </span>
                    <span>
                        {label.label.name}, {label['catalog-number']}
                    </span>
                    <span>
                        {getReleaseDate(musicbrainzMetadata)}
                    </span>
                </p>
                {#if tracks}
                <div class="data-breakout">
                    <h4>Tracklist</h4>
                    <ol>
                        {#each tracks as track}
                            <li>
                                <a href="/music/track/{track.recording.id}">{track.title}</a>
                            </li>
                        {/each}
                    </ol>
                </div>
                {/if}
            {:else if category == 'track'}
                <p>Appears on <a href="/music/album/{musicbrainzMetadata['releases'][0]['release-group']['id']}">{musicbrainzMetadata['releases'][0]['title']}</a></p>
                <p>{getReleaseDate(musicbrainzMetadata)}</p>
                <h3>
                    {#each artists as artist}
                        <a href="/music/artist/{artist.artist_mbid}">{artist.artist_name}</a>
                    {/each}
                </h3>
            {/if}
        </div>
    </div>
    <div class="column-half">
        {#if wikipediaExtract}
            <div class="data-breakout">
                <h3>From Wikipedia:</h3>
                <p class="wiki">
                    {wikipediaExtract.extract}
                    
                </p>
                <span class="link"><a class="read-more" href={wikipediaExtract.url}>Continue reading at Wikipedia</a></span>
                <p>Wikipedia content provided under the terms of the <a href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons BY-SA license</a></p>
            </div>
        {/if}
    </div>
</div>


<style>
    h2 {
        text-transform: capitalize;
    }
    h3 {
        margin: var(--freq-height-spacer) 0 var(--freq-height-spacer-quarter) 0;
    }
    p.album-metadata {
        display: flex;
        flex-direction: column;
        margin: 0 0 var(--freq-height-spacer-quarter) 0;
        gap: var(--freq-height-spacer-quarter);
    }
    span.album-artist {
        font-family: var(--freq-alt-font-family);
    }
    ul {
        padding-left: 0;
    }
    ul li {
        list-style: none;
    }
    .data-breakout {
        display: flex;
        flex-direction: column;
        width: inherit;
        gap: var(--freq-height-spacer-half);
    }
    .data-breakout h4 {
        margin: calc(var(--freq-height-spacer) * 0.4) 0 0 0;
    }
    .data-breakout ol {
        margin: 0;
        padding-left: var(--freq-width-spacer);
    }
    .data-breakout p {
        margin: 0;
    }
    .data-breakout span.link {
        font-style: italic;
        text-align: right;
    }
    /* p.wiki {
        text-align-last: right;
    } */
</style>
export const getCoverArtClientSide = async function ( releaseGroup: App.RowData ) {
    const validReleaseGroup = ( releaseGroup.release_group_name == null && releaseGroup.release_group_mbid == null ) ? false : true
    if ( !validReleaseGroup ) {
        throw Error
    }

    const coverArtArchiveUrl = releaseGroup.release_group_mbid ? `https://coverartarchive.org/release-group/${releaseGroup.release_group_mbid}/front` : null
    
    const lastFmCoverArtUrl = null as string | null
    const lastFmResUrl = await getLastFmCoverArt( releaseGroup ) as string

    try {
        const httpLastFm = new XMLHttpRequest()
        httpLastFm.open('HEAD', lastFmResUrl, false)
        httpLastFm.send()
        const lastFmCoverArtUrl = ( httpLastFm.status == 404 ) ? null : lastFmResUrl

        if ( !lastFmCoverArtUrl ) {
            throw Error
        }
        else {
            return { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: true }
        }
    }
    catch ( error ) {
        return  { coverArtArchiveUrl, lastFmCoverArtUrl, wave: wave, success: false }
    }
}
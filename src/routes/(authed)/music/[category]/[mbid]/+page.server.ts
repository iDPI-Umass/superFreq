import { musicbrainzLookup, getWikidata, musicbrainzAdvancedSearch, metadataLookup } from '$lib/resources/musicbrainz'

export const load = async ({ params, locals: { safeGetSession } }) => {
    const { category, mbid }: { category: string, mbid: string}  = params

    const { musicbrainzMetadata, wikipediaExtract, discogsData } = await metadataLookup( mbid, category )
    
    return { musicbrainzMetadata, wikipediaExtract, discogsData, category, mbid } 
}
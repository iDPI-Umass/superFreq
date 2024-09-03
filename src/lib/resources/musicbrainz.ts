/*
Search MusicBrainz db
*/

import { categoriesTable } from "$lib/resources/parseData"

export const mbSearch = async function ( query: string, queryType: string ) {
    const apiCategory = categoriesTable[queryType] as string

    let apiString = "https://musicbrainz.org/ws/2/";
    apiString = apiString.concat(apiCategory);
    const endpoint = new URL (apiString);
        
    endpoint.searchParams.set("fmt", "json");
    endpoint.searchParams.set("query", `${query}`);

    if (queryType == "recordings") {
        endpoint.searchParams.set("inc", "releases+release-groups+artist-rels");
    }

    const res = await fetch(endpoint);
    const searchResults = await res.json();

    const mbObjectKey = apiCategory.concat('s');
    const mbData = searchResults[mbObjectKey];
    
    const searchComplete =  true;

    return {
        mbData, searchComplete
    }
}
/*
Parse date to locale string
*/

import { categoriesTable } from "../parse-data/categoriesTable";

export const mbSearch = async function ( query, collectionType ) {
    const apiCategory = categoriesTable[collectionType];

    let apiString = "https://musicbrainz.org/ws/2/";
    apiString = apiString.concat(apiCategory);
    const endpoint = new URL (apiString);
        
    endpoint.searchParams.set("fmt", "json");
    endpoint.searchParams.set("query", `${query}`);

    if (collectionType == "recordings") {
        endpoint.searchParams.set("inc", "releases+release-groups+artist-rels");
    }

    const res = await fetch(endpoint);
    const searchResults = await res.json();

    const mbObjectKey = apiCategory.concat('s');
    const mbData = searchResults[mbObjectKey];
    
    const searchComplete =  true;

    const thisSession = await session;

    return {
        mbData, searchComplete
    }
}
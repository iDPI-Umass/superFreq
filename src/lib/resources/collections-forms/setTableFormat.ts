/*
Formats table headers
*/

// variables for table display
let tableHeaderOne = "";
let tableHeaderTwo = "";
let tableHeaderThree = "";
let tableValueOne = "";
let tableValueTwo = "";
let tableValueThree = "";

export const setTableFormat = function ( collectionType ) {
    if ( collectionType == "") {
        tableHeaderOne = "";
        tableHeaderTwo = "";
        tableHeaderThree = "";
        tableValueOne = "";
        tableValueTwo = "";
        tableValueThree = "";
    }
    else if ( collectionType == "artists") {
        tableHeaderOne = "Artist";
        tableHeaderTwo = "From location";
        tableHeaderThree = "Debut year";

        tableValueOne = `${["name"]}`;
        tableValueTwo = `${["area"]["name"]}`;
        tableValueThree = `${["life-span"]["begin"]}`;
    }
    else if ( collectionType == "release_groups" ) {
        tableHeaderOne = "Album";
        tableHeaderTwo = "Artist";
        tableHeaderThree = "Release Date";
        tableValueOne = "item[`title`]";
        tableValueTwo = "item[`artist-credit`][0][`artist`][`name`]";
        tableValueThree = "item[`first-release-date`]";
    }
    else if ( collectionType == "recordings" ) {
        tableHeaderOne = "Track";
        tableHeaderTwo = "Artist";
        tableHeaderThree = "Release Date";
        tableValueOne = `["name"]`;
        tableValueTwo = `["artist-credit"][0]["artist"]["name"]`;
        tableValueThree = `["first-release-date"]`;
    }
    return { tableHeaderOne, tableHeaderTwo, tableHeaderThree, tableValueOne, tableValueTwo, tableValueThree };
}
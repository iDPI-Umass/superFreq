/* 
Parses collection_info "type" into category displayed in UI.
*/

const categories = {
    "artists": "artists",
    "release_groups": "albums",
    "recording": "tracks"
}

export const categoryParser = function( type ) {
    const category = categories[type];
    return category;
}
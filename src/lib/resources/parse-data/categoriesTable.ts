// to convert categories <select> value to suffix for API endpoint
	
interface stringIndex {
    [index: string]: string
}

export const categoriesTable: stringIndex = {
    "artists": "artists",
    "release-groups": "release-group",
    "release_groups": "release-group",
    "recordings": "recordings",
    "albums": "release-group",
    "tracks": "recordings",
    "songs": "recordings"
}
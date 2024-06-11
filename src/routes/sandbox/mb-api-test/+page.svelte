<script lang="ts">
    let mbData: any
	let query: string
	let spotifyQuery: string
	let mbid: string
	let searchComplete: boolean
    let apiCategory="release-group"
	const accessToken = 'a5bb614bd1d64bd4a1f9bb575ea82776'
	async function mbSearch() {
		// console.log(searchCategory, query)
		// const apiCategory = categoriesTable[`${searchCategory}`]

		let apiString = "https://musicbrainz.org/ws/2/"
		apiString = apiString.concat(apiCategory)
        const endpoint = new URL (apiString)
            
		endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("query", `${query}`)

		// if (searchCategory == "recordings") {
		// 	endpoint.searchParams.set("inc", "releases+release-groups+artist-rels")
		// }

        const res = await fetch(endpoint)
        const searchResults = await res.json()

        const mbObjectKey = apiCategory.concat('s')
		mbData = searchResults[mbObjectKey]
		
		searchComplete =  true
        console.log(mbData)

		for (const [index, item] of mbData.entries() ) {
			console.log(index)
			const artistCredits = item["artist-credit"]
			for ( const [index, artist] of artistCredits.entries()) {
				console.log(`artist ${index}: `, artist["name"])
			}
			const release = item["releases"][0]["title"]
			const releaseDate = item["first-release-date"]
			console.log("release: ", release)
			console.log("release date: ", releaseDate)
		}
		return {
			mbData, searchComplete
		}
    }

	async function mbFetch() {
		// console.log(searchCategory, query)
		// const apiCategory = categoriesTable[`${searchCategory}`]

		let apiString = "https://musicbrainz.org/ws/2/"
		apiString = apiString.concat(`${apiCategory}/${mbid}?inc=url-rels`)
        const endpoint = new URL (apiString)
            
		endpoint.searchParams.set("fmt", "json");
        // endpoint.searchParams.set("query", `${query}`)

		// if (searchCategory == "recordings") {
		// 	endpoint.searchParams.set("inc", "releases+release-groups+artist-rels")
		// }

        const res = await fetch(endpoint)
        const searchResults = await res.json()

        const mbObjectKey = apiCategory.concat('s')
		mbData = searchResults[mbObjectKey]
		
		searchComplete =  true
        console.log(mbData)

		// for (const [index, item] of mbData.entries() ) {
		// 	console.log(index)
		// 	const artistCredits = item["artist-credit"]
		// 	for ( const [index, artist] of artistCredits.entries()) {
		// 		console.log(`artist ${index}: `, artist["name"])
		// 	}
		// 	const release = item["releases"][0]["title"]
		// 	const releaseDate = item["first-release-date"]
		// 	console.log("release: ", release)
		// 	console.log("release date: ", releaseDate)
		// }
		return {
			mbData, searchComplete
		}
    }

	async function spotifySearch () {

		let apiString = "https://api.spotify.com/v1/search"
        const endpoint = new URL (apiString)

		// endpoint.searchParams.set("fmt", "json");
        endpoint.searchParams.set("q", `${spotifyQuery}`)
		endpoint.searchParams.set("type", "album")
		const req = fetch(endpoint, {
			headers: {
				Authorization: "Bearer" + accessToken
			}
		})

		console.log(req)
		const res = await req

        const searchResults = await res.json()
		console.log(searchResults)

	}
</script>

<h1>search</h1>
<form>
	<input type="search" bind:value={query} />
	<button on:click|preventDefault={mbSearch}>
		search
	</button>
</form>

<h1>get release</h1>
<form>
	<input type="search" bind:value={spotifyQuery} />
	<button on:click|preventDefault={spotifySearch}>
		search
	</button>
</form>
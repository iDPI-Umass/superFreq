import type { Actions } from './$types'
import { db } from 'src/database.ts'
import { getArtistUrlRels, getRelationUrl, getDiscogsArtistPhoto } from "src/lib/resources/musicbrainz"

// import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
// import { add } from 'date-fns'


export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()
    const sessionUserId = session?.user.id as string

    // async function getData() {
    //     const url = "http://musicbrainz.org/ws/2/artist/5b11f4ce-a62d-471e-81fc-a69a8278c7da?inc=aliases"
    //     try {
    //         const response = await fetch(url);
    //         if (!response.ok) {
    //         throw new Error(`Response status: ${response.status}`);
    //         }

    //         const json = await response.json();
    //         return {json}
    //     } catch (error) {
    //         return {json: null}
    //     }
    // }

    // const tch = await getData()

    // return { tch }
}

export const actions = {
    getImages: async({ request }) => {
        const data = await request.formData()

        let i = 0

        
        async function getImage (mbid: string, ms: number) {
            await delay(ms)
            console.log(mbid)
            const {relations} = await getArtistUrlRels(mbid)

    
            const {relationUrl} = await getRelationUrl( relations, 'discogs')

    
            const {imgUrl} = await getDiscogsArtistPhoto(relationUrl)

            // const thisIndex = artists.indexOf(artist)
            // artists[thisIndex]['discogs_img_url'] = imgUrl

            // console.log(artists[thisIndex]['discogs_img_url'])

            return imgUrl
        }

        const artists = await db
        .selectFrom('artists')
        .selectAll()
        .execute()

        console.log(artists.length, ' artists')

        // artists.length = 30



        let intervalId
        let updated = 0
        for ( const artist of artists ) {
            const mbid = artist.artist_mbid
            // let done = false
            const itemIndex = artists.indexOf(artist)
            // const ms = (itemIndex + 1) * 1000
            const ms = 1000
            // setTimeout(() => {
            //     done = true
            // }, ms)

            // while (!done) {
            const imgUrl = await getImage(mbid, ms)
            artist.discogs_img_url = imgUrl ?? null
            console.log(artist)


                const update = await db
                .updateTable('artists')
                .set({
                    discogs_img_url: artist.discogs_img_url
                })
                .where('artist_mbid', '=', mbid)
                .returning(['artist_mbid', 'discogs_img_url'])
                .executeTakeFirst()
    
                console.log(update)
                console.log(update.artist_mbid, ' updated with image ', update.discogs_img_url)

                updated = update ? updated++ : updated
            


            
            // }
            // if ( i >= artists.length){
            //     clearInterval(intervalId)
            //     intervalId = null
            // }
            // const mbid = artist.artist_mbid
            // const ms = 1000
            // intervalId = setInterval(getImage, ms, mbid, artists, artist)
        }

        // const update = await db
        // .insertInto( 'artists' )
        // .values( artists )
        // .onConflict((oc) => oc
        //     .column( 'artist_mbid' )
        //     .doUpdateSet((eb) => ({
        //         discogs_img_url: eb.ref('excluded.discogs_img_url'),
        //     }))
        // )
        // .returningAll()
        // .execute()

        // console.log(update.length, ' updated')

        console.log(updated, ' artist images updated')

    },
    saveDefaults: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id

        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    }
} satisfies Actions
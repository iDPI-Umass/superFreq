import type { PageServerLoad } from "./$types"
import { fetchHtml, parseBandcampHtml } from "src/lib/resources/parseData"

const listenUrl = 'https://lizardlabel.bandcamp.com/album/slug-beat'

export const load: PageServerLoad = async () => {
    // const document = await fetchHtml( listenUrl )
    // const parsedDocument = JSON.stringify(document, null, 2)
    const bandcampInfo = await parseBandcampHtml(listenUrl)
    // console.log(parsedDocument)
    console.log(bandcampInfo)
    return { bandcampInfo }
}
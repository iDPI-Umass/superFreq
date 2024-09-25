import { getListenUrlData } from "src/lib/resources/parseData"

export const load = async () => {
    const listenUrlString = 'https://youtu.be/Oq9Xw75Jns4?si=cZDkew_iZCV_a13D'

    const someData = await getListenUrlData(listenUrlString)

    return someData
}
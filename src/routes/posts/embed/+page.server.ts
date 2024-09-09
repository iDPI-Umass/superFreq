import type { Actions } from "@sveltejs/kit"
import { json, redirect } from '@sveltejs/kit'
import { parseHTML } from 'linkedom'
import { getListenLinkData } from "$lib/resources/parseData"

export const actions = {
    submitUrl: async ({ request }) => {
        const data = await request.formData() 
        const urlString = data.get('url') as string
        const queryString = 'meta[property="og:video"]'
        const content = await getListenLinkData(urlString, queryString)
        console.log(content)
        return {success: true}
        // throw redirect(303, `/listenUrl/${url}`)
    }
} satisfies Actions
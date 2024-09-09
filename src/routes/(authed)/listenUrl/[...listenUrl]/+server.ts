import { json, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { DOMParser, parseHTML } from 'linkedom'

export const GET = async ({ params, setHeaders }) => {
  // setHeaders({
	// 	'Acces-Control-Allow-Origin': '*',
	// 	'Cache-Control': `public, s-maxage=${60 * 60 * 24 * 365}`,
	// })

  
  const listenUrl = new URL(params.listenUrl)

  // function parseContributions ( html: string ) {
  //   const { document } = parseHTML(html)
  //   return document
  // }

  const response = await fetch(listenUrl)
  
  if (!response.ok) {
		throw new Error(`Failed to fetch: ${response.status}`)
	}

  async function getHtml( listenUrl: URL) {
    const response = await fetch(listenUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    return await response.text()
  }

  const html = await getHtml(listenUrl)

  async function parse( html: any ) {
    const {document} = await parseHTML(html)
    const content = document.head.querySelector('meta[property="og:video"]').content
    console.log(content)
    // const metaTags = document.getElementsByName('meta')
    // for ( const tag of metaTags) {
    //   console.log(tag)
    // }
    return content
  }
  
  const parsed =  json(parse(html))
  console.log(parsed)
  return parsed
}
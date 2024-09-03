import type { PageServerLoad, Actions } from './$types'
import { mobyDickArray } from '$lib/assets/text/mobyDick'
import { selectRandomPosts } from '$lib/resources/backend-calls/posts'

export const load: PageServerLoad = async () => {

    const postCount = 100
    const posts = await selectRandomPosts( postCount ) as App.RowData[]
    
    for ( const post of posts ) {
        post['display_name'] = `${mobyDickArray[Math.floor(Math.random() * mobyDickArray.length)]} ${mobyDickArray[Math.floor(Math.random() * mobyDickArray.length)]}`
    }

    return { posts, postCount }
}

export const actions = {
    morePosts: async({ request }) => {
        const data = await request.formData()
        const postCount = parseInt(data.get('post-count') as string)

        const posts = await selectRandomPosts( postCount ) as App.RowData[]
    
        for ( const post of posts ) {
            post['display_name'] = `${mobyDickArray[Math.floor(Math.random() * mobyDickArray.length)]} ${mobyDickArray[Math.floor(Math.random() * mobyDickArray.length)]}`
        }
    
        return posts

    }
} satisfies Actions
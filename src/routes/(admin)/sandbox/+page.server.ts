import type { Actions } from './$types'
// import { feedRewrite } from 'src/lib/resources/backend-calls/feed'
// import { add } from 'date-fns'


// export const load: PageServerLoad = async ( {locals: { safeGetSession }}) => {
//     const { session } = await safeGetSession()
//     const sessionUserId = session?.user.id as string
//     const batchSize = 5
//     let batchIterator = 0
//     const timestampEnd = new Date()
//     const timestampStart = add(timestampEnd, {days: -300})
//     const options = {'options': ['nowPlayingPosts', 'comments', 'reactions', 'collectionFollows', 'collectionEdits']}

//     const {feedData} = await feedRewrite( sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options)

//     const { feedItems } = feedData

//     return { sessionUserId, feedItems }
// }

export const actions = {
    applyOptions: async({ request }) => {
        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    },
    saveDefaults: async({ request, locals: { safeGetSession } }) => {
        const { session } = await safeGetSession()
        const sessionUserId = session?.user.id

        const data = await request.formData()
        const selected = data.getAll('selected-options')

        console.log(selected)
    }
} satisfies Actions
// @ts-nocheck
import type { PageServerLoad, Actions } from './$types'
import { selectAllOpenPublicCollections } from '$lib/resources/backend-calls/collections'

export const load = async () => {
    const batchSize = 5
    const batchIterator = 0

    const { batch, remainingCount } = await selectAllOpenPublicCollections( batchSize, batchIterator )

    const totalCollections = batch.collectionsCount[0].count

    const collections = batch.collections
    const remaining = remainingCount

    return { collections, remaining, totalCollections, batchSize, batchIterator }
}

export const actions = {
    loadMore: async ({ request }) => {
        const data = await request.formData()
        const collections = JSON.parse(data.get('collections') as string)
        const batchSize = parseInt(data.get('batch-size') as string)
        let batchIterator = parseInt(data.get('batch-iterator') as string)
        batchIterator ++

        const { batch, remainingCount } = await selectAllOpenPublicCollections( batchSize, batchIterator )

        collections.push(...batch.collections)
        const remaining = remainingCount as number
        
        return { collections, remaining, batchIterator }
    }
} satisfies Actions;null as any as PageServerLoad;
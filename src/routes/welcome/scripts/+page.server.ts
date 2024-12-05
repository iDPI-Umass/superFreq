import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { insertUpdateTopAlbumsCollection, selectEditableTopAlbumsCollection } from '$lib/resources/backend-calls/collections';
import { db } from 'src/database.ts'

let collections  = [] as App.RowData[]

let itemLookup = {
    'release_groups': 'release_group',
    'recordings': 'recording',
    'artists': 'artist'
} as App.StringLookupObject

export const load: PageServerLoad = async () => {

    const selectCollections = await db
    .selectFrom('collections_info as info')
    .innerJoin('collections_contents as contents', 'info.collection_id', 'contents.collection_id')
    .select([
    'info.collection_id as collection_id',
    'info.type as collection_type',
    'contents.id as id',
    'contents.item_type as item_type'
    ])
    .where('info.type', 'is not', null)
    .execute()

    collections = selectCollections
    console.log(collections.length)

    return {collections}
}

export const actions = {
    default: async () => {
        for ( const item of collections ) {
            const collectionType = item['collection_type']
            const newItemType = itemLookup[collectionType]
            const oldItemType = item['item_type']
            item['item_type'] = oldItemType ? oldItemType : newItemType

            delete item.collection_type
        }
        
        let updatedRows = []
        const updateCollections = await db.transaction().execute(async (trx) => {
            for ( const item of collections) {
                try {
                    const updatedRow = await trx
                    .updateTable('collections_contents')
                    .set({
                        'item_type': item['item_type']
                    })
                    .where('id', '=', item.id)
                    .returningAll()
                    .executeTakeFirstOrThrow()

                    updatedRows.push(updatedRow)
                }
                catch ( error ) {
                    console.log('error updating ', item)
                }
            }
        })

        const updatedCount = updatedRows.length
        console.log(updatedCount)

        const success = updatedCount > 0 ? true : false

        return ( success )
    }
} satisfies Actions
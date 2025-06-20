import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { insertUpdateTopAlbumsCollection, selectEditableTopAlbumsCollection } from 'src/lib/resources/collections';
import { db } from 'src/database.ts'

const collectionsSocial  = [] as App.RowData[]

let itemLookup = {
    'release_groups': 'release_group',
    'recordings': 'recording',
    'artists': 'artist'
} as App.StringLookupObject

export const load: PageServerLoad = async () => {
    collectionsSocial.length = 0 

    const select = await db
    .selectFrom('collections_social')
    .selectAll()
    .execute()

    collectionsSocial.push(...select)

    return { collectionsSocial }
}

export const actions = {
    default: async () => {

        const preparedCollectionsSocial = [] 
        for ( const item of collectionsSocial ) {
            const preparedItem = {
                'user_id': item.user_id,
                'collection_id': item.collection_id,
                'follows_now': item.follows_now,
                'user_role': item.user_role,
                'updated_at': item.updated_at,
                'changelog': item.changelog
            }

            preparedCollectionsSocial.push(preparedItem)
        }

        const insert = await db
        .insertInto('social_graph')
        .values(preparedCollectionsSocial)
        .returning('id')
        .execute()

        return { success: true }
    }
} satisfies Actions
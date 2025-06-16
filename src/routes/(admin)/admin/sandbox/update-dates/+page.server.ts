import type { Actions } from './$types'
import { db } from 'src/database.ts'

export const actions = {
    default: async({ request }) => {
        const data = await request.formData()
        const collectionId = data.get('collectionId') as string

        const updateCollection = db.transaction().execute(async (trx) => {
            const selectCollection = await trx
            .selectFrom('collections_info')
            .select('created_at')
            .where('collection_id', '=', collectionId)
            .executeTakeFirst()

            const createdAt = selectCollection?.created_at

            console.log(createdAt)

            let updatedRow = null as App.RowData | null
            if (createdAt) {
                const updateTable = await trx
                .updateTable('collections_info')
                .set({
                    updated_at: createdAt
                })
                .where('collection_id', '=', collectionId)
                .returning([
                    'collection_id',
                    'created_at',
                    'updated_at'
                ])
                .executeTakeFirst()

                updatedRow = updateTable ?? null
            }

            return { updatedRow }
        })

        const {updatedRow} = await updateCollection

        console.log(updatedRow)
    },
} satisfies Actions
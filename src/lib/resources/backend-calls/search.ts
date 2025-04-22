import { sql } from 'kysely'
import { db } from 'src/database.ts'

export const searchCollections = function ( collectionTitle: string, username: string | null = null ) {
    const user = username
    const search = await db
    .selectFrom('collections_info')
    .select(
        'collection_id',
        'collection_title',
        'collection_owner',
        'collection_updated_at',
        sql<number>`ts_rank(to_tsvector(collection_title), websearch_to_tsquery(${collectionTitle})) as rank`
    )
    .where(sql<boolean>`ts_rank(to_tsvector(collection_title), websearch_to_tsquery(${collectionTitle}))`)
    .orderBy('rank desc')
    .execute()

    return { search, user }
}
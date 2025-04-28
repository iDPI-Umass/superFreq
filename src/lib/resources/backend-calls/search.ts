import { sql } from 'kysely'
import { db } from 'src/database.ts'
import { searchResults } from '$lib/resources/states.svelte.ts'

export const searchCollections = async function ( query: string, queryType: string = 'title', limit: string = '100' ) {

    let results: App.RowData[]

    if ( queryType == 'title' ) {

        const search = await db
        .selectFrom('collection_metadata')
        .select([
            'id',
            'title',
            'user_id',
            'username',
            'display_name',
            'updated_at',
            sql`ts_rank(to_tsvector(title), websearch_to_tsquery(${query}))`.as('rank')
        ])
        .where(sql<boolean>`to_tsvector(title) @@ websearch_to_tsquery(${query})`)
        .where('is_top_albums', '!=', true)
        .limit(limit)
        .execute()

        results = search
    }
    else if ( queryType == 'user' ) {
        const search = await db
        .selectFrom('collection_metadata')
        .select([
            'id',
            'title',
            'user_id',
            'username',
            'display_name',
            'updated_at',
            sql`ts_rank(to_tsvector(username) || ' ' || to_tsvector(display_name), websearch_to_tsquery(${query}))`.as('rank')
        ])
        .where(sql<boolean>`to_tsvector(username) || ' ' || to_tsvector(display_name) @@ websearch_to_tsquery(${query})`)
        .where('is_top_albums', '!=', true)
        .limit(limit)
        .execute()

        results = search
    }
    searchResults.category = 'collections'
    // searchResults.results = results

    return { results }
}

export const searchUsers = async function ( query: string, limit: string = '25' ) {

    const search = await db
    .selectFrom('profile_display')
    .select([
        'id',
        'username',
        'display_name',
        'avatar_url',
        'last_fm_avatar_url',
        sql`ts_rank(to_tsvector(username) || ' ' || to_tsvector(display_name), websearch_to_tsquery(${query}))`.as('rank')
    ])
    .where(sql<boolean>`to_tsvector(username) || ' ' || to_tsvector(display_name) @@ websearch_to_tsquery(${query})`)
    .limit(limit)
    .execute()

    const results = search
    
    searchResults.category = 'users'
    searchResults.results = results

    return { results }
}
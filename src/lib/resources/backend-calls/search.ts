import { sql } from 'kysely'
import { db } from 'src/database.ts'
import { searchResults } from '$lib/resources/states.svelte.ts'

export const searchCollections = async function ( query: string, queryType: string = 'title', limit: number = 100 ) {

    let results: App.RowData[]

    if ( queryType == 'title' ) {
        const search = await db
        .selectFrom('collection_metadata')
        .select([
            'collection_id',
            'title',
            'owner_id',
            'username',
            'display_name',
            'updated_at',
            sql`ts_rank(title_search, websearch_to_tsquery(${query}), 1)`.as('rank')
        ])
        .where(sql<boolean>`title_search @@ websearch_to_tsquery(${query})`)
        .where('is_top_albums', '!=', true)
        .limit(limit)
        .orderBy('rank desc')
        .execute()

        results = search as App.RowData[]
    }
    else if ( queryType == 'user' ) {
        const search = await db
        .selectFrom('collection_metadata')
        .select([
            'collection_id',
            'title',
            'owner_id',
            'username',
            'display_name',
            'updated_at',
            sql`GREATEST(word_similarity(${query}, display_name), word_similarity(${query}, username))`.as('rank')
        ])
        .where(sql<boolean>`${query} <% username OR ${query} <% display_name`)
        .where('is_top_albums', '!=', true)
        .limit(limit)
        .orderBy('rank desc')
        .execute()

        results = search as App.RowData[]
    }
    searchResults.category = 'collections'
    searchResults.results = results

    return { results }
}

export const searchUsers = async function ( query: string, limit: number = 25 ) {

    const search = await db
    .selectFrom('profile_display')
    .select([
        'user_id',
        'username',
        'display_name',
        'avatar_url',
        'last_fm_avatar_url',
        sql`GREATEST(word_similarity(${query}, display_name), word_similarity(${query}, username))`.as('rank')
    ])
    .where(sql<boolean>`${query} <% username OR ${query} <% display_name`)
    .orderBy('rank desc')
    .limit(limit)
    .execute()

    const results = search
    
    searchResults.category = 'users'
    searchResults.results = results

    return { results }
}

export const searchUsersAndCollections = async function ( query: string, limit: number = 100 ) {
    const search = await db
    .selectFrom('collection_metadata')
    .select([
        'collection_id',
        sql<string | null>`null`.as('user_id'),
        'title',
        'owner_id',
        'username',
        'display_name',
        'updated_at',
        sql<string>`'collection'::text`.as('result_type'),
        sql<number>`ts_rank(title_search, websearch_to_tsquery(${query}), 1)`.as('rank')
    ])
    .where(sql<boolean>`title_search @@ websearch_to_tsquery(${query})`)
    .where('is_top_albums', '=', false)
    .union(db
        .selectFrom('profile_display')
        .select([
            sql<string | null>`null`.as('collection_id'),
            'user_id',
            sql<string | null>`null`.as('title'),
            sql<string | null>`null`.as('owner_id'),
            'username',
            'display_name',
            sql<Date | null>`null`.as('updated_at'),
            sql<string>`'user'::text`.as('result_type'),
            sql<number>`GREATEST(word_similarity(${query}, display_name), word_similarity(${query}, username))`.as('rank')
        ])
        .where(sql<boolean>`${query} <% username OR ${query} <% display_name`)
    )
    .orderBy('rank desc')
    .limit(limit)
    .execute()

    const results = search
    
    searchResults.category = 'collections'
    searchResults.results = results

    return { results }
}
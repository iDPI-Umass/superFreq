import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { insertUpdateTopAlbumsCollection, selectEditableTopAlbumsCollection } from '$lib/resources/backend-calls/collections';
import { db } from 'src/database.ts'

let metadata  = [] as App.RowData[]

let itemLookup = {
    'release_groups': 'release_group',
    'recordings': 'recording',
    'artists': 'artist'
} as App.StringLookupObject

export const load: PageServerLoad = async () => {

    const selectMetadata = await db
    .selectFrom('user_added_metadata')
    .selectAll()
    .where('artist_name', 'is', null)
    .where('release_group_name', 'is', null)
    .where('recording_name', 'is', null)
    .where('episode_title', 'is', null)
    .execute()

    metadata = selectMetadata

    return {metadata}
}

export const actions = {
    default: async () => {
        const updatedPostIds = []
        for ( const item of metadata ) {
            const metadataId = item['id']
            const postId = item['post_id']

            // const insertUserAddedMetadataRow = await db
            //     .insertInto('user_added_metadata')
            //     .values({
            //         artist_name: artistName,
            //         release_group_name: releaseGroupName,
            //         recording_name: recordingName,
            //         episode_title: episodeTitle,
            //         show_name: showName,
            //         listen_url: listenUrl,
            //         post_id: postId,
            //         added_by: userId
            //     })
            //     .returning('id')
            //     .executeTakeFirst()
            
            // const metadataId = insertUserAddedMetadataRow?.id as string

            const updatePost = await db
            .updateTable('posts')
            .set({
                user_added_metadata_id: null
            })
            .where('id', '=', postId)
            .returning('id')
            .executeTakeFirst()

            updatedPostIds.push(updatePost?.id)

            await db
            .deleteFrom('user_added_metadata')
            .where('id', '=', metadataId)
            .execute()
        }
        

        const updatedCount = updatedPostIds.length
        console.log(updatedCount)

        const success = updatedCount > 0 ? true : false

        return ( success )
    }
} satisfies Actions
import { redirect } from "@sveltejs/kit"
import type { PageServerLoad, Actions } from "./$types"
import { getLastFmCoverArt } from "src/lib/resources/musicbrainz"
import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({locals: { safeGetSession }}) => {
    const { session } = await safeGetSession()

    if (!session) {
        throw redirect(303, '/')
    }

    const select = await db
    .selectFrom('release_groups')
    .innerJoin('artists', 'release_groups.artist_mbid', 'artists.artist_mbid')
    .select([
        'release_groups.release_group_mbid as release_group_mbid',
        'release_groups.release_group_name as release_group_name',
        'release_groups.img_url as img_url',
        'release_groups.last_fm_img_url as last_fm_img_url',
        'release_groups.artist_mbid as artist_mbid',
        'artists.artist_name as artist_name'
    ])
    .execute()

    const releaseGroups = await select
    return { releaseGroups }
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData()
        const releaseGroups = JSON.parse(data.get('release-groups') as string)

        const cursedImgUrl = 'https://lastfm.freetls.fastly.net/i/u/300x300/152eda5cc22449eaa0874091eb7054b2.jpg'

        const updatedImages = []
        for ( const item of releaseGroups ) {
            if ( item['last_fm_img_url'] == cursedImgUrl )
            { 
                const lastFmCoverArtUrl = await getLastFmCoverArt(item)
                item['last_fm_img_url'] = lastFmCoverArtUrl
                delete item['artist_name']
                delete item['img_url']
                updatedImages.push(item)
            }
        }

        const update = await db
        .insertInto( 'release_groups' )
        .values( updatedImages )
        .onConflict((oc) => oc
            .column( 'release_group_mbid' )
            .doUpdateSet((eb) => ({
                last_fm_img_url: eb.ref('excluded.last_fm_img_url'),
            }))
        )
        .returningAll()
        .execute()

        const updateCount = update.length

        return { updateCount, success: true }
    }
} satisfies Actions
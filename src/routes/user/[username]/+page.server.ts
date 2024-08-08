import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { db } from 'src/database.ts'
import { insertUpdateBlock, insertUserFlag } from '$lib/resources/backend-calls/userActions'

export const load: PageServerLoad = async ({ params, locals: { safeGetSession }}) => {

    const session = await safeGetSession()

    const profileUsername = params.username
    const sessionUserId = session?.user?.id as string

    const selectProfileUser = await db.transaction().execute(async (trx) => {
        const profileUserData = await trx
        .selectFrom('profiles')
        .selectAll()
        .where('username', '=', profileUsername)
        .executeTakeFirst()

        // figure out if profileUser has blocked sessionUser
        let blockInfo
        try {
            blockInfo = await trx
                .selectFrom('user_moderation_actions')
                .selectAll()
                .where(({ eb, and }) => 
                    and([
                        eb('user_id', '=', profileUserData?.id as string),
                        eb('target_user_id', '=', sessionUserId),
                        eb('type', '=', 'block')
                    ])
                )
                .executeTakeFirstOrThrow()

                if ( blockInfo?.active == true ) {
                    return { profileUserData, blockInfo, permission: false }
                }
        }
        catch( error ) {
            blockInfo = null
        }

        // if sessionUser not blocked, get more profile data
        const collectionCount = await trx
        .selectFrom('collections_social')
        .select((eb) => eb
            .fn.count<number>('id')
            .as('count')
        )
        .where(({eb, or}) => or([
                eb('user_role','=', 'owner'),
                eb('user_role', '=', 'collaborator')
            ])
        )
        .execute()

        const collectionFollowingCount = await trx
        .selectFrom('collections_social')
        .select((eb) => eb
            .fn.count<number>('id')
            .as('count')
        )
        .where(({eb, and}) => and([
                eb('user_role','=', 'follower'),
                eb('follows_now', '=', true)
            ])
        )
        .execute()

        const userFollowingCount = await trx
        .selectFrom('social_graph')
        .select((eb) => eb
            .fn.count<number>('id')
            .as('count')
        )
        .where(({eb, and}) => and([
                eb('user_id','=', profileUserData?.id as string),
                eb('follows_now', '=', true)
            ])
        )
        .execute()

        const nowPlayingPostsCount = await trx
        .selectFrom('posts')
        .select((eb) => eb
            .fn.count<number>('id')
            .as('count')
        )
        .where(({eb, and}) => and([
                eb('user_id','=', profileUserData?.id as string),
                eb('type', '=', 'now_playing'),
                eb('status', '!=', 'deleted')
            ])
        )
        .execute()

        const topAlbumsCollection = await trx
        .selectFrom('collections_contents')
        .selectAll()
        .where('collection_id', '=', profileUserData?.top_albums_collection_id as string)
        .innerJoin(
            'artists',
            (join) => join
                .onRef('artists.artist_mbid', '=', 'collections_contents.artist_mbid')
        )
        .innerJoin(
            'release_groups',
            (join) => join
                .onRef('release_groups.release_group_mbid', '=', 'collections_contents.release_group_mbid')
        )
        .execute()
        return { profileUserData, collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, blockInfo, permission: true}
    })

    const profileData = await selectProfileUser
    const { profileUserData, blockInfo, permission } = profileData
    const collectionCount = profileData['collectionCount'][0]['count'] ?? null
    const collectionFollowingCount = profileData['collectionFollowingCount'][0]['count'] ?? null
    const userFollowingCount = profileData['userFollowingCount'][0]['count'] ?? null
    const nowPlayingPostsCount = profileData['nowPlayingPostsCount'][0]['count'] ?? null
    const topAlbumsCollection = profileData.topAlbumsCollection ?? null

    return { profileUserData, blockInfo, permission,collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, sessionUserId }
}

export const actions = { 
    blockUser: async({ request }) => {
        const data = await request.formData()
        const blockInfo = JSON.parse(data.get('block-info') as string)
        const profileUserId = data.get('profile-user-id') as string
        const sessionUserId = data.get('session-user-id') as string

        const block = await insertUpdateBlock(blockInfo, profileUserId, sessionUserId)
        
        return block
    },
    reportUser: async({ request }) => {
        const data = await request.formData()
        const profileUserId = data.get('profile-user-id') as string
        const sessionUserId = data.get('session-user-id') as string

        const flag = await insertUserFlag( profileUserId, sessionUserId )

        return flag
    }
} satisfies Actions
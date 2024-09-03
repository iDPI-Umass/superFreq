import { db } from 'src/database.ts'
import { parseISO } from 'date-fns'

/* Select data for a user's profile page. Data returned depends on if user has blocked session user. */

export const selectProfilePageData = async function ( sessionUserId: string, profileUsername: string ) {

    const selectProfileData = await db.transaction().execute(async (trx) => {
        const profileUserData = await trx
        .selectFrom('profiles')
        .select([
            'id', 
            'username', 
            'display_name', 
            'avatar_url', 
            'website', 
            'about', 
            'top_albums_collection_id'
        ])
        .where('username', '=', profileUsername)
        .executeTakeFirst()

        // return limited data if profile user actively blocks sessino user
        const blockInfo = await trx
            .selectFrom('user_moderation_actions')
            .select(['id'])
            .where(({ eb }) => eb.and({
                user_id: profileUserData?.id as string,
                target_user_id: sessionUserId,
                type: 'block',
                active: true
            }))
            .executeTakeFirst()

        if ( blockInfo ) {
            return { profileUserData, permission: false }
        }

        // if sessionUser not blocked, do the following:

        // figure out if sessionUser follows profileUser
        const followInfo = await trx
            .selectFrom('social_graph')
            .select(['id', 'follows_now'])
            .where(({ eb }) => eb.and({
                user_id: sessionUserId,
                target_user_id: profileUserData?.id as string,
            }))
            .executeTakeFirst()

        // get metrics
        const collectionCount = await trx
            .selectFrom('collections_social')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb, or}) => or([
                eb('user_role','=', 'owner'),
                eb('user_role', '=', 'collaborator')
            ]))
            .execute()

        const collectionFollowingCount = await trx
            .selectFrom('collections_social')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb}) => eb.and({
                user_role: 'follower',
                follows_now: true
            }))
            .execute()

        const userFollowingCount = await trx
            .selectFrom('social_graph')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb}) => eb.and({
                user_id: profileUserData?.id as string,
                follows_now: true
            }))
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
            ]))
            .execute()

        // get user's top albums collection
        const topAlbumsCollection = await trx
            .selectFrom('collections_contents')
            .innerJoin('artists', 'artists.artist_mbid', 'collections_contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'collections_contents.release_group_mbid')
            .select([
                'collections_contents.collection_id as collection_id', 
                'collections_contents.artist_mbid as artist_mbid', 
                'collections_contents.release_group_mbid as release_group_mbid', 
                'item_position', 
                'artists.artist_name as artist_name', 
                'release_groups.release_group_name as release_group_name', 
                'release_groups.img_url as img_url'
            ])
            .where('collection_id', '=', profileUserData?.top_albums_collection_id as string)
            .execute()

        return { profileUserData, collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, followInfo, permission: true }
    })
    
    const profile = await selectProfileData
    return profile
}

/* Select profile info for session user's account */

export const selectSessionProfile = async function ( sessionUserId: string ) {
    const selectProfile = await db
    .selectFrom('profiles')
    .selectAll()
    .where('id', '=', sessionUserId)
    .executeTakeFirst()

    const profile = await selectProfile
    return profile
}

/* Update profile for session user's account */

export const updateSessionProfile = async function ( sessionUserId: string, profileData: App.RowData ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const update = await db.transaction().execute(async (trx) => {

        const selectChangelog = await trx
        .selectFrom('profiles')
        .select('changelog')
        .where('id', '=', sessionUserId)
        .executeTakeFirst()

        const changelog = selectChangelog as App.Changelog

        changelog[timestampISOString] = {
            display_name: profileData?.displayName,
            username: profileData?.username,
            website: profileData?.website,
            avatar_mbid: profileData?.avatarMbid,
            avatar_url: profileData?.avatarUrl,
            updated_at: timestampISO,
            about: profileData?.about,
        }

        const updateProfile = await trx
        .updateTable('profiles')
        .set({
            display_name: profileData?.displayName,
            website: profileData?.website,
            avatar_mbid: profileData?.avatarMbid,
            avatar_url: profileData?.avatarUrl,
            updated_at: timestampISO,
            about: profileData?.about,
            changelog: changelog
        })
        .where('id', '=', sessionUserId)
        .returning(['id', 'updated_at'])
        .executeTakeFirst()

        return updateProfile
    })

    return update
}

/* Update username after verifying it is unique */

export const updateUsername = async function ( sessionUserId: string, newUsername: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const updateUsername = await db.transaction().execute(async (trx) => {
        let success: boolean 

        try {
            await trx
            .selectFrom('profiles')
            .select(['display_name', 'username', 'id'])
            .where('username', '=', newUsername)
            .where('id', '!=', sessionUserId)
            .executeTakeFirstOrThrow()

            success = false

            return { success }
        }
        catch (error) {
            const profileData = await trx
            .selectFrom('profiles')
            .selectAll()
            .where('id', '=', sessionUserId)
            .executeTakeFirst()

            const changelog = profileData?.changelog as App.Changelog

            changelog[timestampISOString] = {
                display_name: profileData?.display_name,
                username: newUsername,
                website: profileData?.website,
                avatar_mbid: profileData?.avatar_mbid,
                avatar_url: profileData?.avatar_url,
                updated_at: timestampISO,
                about: profileData?.about,
            }

            const updateUsername = await trx
            .updateTable('profiles')
            .set({
                username: newUsername,
                changelog: changelog
            })
            .where('id', '=', sessionUserId)
            .returning(['display_name', 'username', 'id'])
            .executeTakeFirst() 

            success = true

            const update = await updateUsername

            return({ update, success }) 
        }
    }) 
    return updateUsername
}


/* Block or unblock a user */

export const insertUpdateBlock = async function ( profileUserId: string, sessionUserId: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const userBlock = await db.transaction().execute(async(trx) => {

        try {
            const selectBlock = await trx
                .selectFrom('user_moderation_actions')
                .select(['id', 'active', 'changelog'])
                .where(({ eb }) => eb.and({
                    user_id: sessionUserId,
                    target_user_id: profileUserId,
                    type: 'block'
                }))
                .executeTakeFirstOrThrow()
            
            const block = await selectBlock

            const id = block?.id as string
            const active = block?.active as boolean
            const changelog = block?.changelog as App.Changelog
            
            changelog[timestampISOString] = {
                'active': !active
            }

            const updateBlock = await trx
            .updateTable('user_moderation_actions')
            .set({
                active: !active,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', id)
            .returning(['type', 'active','id'])
            .executeTakeFirst()

            return updateBlock
        }
        catch (error) {
            const changelog: App.Changelog = {}

            changelog[timestampISOString] = {
                active: true,
            }

            const insertBlock = await trx
            .insertInto('user_moderation_actions')
            .values({
                user_id: sessionUserId,
                target_user_id: profileUserId,
                updated_at: timestampISO,
                type: 'block',
                active: true,
                changelog: changelog
            })
            .returning(['type', 'active','id'])
            .executeTakeFirst()

            return insertBlock
        }
    })

    return userBlock
} 

/* Flag a post */

export const insertPostFlag = async function ( sessionUserId: string, postId: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const changelog: App.Changelog = {}
    changelog[timestampISOString] = {
        'user_id': sessionUserId,
        'target_post_id': postId,
        'type': 'flag',
        'active': true
    }

    const insertFlag = await db
        .insertInto('user_moderation_actions')
        .values({
            user_id: sessionUserId,
            target_post_id: postId,
            type: 'flag',
            updated_at: timestampISO,
            active: true,
            changelog: changelog
        })
        .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 

/* Flag a user */

export const insertUserFlag = async function ( sessionUserId: string, profileUserId: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const changelog: App.Changelog = {}

    changelog[timestampISOString] = {
        user_id: sessionUserId,
        target_user_id: profileUserId,
        type: "flag",
        active: true,
    }

    const insertFlag = await db
    .insertInto('user_moderation_actions')
    .values({
        user_id: sessionUserId,
        target_user_id: profileUserId,
        type: "flag",
        active: true,
        updated_at: timestampISO,
        changelog: changelog
    })
    .returning([
        'user_id', 
        'target_user_id', 
        'type', 
        'active'
    ])
    .executeTakeFirst()

    const flag = await insertFlag
    return flag
} 

/* Follow or unfollow a user */

export const insertUpdateUserFollow = async function ( profileUserId: string, sessionUserId: string ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const follow = await db.transaction().execute(async(trx) => {

        try {
            const selectUserFollow = await trx
            .selectFrom('social_graph')
            .select(['id', 'follows_now', 'changelog'])
            .where(({ eb }) => eb.and({
                user_id: sessionUserId,
                target_user_id: profileUserId
            }))
            .executeTakeFirstOrThrow()

            const userFollow = await selectUserFollow

            const id = userFollow?.id as string
            const followsNow = userFollow?.follows_now as boolean
            const changelog = userFollow?.changelog as App.Changelog
            
            changelog[timestampISOString] = {
                'follows_now': !followsNow
            }

            console.log(changelog)

            const updateCollectionFollow = await trx
            .updateTable('social_graph')
            .set({
                follows_now: !followsNow,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', id)
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return updateCollectionFollow
        }
        catch(error) {
            const changelog: App.Changelog = {}
            changelog[timestampISOString] = {
                follows_now: true,
            }
            const insertUserFollow = await trx
            .insertInto('social_graph')
            .values({
                user_id: sessionUserId,
                target_user_id: profileUserId,
                updated_at: timestampISO,
                follows_now: true,
                changelog: changelog
            })
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return insertUserFollow
        }
    })

    return follow
}

/* Follow or unfollow a collection */

export const insertUpdateCollectionFollow =  async function ( sessionUserId: string, collectionId: string ) {

    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    const follow = await db.transaction().execute(async (trx) => {
        try {
            const selectCollectionFollow = await trx
            .selectFrom('collections_social')
            .selectAll()
            .where(({ eb }) => eb.and({
                user_id: sessionUserId,
                collection_id: collectionId
            }))
            .executeTakeFirstOrThrow()

            const collectionFollow = await selectCollectionFollow

            const id = collectionFollow?.id as string
            const followsNow = collectionFollow?.follows_now as boolean
            const userRole = collectionFollow?.user_role as string
            const changelog = collectionFollow?.changelog as App.Changelog
            
            changelog[timestampISOString] = {
                follows_now: !followsNow,
                user_role: userRole
            }

            const updateCollectionFollow = await trx
            .updateTable('collections_social')
            .set({
                follows_now: !followsNow,
                updated_at: timestampISO,
                changelog: changelog
            })
            .where('id', '=', id)
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return updateCollectionFollow
        }
        catch(error) {
            const changelog: App.Changelog = {}
            changelog[timestampISOString] = {
                follows_now: true,
                user_role: 'follower'
            }
            const insertCollectionFollow = await trx
            .insertInto('collections_social')
            .values({
                user_id: sessionUserId,
                collection_id: collectionId,
                updated_at: timestampISO,
                follows_now: true,
                changelog: changelog
            })
            .returning(['follows_now','id'])
            .executeTakeFirst()

            return insertCollectionFollow
        }
    })

    return follow
}
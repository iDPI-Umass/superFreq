import { db } from 'src/database.ts'
import { parseISO } from 'date-fns'
import { prepareAvatarMetadataInsert } from '$lib/resources/parseData'

/* Check login/signup permission */

export const checkLoginPermission = async function ( email: string ) {
    try {
        await db
        .selectFrom('approved_users')
        .select(['id'])
        .where('email', '~*', email)
        .executeTakeFirstOrThrow()

        return true
    }
    catch ( error ) {
        return false
    }
}

/* Select data for session user */

export const selectSessionUserProfileData = async function ( sessionUserId: string ) {

    const selectProfileData = await db
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
    .where('id', '=', sessionUserId)
    .executeTakeFirst()
    
    const profile = await selectProfileData
    return profile
}

/* Select data for a user's profile page. Data returned depends on if user has blocked session user. */

export const selectProfilePageData = async function ( sessionUserId: string, profileUsername: string ) {

    const selectProfileData = await db.transaction().execute(async (trx) => {
        const profileUserData = await trx
        .selectFrom('profiles')
        .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
        .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
        .select([
            'id', 
            'username', 
            'display_name', 
            'release_groups.img_url as avatar_url',
            'release_groups.last_fm_img_url as last_fm_img_url',
            'website', 
            'about', 
            'top_albums_collection_id',
            'release_groups.release_group_name as avatar_release_group_name',
            'artists.artist_name as avatar_artist_name'
        ])
        .where('username', '=', profileUsername)
        .executeTakeFirst()

        const profileUserId = profileUserData?.id as string

        // return limited data if profile user actively blocks session user
        const sessionUserBlockInfo = await trx
            .selectFrom('user_moderation_actions')
            .select(['id'])
            .where(({ eb }) => eb.and({
                user_id: profileUserId,
                target_user_id: sessionUserId,
                type: 'block',
                active: true
            }))
            .executeTakeFirst()

        if ( sessionUserBlockInfo ) {
            return { profileUserData, profileUserBlockInfo: null, profileUserFlagInfo: null, collectionCount: null, collectionFollowingCount: null, userFollowingCount: null, nowPlayingPostsCount: null, topAlbumsCollection: null, followInfo: null, permission: false }
        }

        // if sessionUser not blocked, do the following:

        // figure out if sessionUser follows profileUser
        const followInfo = await trx
            .selectFrom('social_graph')
            .select(['id', 'follows_now'])
            .where(({ eb }) => eb.and({
                user_id: sessionUserId,
                target_user_id: profileUserId,
            }))
            .executeTakeFirst()

        // figure out if sessionUser actively blocks profileUser
        const profileUserBlockInfo = await trx
        .selectFrom('user_moderation_actions')
        .select(['id', 'type', 'active'])
        .where(({ eb }) => eb.and({
            user_id: sessionUserId,
            target_user_id: profileUserId,
            type: 'block'
        }))
        .executeTakeFirst()

        // figure out if sessionUser has flagged profileUser
        const profileUserFlagInfo = await trx
        .selectFrom('user_moderation_actions')
        .select(['id', 'type', 'active'])
        .where(({ eb }) => eb.and({
            user_id: sessionUserId,
            target_user_id: profileUserId,
            type: 'flag'
        }))
        .executeTakeFirst()

        // get metrics
        const countCollections = await trx
            .selectFrom('collections_social')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb, and, or}) => and([
                eb('user_id', '=', profileUserId),
                or([
                    eb('user_role','=', 'owner'),
                    eb('user_role', '=', 'collaborator')
                ])]))
            .execute()
        
        const collectionCount = countCollections[0]['count']

        const countCollectionsFollowing = await trx
            .selectFrom('collections_social')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb}) => eb.and({
                user_role: 'follower',
                follows_now: true,
                user_id: profileUserId
            }))
            .execute()

        const collectionFollowingCount = countCollectionsFollowing[0]['count']

        const countUsersFollowing = await trx
            .selectFrom('social_graph')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb}) => eb.and({
                user_id: profileUserId,
                follows_now: true
            }))
            .execute()

        const userFollowingCount = countUsersFollowing[0]['count']

        const countNowPlayingPosts = await trx
            .selectFrom('posts')
            .select((eb) => eb
                .fn.count<number>('id')
                .as('count')
            )
            .where(({eb, and}) => and([
                eb('user_id','=', profileUserId),
                eb('type', '=', 'now_playing'),
                eb('status', '!=', 'deleted')
            ]))
            .execute()
        
        const nowPlayingPostsCount = countNowPlayingPosts[0]['count']

        // get user's top albums collection
        const topAlbumsCollection = await trx
            .selectFrom('collections_contents')
            .innerJoin('artists', 'artists.artist_mbid', 'collections_contents.artist_mbid')
            .innerJoin('release_groups', 'release_groups.release_group_mbid', 'collections_contents.release_group_mbid')
            .select([
                'collections_contents.collection_id as collection_id', 
                'collections_contents.artist_mbid as artist_mbid', 
                'collections_contents.release_group_mbid as release_group_mbid', 
                'collections_contents.item_position as item_position', 
                'artists.artist_name as artist_name', 
                'release_groups.release_group_name as release_group_name', 
                'release_groups.img_url as img_url',
                'release_groups.last_fm_img_url as last_fm_img_url'
            ])
            .where('collection_id', '=', profileUserData?.top_albums_collection_id as string)
            .where('collections_contents.item_position', 'is not', null)
            .execute()

        
        return { profileUserData, profileUserBlockInfo, profileUserFlagInfo, collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, followInfo, permission: true }
    })
    
    const profile = await selectProfileData
    return profile
}

/* Select list of all users */

export const selectAllUsers = async function () {
    const selectUsers = await db
    .selectFrom('profiles')
    .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
    .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
    .select([
        'profiles.id as id', 
        'profiles.username as username', 
        'profiles.display_name as display_name',
        'release_groups.img_url as avatar_url',
        'release_groups.last_fm_img_url as avatar_last_fm_img_url',
        'release_groups.release_group_name as avatar_release_group_name',
        'artists.artist_name as avatar_artist_name' 
    ])
    .orderBy('profiles.updated_at desc')
    .execute()

    const users = await selectUsers
    
    return users
}


/* Select profile info for session user's account */

export const selectSessionProfile = async function ( sessionUserId: string ) {
    const selectProfile = await db
    .selectFrom('profiles')
    .leftJoin('release_groups', 'release_groups.release_group_mbid', 'profiles.avatar_mbid')
    .leftJoin('artists', 'artists.artist_mbid', 'release_groups.artist_mbid')
    .select([
        'profiles.id as id',
        'profiles.username as username',
        'profiles.display_name as display_name',
        'profiles.about as about',
        'profiles.website as website',
        'profiles.top_albums_collection_id as top_albums_collection_id',
        'release_groups.last_fm_img_url as avatar_last_fm_img_url',
        'profiles.avatar_mbid as avatar_mbid',
        'release_groups.img_url as avatar_url',
        'release_groups.last_fm_img_url as avatar_last_fm_img_url',
        'artists.artist_name as avatar_artist_name',
        'artists.artist_mbid as avatar_artist_mbid',
        'release_groups.release_group_name as avatar_release_group_name',
        'release_groups.release_group_mbid as avatar_release_group_mbid'
    ])
    .where('id', '=', sessionUserId)
    .executeTakeFirst()

    const profile = await selectProfile
    return profile
}

/* New profile for session user updating row generated during account confirmation. Checks if username is already taken. */

export const newSessionProfile = async function ( sessionUserId: string, profileData: App.RowData, email: string, avatarItem: App.RowData ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    // prepare avatar metadata if avatar is being updated
    const hasAvatar = profileData.avatar_url ? true : false
    let artistsMetadata = []
    let releaseGroupsMetadata = []

    if ( hasAvatar ) {
        const preparedMetadata = prepareAvatarMetadataInsert(avatarItem)
        artistsMetadata = preparedMetadata.artistsMetadata
        releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata
    }

    const update = await db.transaction().execute(async (trx) => {

        try {
            // make sure username isn't taken
            const username = profileData?.username

            await trx
            .selectFrom('profiles')
            .select(['username', 'id'])
            .where('username', '=', username)
            .where('id', '!=', sessionUserId)
            .executeTakeFirstOrThrow()

            return { success: false }
        }
        catch ( error ) {
            // associate profile with approved_users table
            await trx
            .updateTable('approved_users')
            .set({
                user_id: sessionUserId
            })
            .where('email', '=', email)
            .executeTakeFirst()

            // music metadata inserts for new avatar as release_group
            if (hasAvatar) {
                await trx
                        .insertInto('artists')
                        .values(artistsMetadata)
                        .onConflict((oc) => oc
                            .doNothing()
                        )
                        .returningAll()
                        .execute()
                await trx
                    .insertInto('release_groups')
                    .values(releaseGroupsMetadata)
                    .onConflict((oc) => oc
                        .doNothing()
                    )
                    .returningAll()
                    .execute()
            }
            
            // new changelog entry
            const selectChangelog = await trx
            .selectFrom('profiles')
            .select(['id','changelog'])
            .where('id', '=', sessionUserId)
            .executeTakeFirst()
    
            const changelog = selectChangelog?.changelog as App.Changelog
    
            changelog[timestampISOString] = {
                'username': profileData?.username,
                'display_name': profileData?.display_name,
                'website': profileData?.website,
                'avatar_mbid': profileData?.avatar_mbid,
                'avatar_url': profileData?.avatar_url,
                'about': profileData?.about,
            }

            // update profile
    
            if ( hasAvatar ) {       
                await trx
                .updateTable('profiles')
                .set({
                    username: profileData?.username,
                    display_name: profileData?.display_name,
                    website: profileData?.website,
                    avatar_mbid: profileData?.avatar_mbid,
                    avatar_url: profileData?.avatar_url,
                    updated_at: timestampISO,
                    about: profileData?.about,
                    changelog: changelog
                })
                .where('id', '=', sessionUserId)
                .returning([
                    'id',
                    'username', 
                    'display_name', 
                    'website', 
                    'avatar_mbid', 
                    'avatar_url', 
                    'about', 
                    'updated_at'
                ])
                .executeTakeFirst()

                return { success: true }
            }
            else {
                await trx
                .updateTable('profiles')
                .set({
                    username: profileData?.username,
                    display_name: profileData?.display_name,
                    website: profileData?.website,
                    updated_at: timestampISO,
                    about: profileData?.about,
                    changelog: changelog
                })
                .where('id', '=', sessionUserId)
                .returning([
                    'id',
                    'username', 
                    'display_name', 
                    'website', 
                    'avatar_mbid', 
                    'avatar_url', 
                    'about', 
                    'updated_at'
                ])
                .executeTakeFirst()

                return { success: true }
            }
        }
    })
    return update
}

/* Update profile for session user's account */

export const updateSessionProfile = async function ( sessionUserId: string, profileData: App.RowData, avatarItem: App.RowData ) {
    const timestampISOString: string = new Date().toISOString()
    const timestampISO: Date = parseISO(timestampISOString)

    // prepare avatar metadata if avatar is being updated
    const hasAvatar = ( avatarItem && Object.keys(avatarItem).length > 0) ? true : false
    let artistsMetadata = []
    let releaseGroupsMetadata = []

    if ( hasAvatar ) {
        const preparedMetadata = prepareAvatarMetadataInsert(avatarItem)
        artistsMetadata = preparedMetadata.artistsMetadata
        releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata
    }

    const update = await db.transaction().execute(async (trx) => {

        // music metadata inserts for new avatar as release_group
        if (hasAvatar) {
            await trx
                .insertInto('artists')
                .values(artistsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
            await trx
                .insertInto('release_groups')
                .values(releaseGroupsMetadata)
                .onConflict((oc) => oc
                    .doNothing()
                )
                .returningAll()
                .execute()
        }

        // new changelog entry
        const selectChangelog = await trx
        .selectFrom('profiles')
        .select('changelog')
        .where('id', '=', sessionUserId)
        .executeTakeFirst()

        const changelog = selectChangelog?.changelog as App.Changelog

        changelog[timestampISOString] = {
            'username': profileData?.username,
            'display_name': profileData?.display_name,
            'website': profileData?.website,
            'avatar_mbid': profileData?.avatar_mbid,
            'avatar_url': profileData?.avatar_url,
            'about': profileData?.about,
        }

        // update profile
        const updateProfile = await trx
        .updateTable('profiles')
        .set({
            display_name: profileData?.display_name,
            website: profileData?.website,
            avatar_mbid: profileData?.avatar_mbid,
            avatar_url: profileData?.avatar_url,
            updated_at: timestampISO,
            about: profileData?.about,
            changelog: changelog
        })
        .where('id', '=', sessionUserId)
        .returning([
            'id',
            'username', 
            'display_name', 
            'website', 
            'avatar_mbid', 
            'avatar_url', 
            'about', 
            'updated_at'
        ])
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

            return { update: null, success: false }
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
                about: profileData?.about,
            }

            const updateUsername = await trx
            .updateTable('profiles')
            .set({
                username: newUsername,
                changelog: changelog
            })
            .where('id', '=', sessionUserId)
            .returning(['display_name', 'username', 'id', 'avatar_url'])
            .executeTakeFirst() 

            const update = await updateUsername

            return { update, success: true }
        }
    }) 
    return updateUsername
}


/* Block or unblock a user */

export const insertUpdateBlock = async function ( sessionUserId: string, profileUserId: string ) {

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
    const success = flag ? true : false
    return success
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

export const insertUpdateUserFollow = async function ( sessionUserId: string, profileUserId: string ) {
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

export const selectListUserFollowing = async function( sessionUserId: string, username: string ) {
    const selectUserList = await db.transaction().execute(async (trx) => {

        const userProfile = await trx
            .selectFrom('profiles')
            .select(['id', 'display_name'])
            .where('username', '=', username)
            .executeTakeFirst()

        const profileUserId = userProfile?.id as string
        const profileDisplayName = userProfile?.display_name as string

        try {
            const blockInfo = await trx
            .selectFrom('user_moderation_actions')
            .select(['id', 'type', 'active'])
            .where(({eb, and}) => and([
                eb('user_id', '=', profileUserId),
                eb('target_user_id', '=', sessionUserId),
                eb('type', '=', 'block'),
                eb('active', '=', true)
            ]))
            .executeTakeFirstOrThrow()

            if ( blockInfo ) {
                return { permission: false, profiles: null, profileDisplayName: null }
            }
        }
        catch ( error ) {
            const selectProfiles = await trx
            .selectFrom('profiles')
            .innerJoin('social_graph as following', 'following.target_user_id', 'profiles.id')
            .select([
                'profiles.id as user_id',
                'profiles.username as username',
                'profiles.display_name as display_name',
                'profiles.avatar_url as avatar_url',
            ])
            .where(({eb, and}) => and([
                eb('following.user_id', '=', profileUserId),
                eb('following.follows_now', '=', true)
            ]))
            .execute()

            const profiles = selectProfiles

            return { permission: true, profiles, profileDisplayName }
        }
    })

    const { permission, profiles, profileDisplayName } = selectUserList
    return { permission, profiles, profileDisplayName } 
}
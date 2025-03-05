import { d as db } from "./database.js";
import { parseISO } from "date-fns";
import { p as prepareAvatarMetadataInsert } from "./parseData.js";
const checkLoginPermission = async function(email) {
  try {
    await db.selectFrom("approved_users").select(["id"]).where("email", "ilike", email).executeTakeFirstOrThrow();
    return true;
  } catch (error) {
    return false;
  }
};
const selectProfilePageData = async function(sessionUserId, profileUsername) {
  const selectProfileData = await db.transaction().execute(async (trx) => {
    const profileUserData = await trx.selectFrom("profiles").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
      "id",
      "username",
      "display_name",
      "release_groups.img_url as avatar_url",
      "release_groups.last_fm_img_url as last_fm_img_url",
      "website",
      "about",
      "top_albums_collection_id",
      "release_groups.release_group_name as avatar_release_group_name",
      "artists.artist_name as avatar_artist_name"
    ]).where("username", "=", profileUsername).executeTakeFirst();
    const profileUserId = profileUserData?.id;
    const sessionUserBlockInfo = await trx.selectFrom("user_moderation_actions").select(["id"]).where(({ eb }) => eb.and({
      user_id: profileUserId,
      target_user_id: sessionUserId,
      type: "block",
      active: true
    })).executeTakeFirst();
    if (sessionUserBlockInfo) {
      return { profileUserData, profileUserBlockInfo: null, profileUserFlagInfo: null, collectionCount: null, collectionFollowingCount: null, userFollowingCount: null, nowPlayingPostsCount: null, topAlbumsCollection: null, followInfo: null, permission: false };
    }
    const followInfo = await trx.selectFrom("social_graph").select(["id", "follows_now"]).where(({ eb }) => eb.and({
      user_id: sessionUserId,
      target_user_id: profileUserId
    })).executeTakeFirst();
    const profileUserBlockInfo = await trx.selectFrom("user_moderation_actions").select(["id", "type", "active"]).where(({ eb }) => eb.and({
      user_id: sessionUserId,
      target_user_id: profileUserId,
      type: "block"
    })).executeTakeFirst();
    const profileUserFlagInfo = await trx.selectFrom("user_moderation_actions").select(["id", "type", "active"]).where(({ eb }) => eb.and({
      user_id: sessionUserId,
      target_user_id: profileUserId,
      type: "flag"
    })).executeTakeFirst();
    const countCollections = await trx.selectFrom("collections_social as social").innerJoin("collections_info as info", "info.collection_id", "social.collection_id").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb, and, or, not }) => and([
      eb("social.user_id", "=", profileUserId),
      or([
        eb("social.user_role", "=", "owner"),
        eb("social.user_role", "=", "collaborator")
      ]),
      not(eb("info.status", "=", "deleted"))
    ])).execute();
    const collectionCount = countCollections[0]["count"];
    const countCollectionsFollowing = await trx.selectFrom("collections_social").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb }) => eb.and({
      user_role: "follower",
      follows_now: true,
      user_id: profileUserId
    })).execute();
    const collectionFollowingCount = countCollectionsFollowing[0]["count"];
    const countUsersFollowing = await trx.selectFrom("social_graph").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb }) => eb.and({
      user_id: profileUserId,
      follows_now: true
    })).execute();
    const userFollowingCount = countUsersFollowing[0]["count"];
    const countNowPlayingPosts = await trx.selectFrom("posts").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb, and }) => and([
      eb("user_id", "=", profileUserId),
      eb("type", "=", "now_playing"),
      eb("status", "!=", "deleted")
    ])).execute();
    const nowPlayingPostsCount = countNowPlayingPosts[0]["count"];
    const topAlbumsCollection = await trx.selectFrom("collections_contents").innerJoin("artists", "artists.artist_mbid", "collections_contents.artist_mbid").innerJoin("release_groups", "release_groups.release_group_mbid", "collections_contents.release_group_mbid").select([
      "collections_contents.collection_id as collection_id",
      "collections_contents.artist_mbid as artist_mbid",
      "collections_contents.release_group_mbid as release_group_mbid",
      "collections_contents.item_position as item_position",
      "artists.artist_name as artist_name",
      "release_groups.release_group_name as release_group_name",
      "release_groups.img_url as img_url",
      "release_groups.last_fm_img_url as last_fm_img_url"
    ]).where("collection_id", "=", profileUserData?.top_albums_collection_id).where("collections_contents.item_position", "is not", null).orderBy("collections_contents.item_position").execute();
    return { profileUserData, profileUserBlockInfo, profileUserFlagInfo, collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, followInfo, permission: true };
  });
  const profile = await selectProfileData;
  return profile;
};
const selectAllUsers = async function() {
  const selectUsers = await db.selectFrom("profiles").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
    "profiles.id as id",
    "profiles.username as username",
    "profiles.display_name as display_name",
    "release_groups.img_url as avatar_url",
    "release_groups.last_fm_img_url as avatar_last_fm_img_url",
    "release_groups.release_group_name as avatar_release_group_name",
    "artists.artist_name as avatar_artist_name"
  ]).orderBy("profiles.updated_at desc").execute();
  const users = await selectUsers;
  return users;
};
const selectSessionProfile = async function(sessionUserId) {
  const selectProfile = await db.selectFrom("profiles").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
    "profiles.id as id",
    "profiles.username as username",
    "profiles.display_name as display_name",
    "profiles.about as about",
    "profiles.website as website",
    "profiles.top_albums_collection_id as top_albums_collection_id",
    "release_groups.last_fm_img_url as avatar_last_fm_img_url",
    "profiles.avatar_mbid as avatar_mbid",
    "release_groups.img_url as avatar_url",
    "release_groups.last_fm_img_url as avatar_last_fm_img_url",
    "artists.artist_name as avatar_artist_name",
    "artists.artist_mbid as avatar_artist_mbid",
    "release_groups.release_group_name as avatar_release_group_name",
    "release_groups.release_group_mbid as avatar_release_group_mbid"
  ]).where("id", "=", sessionUserId).executeTakeFirst();
  const profile = await selectProfile;
  return profile;
};
const newSessionProfile = async function(sessionUserId, profileData, email, avatarItem) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const hasAvatar = profileData.avatar_url ? true : false;
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  if (hasAvatar) {
    const preparedMetadata = prepareAvatarMetadataInsert(avatarItem);
    artistsMetadata = preparedMetadata.artistsMetadata;
    releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata;
  }
  const update = await db.transaction().execute(async (trx) => {
    try {
      const username = profileData?.username;
      await trx.selectFrom("profiles").select(["username", "id"]).where("username", "ilike", username).where("id", "!=", sessionUserId).executeTakeFirstOrThrow();
      return { success: false };
    } catch (error) {
      await trx.updateTable("approved_users").set({
        user_id: sessionUserId
      }).where("email", "ilike", email).executeTakeFirst();
      if (hasAvatar) {
        await trx.insertInto("artists").values(artistsMetadata).onConflict(
          (oc) => oc.doNothing()
        ).returningAll().execute();
        await trx.insertInto("release_groups").values(releaseGroupsMetadata).onConflict(
          (oc) => oc.doNothing()
        ).returningAll().execute();
      }
      const selectChangelog = await trx.selectFrom("profiles").select(["id", "changelog"]).where("id", "=", sessionUserId).executeTakeFirst();
      const changelog = selectChangelog?.changelog;
      changelog[timestampISOString] = {
        "username": profileData?.username,
        "display_name": profileData?.display_name,
        "website": profileData?.website,
        "avatar_mbid": profileData?.avatar_mbid,
        "avatar_url": profileData?.avatar_url,
        "about": profileData?.about
      };
      if (hasAvatar) {
        await trx.updateTable("profiles").set({
          username: profileData?.username,
          display_name: profileData?.display_name,
          website: profileData?.website,
          avatar_mbid: profileData?.avatar_mbid,
          avatar_url: profileData?.avatar_url,
          updated_at: timestampISO,
          about: profileData?.about,
          changelog
        }).where("id", "=", sessionUserId).returning([
          "id",
          "username",
          "display_name",
          "website",
          "avatar_mbid",
          "avatar_url",
          "about",
          "updated_at"
        ]).executeTakeFirst();
        return { success: true };
      } else {
        await trx.updateTable("profiles").set({
          username: profileData?.username,
          display_name: profileData?.display_name,
          website: profileData?.website,
          updated_at: timestampISO,
          about: profileData?.about,
          changelog
        }).where("id", "=", sessionUserId).returning([
          "id",
          "username",
          "display_name",
          "website",
          "avatar_mbid",
          "avatar_url",
          "about",
          "updated_at"
        ]).executeTakeFirst();
        return { success: true };
      }
    }
  });
  return update;
};
const updateSessionProfile = async function(sessionUserId, profileData, avatarItem) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const hasAvatar = avatarItem && Object.keys(avatarItem).length > 0 ? true : false;
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  if (hasAvatar) {
    const preparedMetadata = prepareAvatarMetadataInsert(avatarItem);
    artistsMetadata = preparedMetadata.artistsMetadata;
    releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata;
  }
  const update = await db.transaction().execute(async (trx) => {
    if (hasAvatar) {
      await trx.insertInto("artists").values(artistsMetadata).onConflict(
        (oc) => oc.doNothing()
      ).returningAll().execute();
      await trx.insertInto("release_groups").values(releaseGroupsMetadata).onConflict(
        (oc) => oc.doNothing()
      ).returningAll().execute();
    }
    const selectChangelog = await trx.selectFrom("profiles").select("changelog").where("id", "=", sessionUserId).executeTakeFirst();
    const changelog = selectChangelog?.changelog;
    changelog[timestampISOString] = {
      "username": profileData?.username,
      "display_name": profileData?.display_name,
      "website": profileData?.website,
      "avatar_mbid": profileData?.avatar_mbid,
      "avatar_url": profileData?.avatar_url,
      "about": profileData?.about
    };
    const updateProfile = await trx.updateTable("profiles").set({
      display_name: profileData?.display_name,
      website: profileData?.website,
      avatar_mbid: profileData?.avatar_mbid,
      avatar_url: profileData?.avatar_url,
      updated_at: timestampISO,
      about: profileData?.about,
      changelog
    }).where("id", "=", sessionUserId).returning([
      "id",
      "username",
      "display_name",
      "website",
      "avatar_mbid",
      "avatar_url",
      "about",
      "updated_at"
    ]).executeTakeFirst();
    return updateProfile;
  });
  return update;
};
const updateUsername = async function(sessionUserId, newUsername) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const updateUsername2 = await db.transaction().execute(async (trx) => {
    try {
      await trx.selectFrom("profiles").select(["display_name", "username", "id"]).where("username", "ilike", newUsername).where("id", "!=", sessionUserId).executeTakeFirstOrThrow();
      return { update: null, success: false };
    } catch (error) {
      const profileData = await trx.selectFrom("profiles").selectAll().where("id", "=", sessionUserId).executeTakeFirst();
      const changelog = profileData?.changelog;
      changelog[timestampISOString] = {
        display_name: profileData?.display_name,
        username: newUsername,
        website: profileData?.website,
        avatar_mbid: profileData?.avatar_mbid,
        avatar_url: profileData?.avatar_url,
        about: profileData?.about
      };
      const updateUsername3 = await trx.updateTable("profiles").set({
        username: newUsername,
        changelog
      }).where("id", "=", sessionUserId).returning(["display_name", "username", "id", "avatar_url"]).executeTakeFirst();
      const update = await updateUsername3;
      return { update, success: true };
    }
  });
  return updateUsername2;
};
const insertUpdateBlock = async function(sessionUserId, profileUserId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const userBlock = await db.transaction().execute(async (trx) => {
    try {
      const selectBlock = await trx.selectFrom("user_moderation_actions").select(["id", "active", "changelog"]).where(({ eb }) => eb.and({
        user_id: sessionUserId,
        target_user_id: profileUserId,
        type: "block"
      })).executeTakeFirstOrThrow();
      const block = await selectBlock;
      const id = block?.id;
      const active = block?.active;
      const changelog = block?.changelog;
      changelog[timestampISOString] = {
        "active": !active
      };
      const updateBlock = await trx.updateTable("user_moderation_actions").set({
        active: !active,
        updated_at: timestampISO,
        changelog
      }).where("id", "=", id).returning(["type", "active", "id"]).executeTakeFirst();
      return updateBlock;
    } catch (error) {
      const changelog = {};
      changelog[timestampISOString] = {
        active: true
      };
      const insertBlock = await trx.insertInto("user_moderation_actions").values({
        user_id: sessionUserId,
        target_user_id: profileUserId,
        updated_at: timestampISO,
        type: "block",
        active: true,
        changelog
      }).returning(["type", "active", "id"]).executeTakeFirst();
      return insertBlock;
    }
  });
  return userBlock;
};
const insertPostFlag = async function(sessionUserId, postId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const changelog = {};
  changelog[timestampISOString] = {
    "user_id": sessionUserId,
    "target_post_id": postId,
    "type": "flag",
    "active": true
  };
  const insertFlag = await db.insertInto("user_moderation_actions").values({
    user_id: sessionUserId,
    target_post_id: postId,
    type: "flag",
    updated_at: timestampISO,
    active: true,
    changelog
  }).executeTakeFirst();
  const flag = await insertFlag;
  const success = flag ? true : false;
  return success;
};
const insertUserFlag = async function(sessionUserId, profileUserId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const changelog = {};
  changelog[timestampISOString] = {
    user_id: sessionUserId,
    target_user_id: profileUserId,
    type: "flag",
    active: true
  };
  const insertFlag = await db.insertInto("user_moderation_actions").values({
    user_id: sessionUserId,
    target_user_id: profileUserId,
    type: "flag",
    active: true,
    updated_at: timestampISO,
    changelog
  }).returning([
    "user_id",
    "target_user_id",
    "type",
    "active"
  ]).executeTakeFirst();
  const flag = await insertFlag;
  return flag;
};
const insertUpdateUserFollow = async function(sessionUserId, profileUserId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const follow = await db.transaction().execute(async (trx) => {
    try {
      const selectUserFollow = await trx.selectFrom("social_graph").select(["id", "follows_now", "changelog"]).where(({ eb }) => eb.and({
        user_id: sessionUserId,
        target_user_id: profileUserId
      })).executeTakeFirstOrThrow();
      const userFollow = await selectUserFollow;
      const id = userFollow?.id;
      const followsNow = userFollow?.follows_now;
      const changelog = userFollow?.changelog;
      changelog[timestampISOString] = {
        "follows_now": !followsNow
      };
      const updateCollectionFollow = await trx.updateTable("social_graph").set({
        follows_now: !followsNow,
        updated_at: timestampISO,
        changelog
      }).where("id", "=", id).returning(["follows_now", "id"]).executeTakeFirst();
      return updateCollectionFollow;
    } catch (error) {
      const changelog = {};
      changelog[timestampISOString] = {
        follows_now: true
      };
      const insertUserFollow = await trx.insertInto("social_graph").values({
        user_id: sessionUserId,
        target_user_id: profileUserId,
        updated_at: timestampISO,
        follows_now: true,
        changelog
      }).returning(["follows_now", "id"]).executeTakeFirst();
      return insertUserFollow;
    }
  });
  return follow;
};
const insertUpdateCollectionFollow = async function(sessionUserId, collectionId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const follow = await db.transaction().execute(async (trx) => {
    try {
      const selectCollectionFollow = await trx.selectFrom("collections_social").selectAll().where(({ eb }) => eb.and({
        user_id: sessionUserId,
        collection_id: collectionId
      })).executeTakeFirstOrThrow();
      const collectionFollow = await selectCollectionFollow;
      const id = collectionFollow?.id;
      const followsNow = collectionFollow?.follows_now;
      const userRole = collectionFollow?.user_role;
      const changelog = collectionFollow?.changelog;
      changelog[timestampISOString] = {
        follows_now: !followsNow,
        user_role: userRole
      };
      const updateCollectionFollow = await trx.updateTable("collections_social").set({
        follows_now: !followsNow,
        updated_at: timestampISO,
        changelog
      }).where("id", "=", id).returning(["follows_now", "id"]).executeTakeFirst();
      return updateCollectionFollow;
    } catch (error) {
      const changelog = {};
      changelog[timestampISOString] = {
        follows_now: true,
        user_role: "follower"
      };
      const insertCollectionFollow = await trx.insertInto("collections_social").values({
        user_id: sessionUserId,
        collection_id: collectionId,
        updated_at: timestampISO,
        follows_now: true,
        changelog
      }).returning(["follows_now", "id"]).executeTakeFirst();
      return insertCollectionFollow;
    }
  });
  return follow;
};
const selectListUserFollowing = async function(sessionUserId, username) {
  const selectUserList = await db.transaction().execute(async (trx) => {
    const userProfile = await trx.selectFrom("profiles").select(["id", "display_name"]).where("username", "=", username).executeTakeFirst();
    const profileUserId = userProfile?.id;
    const profileDisplayName2 = userProfile?.display_name;
    try {
      const blockInfo = await trx.selectFrom("user_moderation_actions").select(["id", "type", "active"]).where(({ eb, and }) => and([
        eb("user_id", "=", profileUserId),
        eb("target_user_id", "=", sessionUserId),
        eb("type", "=", "block"),
        eb("active", "=", true)
      ])).executeTakeFirstOrThrow();
      if (blockInfo) {
        return { permission: false, profiles: null, profileDisplayName: null };
      }
    } catch (error) {
      const selectProfiles = await trx.selectFrom("profiles").innerJoin("social_graph as following", "following.target_user_id", "profiles.id").select([
        "profiles.id as user_id",
        "profiles.username as username",
        "profiles.display_name as display_name",
        "profiles.avatar_url as avatar_url"
      ]).where(({ eb, and }) => and([
        eb("following.user_id", "=", profileUserId),
        eb("following.follows_now", "=", true)
      ])).execute();
      const profiles2 = selectProfiles;
      return { permission: true, profiles: profiles2, profileDisplayName: profileDisplayName2 };
    }
  });
  const { permission, profiles, profileDisplayName } = selectUserList;
  return { permission, profiles, profileDisplayName };
};
export {
  updateUsername as a,
  selectProfilePageData as b,
  checkLoginPermission as c,
  insertUpdateUserFollow as d,
  insertUserFlag as e,
  insertUpdateBlock as f,
  selectListUserFollowing as g,
  insertUpdateCollectionFollow as h,
  insertPostFlag as i,
  selectAllUsers as j,
  newSessionProfile as n,
  selectSessionProfile as s,
  updateSessionProfile as u
};

import { d as db } from "./database.js";
import { parseISO } from "date-fns";
const selectProfilePageData = async function(sessionUserId, profileUsername) {
  const selectProfileData = await db.transaction().execute(async (trx) => {
    const profileUserData = await trx.selectFrom("profiles").select([
      "id",
      "username",
      "display_name",
      "avatar_url",
      "website",
      "about",
      "top_albums_collection_id"
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
    const collectionCount = await trx.selectFrom("collections_social").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb, and, or }) => and([
      eb("user_id", "=", profileUserId),
      or([
        eb("user_role", "=", "owner"),
        eb("user_role", "=", "collaborator")
      ])
    ])).execute();
    const collectionFollowingCount = await trx.selectFrom("collections_social").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb }) => eb.and({
      user_role: "follower",
      follows_now: true,
      user_id: profileUserId
    })).execute();
    const userFollowingCount = await trx.selectFrom("social_graph").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb }) => eb.and({
      user_id: profileUserId,
      follows_now: true
    })).execute();
    const nowPlayingPostsCount = await trx.selectFrom("posts").select(
      (eb) => eb.fn.count("id").as("count")
    ).where(({ eb, and }) => and([
      eb("user_id", "=", profileUserId),
      eb("type", "=", "now_playing"),
      eb("status", "!=", "deleted")
    ])).execute();
    const topAlbumsCollection = await trx.selectFrom("collections_contents").innerJoin("artists", "artists.artist_mbid", "collections_contents.artist_mbid").innerJoin("release_groups", "release_groups.release_group_mbid", "collections_contents.release_group_mbid").select([
      "collections_contents.collection_id as collection_id",
      "collections_contents.artist_mbid as artist_mbid",
      "collections_contents.release_group_mbid as release_group_mbid",
      "item_position",
      "artists.artist_name as artist_name",
      "release_groups.release_group_name as release_group_name",
      "release_groups.img_url as img_url"
    ]).where("collection_id", "=", profileUserData?.top_albums_collection_id).execute();
    return { profileUserData, profileUserBlockInfo, profileUserFlagInfo, collectionCount, collectionFollowingCount, userFollowingCount, nowPlayingPostsCount, topAlbumsCollection, followInfo, permission: true };
  });
  const profile = await selectProfileData;
  return profile;
};
const selectAllUsers = async function(sessionUserId) {
  const selectUsers = await db.selectFrom("profiles").select(["id", "username", "display_name", "avatar_url"]).execute();
  const users = await selectUsers;
  return users;
};
const selectSessionProfile = async function(sessionUserId) {
  const selectProfile = await db.selectFrom("profiles").selectAll().where("id", "=", sessionUserId).executeTakeFirst();
  const profile = await selectProfile;
  return profile;
};
const newSessionProfile = async function(sessionUserId, profileData) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const update = await db.transaction().execute(async (trx) => {
    try {
      const username = profileData?.username;
      await trx.selectFrom("profiles").select(["username", "id"]).where("username", "=", username).where("id", "!=", sessionUserId).executeTakeFirstOrThrow();
      return { success: false };
    } catch (error) {
      const selectChangelog = await trx.selectFrom("profiles").select("changelog").where("id", "=", sessionUserId).executeTakeFirst();
      const changelog = selectChangelog;
      changelog[timestampISOString] = {
        "username": profileData?.username,
        "display_name": profileData?.displayName,
        "website": profileData?.website,
        "avatar_mbid": profileData?.avatarMbid,
        "avatar_url": profileData?.avatarUrl,
        "about": profileData?.about
      };
      await trx.updateTable("profiles").set({
        display_name: profileData?.displayName,
        website: profileData?.website,
        avatar_mbid: profileData?.avatarMbid,
        avatar_url: profileData?.avatarUrl,
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
  });
  return update;
};
const updateSessionProfile = async function(sessionUserId, profileData) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const update = await db.transaction().execute(async (trx) => {
    const selectChangelog = await trx.selectFrom("profiles").select("changelog").where("id", "=", sessionUserId).executeTakeFirst();
    const changelog = selectChangelog;
    changelog[timestampISOString] = {
      "username": profileData?.username,
      "display_name": profileData?.displayName,
      "website": profileData?.website,
      "avatar_mbid": profileData?.avatar_mbid,
      "avatar_url": profileData?.avatar_url,
      "about": profileData?.about
    };
    const updateProfile = await trx.updateTable("profiles").set({
      display_name: profileData?.displayName,
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
  parseISO(timestampISOString);
  const updateUsername2 = await db.transaction().execute(async (trx) => {
    try {
      await trx.selectFrom("profiles").select(["display_name", "username", "id"]).where("username", "=", newUsername).where("id", "!=", sessionUserId).executeTakeFirstOrThrow();
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
  return flag;
};
const insertUserFlag = async function(sessionUserId, profileUserId) {
  console.log(sessionUserId, profileUserId);
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
  console.log(flag);
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
  insertUserFlag as c,
  insertUpdateUserFollow as d,
  selectListUserFollowing as e,
  insertUpdateCollectionFollow as f,
  insertPostFlag as g,
  selectAllUsers as h,
  insertUpdateBlock as i,
  newSessionProfile as n,
  selectSessionProfile as s,
  updateSessionProfile as u
};

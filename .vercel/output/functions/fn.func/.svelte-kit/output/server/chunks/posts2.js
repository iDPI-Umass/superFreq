import { sql } from "kysely";
import { d as db } from "./database.js";
import { parseISO } from "date-fns";
import "./parseData.js";
const insertPost = async function(postData) {
  const insertPost2 = await db.insertInto("posts").values(postData).returning("created_at").executeTakeFirst();
  const post = await insertPost2;
  return post;
};
const updatePost = async function(sessionUserId, postData, editedText) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const updatePost2 = await db.transaction().execute(async (trx) => {
    const selectPostData = await trx.selectFrom("posts").select(["user_id", "changelog"]).where("id", "=", postData.id).where("user_id", "=", sessionUserId).executeTakeFirstOrThrow();
    const changelog = selectPostData?.changelog;
    changelog[timestampISOString] = {
      text: editedText,
      mbid: postData.mbid,
      artist_name: postData.artistName,
      release_group_name: postData.releaseGroupName,
      recording_name: postData.recordingName,
      status: "edited",
      listen_url: postData.listenUrl,
      episode_title: postData.episodeTitle,
      show_title: postData.showTitle
    };
    const update = await trx.updateTable("posts").set({
      text: editedText,
      mbid: postData.mbid,
      artist_name: postData.artistName,
      release_group_name: postData.releaseGroupName,
      recording_name: postData.recordingName,
      status: "edited",
      updated_at: timestampISO,
      listen_url: postData.listenUrl,
      episode_title: postData.episodeTitle,
      show_title: postData.showTitle,
      changelog
    }).where("id", "=", postData.id).returning([
      "text",
      "mbid",
      "artist_name",
      "release_group_name",
      "recording_name",
      "episode_title",
      "show_title",
      "listen_url"
    ]).executeTakeFirstOrThrow();
    const post = await update;
    return post;
  });
  return updatePost2;
};
const deletePost = async function(sessionUserId, postId) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const deletePost2 = await db.transaction().execute(async (trx) => {
    const post = await trx.selectFrom("posts").selectAll().where("id", "=", postId).where("user_id", "=", sessionUserId).executeTakeFirstOrThrow();
    const changelog = post?.changelog;
    changelog[timestampISOString] = {
      text: post?.text,
      mbid: post?.mbid,
      item_type: post?.item_type,
      artist_name: post?.artist_name,
      release_group_name: post?.release_group_name,
      recording_name: post?.recording_name,
      status: "deleted",
      listen_url: post?.listen_url,
      episode_title: post?.episode_title,
      show_title: post?.show_title
    };
    const updatePost2 = await trx.updateTable("posts").set({
      status: "deleted",
      updated_at: timestampISO,
      changelog
    }).where("id", "=", postId).returning(["id", "status"]).executeTakeFirst();
    const update = await updatePost2;
    return update;
  });
  return deletePost2;
};
const selectPostAndReplies = async function(sessionUserId, username, timestampString, postType) {
  const select = await db.transaction().execute(async (trx) => {
    console.log(username);
    try {
      const selectPostUserId = await trx.selectFrom("profiles").select("id").where("username", "=", username).executeTakeFirst();
      const postUserId = selectPostUserId?.id;
      await trx.selectFrom("user_moderation_actions").select(["id"]).where(({ eb }) => eb.and({
        user_id: postUserId,
        target_user_id: sessionUserId,
        type: "block",
        active: true
      })).executeTakeFirstOrThrow();
      return { post: null, replies: null, permission: false, postReactionActive: null, reactionCount: null };
    } catch (error) {
      const post2 = await trx.selectFrom("posts").innerJoin("profiles as profile", "profile.id", "posts.user_id").select([
        "posts.id as id",
        "posts.text as text",
        "posts.user_id as user_id",
        "posts.type as type",
        "posts.mbid as mbid",
        "posts.artist_name as artist_name",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.item_type as item_type",
        "posts.status as status",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.listen_url as listen_url",
        "posts.embed_id as embed_id",
        "posts.embed_source as embed_source",
        "posts.embed_account as embed_account",
        "profile.username as username",
        "profile.display_name as display_name",
        "profile.avatar_url as avatar_url"
      ]).where(({ eb, and }) => and([
        eb(
          "posts.user_id",
          "=",
          eb.selectFrom("profiles").select("id").where("username", "=", username).limit(1)
        ),
        eb("posts.type", "=", postType),
        eb("posts.created_at", "=", parseISO(timestampString))
      ])).executeTakeFirst();
      const postId = post2?.id;
      const postReactionActive = await trx.selectFrom("post_reactions").select("active").where("post_id", "=", postId).where("user_id", "=", sessionUserId).executeTakeFirst();
      const postReactionsCount = await trx.selectFrom("post_reactions").select((eb) => eb.fn.count("id").as("reaction_count")).where(({ eb }) => eb.and({
        post_id: postId,
        active: true
      })).execute();
      const replies = await trx.selectFrom("posts as comments").innerJoin("profiles as commenter", "commenter.id", "comments.user_id").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").innerJoin("profiles as original_poster", "original_post.user_id", "original_poster.id").select([
        "comments.id as id",
        "comments.text as text",
        "comments.user_id as user_id",
        "comments.status as status",
        "comments.created_at as created_at",
        "comments.parent_post_id as parent_post_id",
        "commenter.username as username",
        "commenter.display_name as display_name",
        "commenter.avatar_url as avatar_url",
        "original_post.created_at as original_post_date",
        "original_post.user_id as original_poster_user_id",
        "original_poster.username as original_poster_username"
        // 'reactions.reaction_count as reaction_count'
      ]).where(({ eb, and, not, exists, selectFrom }) => and([
        eb("comments.parent_post_id", "=", postId),
        eb("comments.status", "!=", "deleted"),
        not(
          exists(
            selectFrom("user_moderation_actions").select("id").whereRef("user_moderation_actions.user_id", "=", "comments.user_id").where("user_moderation_actions.target_user_id", "=", sessionUserId)
          )
        )
      ])).orderBy("id", "asc").execute();
      const reactionCount = postReactionsCount[0].reaction_count;
      return { post: post2, postReactionActive, reactionCount, replies, permission: true };
    }
  });
  const post = await select;
  return post;
};
const selectRandomPosts = async function(postCount) {
  const selectPosts = await db.selectFrom("posts").select(["text", "artist_name", "release_group_name", "recording_name", "item_type", "created_at"]).where("status", "!=", "deleted").where("parent_post_id", "is", null).orderBy(sql`random()`).limit(postCount).execute();
  return selectPosts;
};
const selectUserPosts = async function(sessionUserId, username) {
  const selectPosts = await db.transaction().execute(async (trx) => {
    const userProfile = await trx.selectFrom("profiles").select("id").where("username", "=", username).executeTakeFirst();
    const profileUserId = userProfile?.id;
    try {
      const blockInfo = await trx.selectFrom("user_moderation_actions").select(["id", "type", "active"]).where(({ eb, and }) => and([
        eb("user_id", "=", profileUserId),
        eb("target_user_id", "=", sessionUserId),
        eb("type", "=", "block"),
        eb("active", "=", true)
      ])).executeTakeFirstOrThrow();
      if (blockInfo) {
        return { permission: false, posts: null };
      }
    } catch (error) {
      const selectPosts2 = await trx.selectFrom("posts").innerJoin("profiles", "profiles.id", "posts.user_id").select([
        "posts.id as id",
        "posts.text as text",
        "posts.mbid as mbid",
        "posts.artist_name as artist_name",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.listen_url as listen_url",
        "profiles.id as user_id",
        "profiles.username as username",
        "profiles.display_name as display_name",
        "profiles.avatar_url as avatar_url"
      ]).where("profiles.id", "=", profileUserId).orderBy("posts.created_at desc").execute();
      const posts2 = selectPosts2;
      return { permission: true, posts: posts2 };
    }
  });
  const posts = await selectPosts;
  return posts;
};
const selectUserPostsSample = async function(sessionUserId, username, batchSize) {
  const selectPosts = await db.transaction().execute(async (trx) => {
    const userProfile = await trx.selectFrom("profiles").select("id").where("username", "=", username).executeTakeFirst();
    const profileUserId = userProfile?.id;
    try {
      const blockInfo = await trx.selectFrom("user_moderation_actions").select(["id", "type", "active"]).where(({ eb, and }) => and([
        eb("user_id", "=", profileUserId),
        eb("target_user_id", "=", sessionUserId),
        eb("type", "=", "block"),
        eb("active", "=", true)
      ])).executeTakeFirstOrThrow();
      if (blockInfo) {
        return { posts: null };
      }
    } catch (error) {
      const selectPosts2 = await trx.selectFrom("posts").innerJoin("profiles", "profiles.id", "posts.user_id").select([
        "posts.id as id",
        "posts.text as text",
        "posts.mbid as mbid",
        "posts.artist_name as artist_name",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.listen_url as listen_url",
        "profiles.id as user_id",
        "profiles.username as username",
        "profiles.display_name as display_name",
        "profiles.avatar_url as avatar_url"
      ]).where("profiles.id", "=", profileUserId).orderBy("posts.created_at desc").limit(batchSize).execute();
      const posts2 = selectPosts2;
      return { posts: posts2 };
    }
  });
  const posts = await selectPosts;
  return posts;
};
const insertUpdateReaction = async function(sessionUserId, postId, reactionType) {
  const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
  const timestampISO = parseISO(timestampISOString);
  const insertUpdateReaction2 = await db.transaction().execute(async (trx) => {
    try {
      const selectReaction = await trx.selectFrom("post_reactions").select(["id", "active", "changelog"]).where(({ eb }) => eb.and({
        post_id: postId,
        user_id: sessionUserId,
        reaction: reactionType
      })).executeTakeFirstOrThrow();
      const changelog = selectReaction?.changelog;
      const active = selectReaction?.active;
      changelog[timestampISOString] = {
        active: !active
      };
      return await trx.updateTable("post_reactions").set({
        active: !active,
        updated_at: timestampISO,
        changelog
      }).where("id", "=", postId).returning(["id", "reaction", "active"]).executeTakeFirst();
    } catch (error) {
      const changelog = {};
      changelog[timestampISOString] = {
        active: true
      };
      return await trx.insertInto("post_reactions").values({
        post_id: postId,
        user_id: sessionUserId,
        reaction: reactionType,
        updated_at: timestampISO,
        active: true,
        changelog
      }).returning(["id", "reaction", "active"]).executeTakeFirst();
    }
  });
  const reaction = await insertUpdateReaction2;
  return reaction;
};
export {
  selectUserPosts as a,
  selectRandomPosts as b,
  selectPostAndReplies as c,
  deletePost as d,
  insertUpdateReaction as e,
  insertPost as i,
  selectUserPostsSample as s,
  updatePost as u
};

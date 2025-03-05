import { sql } from "kysely";
import { d as db } from "./database.js";
import { parseISO } from "date-fns";
import { a as prepareMusicMetadataInsert } from "./parseData.js";
const insertPost = async function(postData) {
  let artistsMetadata = [];
  let releaseGroupsMetadata = [];
  let recordingsMetadata = [];
  const itemType = postData["item_type"];
  let metadata = [];
  if (itemType == "artist" && postData["artist_mbid"] || itemType == "release_group" && postData["release_group_mbid"] || itemType == "recording" && postData["recording_mbid"]) {
    metadata = [{
      "artist_mbid": postData["artist_mbid"],
      "artist_name": postData["artist_name"],
      "release_group_mbid": postData["release_group_mbid"],
      "release_group_name": postData["release_group_name"],
      "release_date": postData["release_date"],
      "label": postData["label_name"],
      "img_url": postData["img_url"],
      "last_fm_img_url": postData["last_fm_img_url"],
      "recording_mbid": postData["recording_mbid"],
      "recording_name": postData["recording_name"],
      "remixer_artist_mbid": postData["remixer_artist_mbid"],
      "item_type": postData["item_type"]
    }];
    const preparedMetadata = await prepareMusicMetadataInsert(metadata);
    artistsMetadata = preparedMetadata.artistsMetadata;
    releaseGroupsMetadata = preparedMetadata.releaseGroupsMetadata;
    recordingsMetadata = preparedMetadata.recordingsMetadata;
  } else {
    metadata = [{
      "artist_name": postData["artist_name"],
      "artist_mbid": postData["artist_mbid"],
      "release_group_name": postData["release_group_name"],
      "release_group_mbid": postData["release_group_mbid"],
      "recording_name": postData["recording_name"],
      "episode_title": postData["episode_title"],
      "show_title": postData["show_title"],
      "listen_url": postData["listen_url"],
      "added_by": postData["user_id"]
    }];
  }
  delete postData.label;
  delete postData.release_date;
  delete postData.remixer_artist_mbid;
  delete postData.img_url;
  delete postData.last_fm_img_url;
  const post = await db.transaction().execute(async (trx) => {
    if (postData["artist_mbid"]) {
      await trx.insertInto("artists").values(artistsMetadata).onConflict(
        (oc) => oc.doNothing()
      ).execute();
    }
    if (postData["release_group_mbid"]) {
      await trx.insertInto("release_groups").values(releaseGroupsMetadata).onConflict(
        (oc) => oc.doNothing()
      ).returningAll().execute();
    }
    if (postData["recording_mbid"]) {
      await trx.insertInto("recordings").values(recordingsMetadata).onConflict(
        (oc) => oc.doNothing()
      ).execute();
    }
    let userAdddedMetadataRow = {};
    if (!postData["artist_mbid"]) {
      userAdddedMetadataRow = await trx.insertInto("user_added_metadata").values(metadata).returning("id").executeTakeFirst();
      postData["user_added_metadata_id"] = userAdddedMetadataRow.id;
    }
    const insertPost3 = await trx.insertInto("posts").values(postData).returning("created_at").executeTakeFirst();
    const selectProfile2 = await trx.selectFrom("profiles").select("username").where("id", "=", postData.user_id).executeTakeFirst();
    return { insertPost: insertPost3, selectProfile: selectProfile2 };
  });
  const { insertPost: insertPost2, selectProfile } = await post;
  const createdAt = insertPost2?.created_at;
  const username = selectProfile?.username;
  return { createdAt, username };
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
    }).where("id", "=", postId).returning(["id", "status", "parent_post_id"]).executeTakeFirst();
    const update = await updatePost2;
    return update;
  });
  return deletePost2;
};
const selectPostAndReplies = async function(sessionUserId, username, timestampString, postType) {
  const select = await db.transaction().execute(async (trx) => {
    try {
      const selectPostUserId = await trx.selectFrom("profiles").select("id").where("username", "=", username).executeTakeFirst();
      const postUserId = selectPostUserId?.id;
      await trx.selectFrom("user_moderation_actions").select(["id"]).where(({ eb }) => eb.and({
        user_id: postUserId,
        target_user_id: sessionUserId,
        type: "block",
        active: true
      })).executeTakeFirstOrThrow();
      return { post: null, replies: null, permission: false };
    } catch (error) {
      const post2 = await trx.selectFrom("posts").innerJoin("profiles as profile", "profile.id", "posts.user_id").leftJoin("release_groups as avatar_release_group", "avatar_release_group.release_group_mbid", "profile.avatar_mbid").leftJoin("artists as avatar_artist", "avatar_artist.artist_mbid", "avatar_release_group.artist_mbid").leftJoin(
        "post_reactions as reaction",
        (join) => join.onRef("reaction.post_id", "=", "posts.id").on("reaction.active", "=", true).on("reaction.user_id", "=", sessionUserId)
      ).leftJoin(
        "post_reactions as all_reactions",
        (join) => join.onRef("all_reactions.post_id", "=", "posts.id").on("all_reactions.active", "=", true)
      ).select([
        "posts.id as id",
        "posts.text as text",
        "posts.user_id as user_id",
        "posts.type as type",
        "posts.artist_mbid as artist_mbid",
        "posts.release_group_mbid as release_group_mbid",
        "posts.recording_mbid as recording_mbid",
        "posts.artist_name as artist_name",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.status as status",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.listen_url as listen_url",
        "posts.embed_id as embed_id",
        "posts.embed_source as embed_source",
        "posts.embed_account as embed_account",
        "posts.item_type as item_type",
        "posts.user_added_metadata_id as user_added_metadata_id",
        "profile.username as username",
        "profile.display_name as display_name",
        "avatar_release_group.img_url as avatar_url",
        "avatar_release_group.last_fm_img_url as avatar_last_fm_img_url",
        "avatar_release_group.release_group_name as avatar_release_group_name",
        "avatar_artist.artist_name as avatar_artist_name",
        "reaction.active as reaction_active",
        (eb) => eb.fn.count("all_reactions.id").as("reaction_count")
      ]).where(({ eb, and }) => and([
        eb(
          "posts.user_id",
          "=",
          eb.selectFrom("profiles").select("id").where("username", "=", username).limit(1)
        ),
        eb("posts.type", "=", postType),
        eb("posts.created_at", "=", parseISO(timestampString))
      ])).groupBy([
        "posts.id",
        "profile.username",
        "profile.display_name",
        "profile.avatar_url",
        "avatar_release_group.img_url",
        "avatar_release_group.last_fm_img_url",
        "avatar_artist.artist_name",
        "avatar_release_group.release_group_name",
        "avatar_release_group.img_url",
        "reaction.active"
      ]).executeTakeFirst();
      const postId = post2?.id;
      const replies = await trx.selectFrom("posts as comments").innerJoin("profiles as commenter", "commenter.id", "comments.user_id").leftJoin("release_groups", "release_groups.release_group_mbid", "commenter.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").innerJoin("profiles as original_poster", "original_post.user_id", "original_poster.id").select([
        "comments.id as id",
        "comments.text as text",
        "comments.user_id as user_id",
        "comments.status as status",
        "comments.created_at as created_at",
        "comments.parent_post_id as parent_post_id",
        "commenter.username as username",
        "commenter.display_name as display_name",
        "release_groups.img_url as avatar_url",
        "release_groups.last_fm_img_url as avatar_last_fm_url",
        "release_groups.release_group_name as avatar_release_group_name",
        "artists.artist_name as avatar_artist_name",
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
      return { post: post2, replies, permission: true };
    }
  });
  const post = await select;
  return post;
};
const selectRandomPosts = async function(postCount) {
  const selectPosts = await db.transaction().execute(async (trx) => {
    const posts2 = await trx.selectFrom("posts").select([
      "text",
      "artist_name",
      "release_group_name",
      "recording_name",
      "episode_title",
      "embed_id",
      "embed_source",
      "show_title",
      "item_type",
      "created_at"
    ]).where("status", "!=", "deleted").where("parent_post_id", "is", null).orderBy(sql`random()`).limit(postCount).execute();
    const randomAvatarImages2 = await trx.selectFrom("release_groups").innerJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
      "release_groups.img_url as avatar_url",
      "release_groups.last_fm_img_url as avatar_last_fm_img_url",
      "release_groups.release_group_mbid as release_group_mbid",
      "release_groups.release_group_name as avatar_release_group_name",
      "artists.artist_name as avatar_artist_name"
    ]).orderBy(sql`random()`).limit(postCount).execute();
    return { posts: posts2, randomAvatarImages: randomAvatarImages2 };
  });
  const { posts, randomAvatarImages } = await selectPosts;
  for (const post of posts) {
    const index = posts.indexOf(post);
    const image = {
      "avatar_img_url": randomAvatarImages[index]["avatar_url"],
      "avatar_last_fm_img_url": randomAvatarImages[index]["avatar_last_fm_img_url"],
      "avatar_artist_name": randomAvatarImages[index]["avatar_artist_name"],
      "avatar_release_group_name": randomAvatarImages[index]["avatar_release_group_name"]
    };
    Object.assign(post, image);
  }
  return posts;
};
const selectUserNowPlayingPosts = async function(sessionUserId, username) {
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
        return { permission: false, posts: null, comments: null };
      }
    } catch (error) {
      const selectPosts2 = await trx.selectFrom("posts").innerJoin("profiles", "profiles.id", "posts.user_id").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").leftJoin(
        "post_reactions as reaction",
        (join) => join.onRef("reaction.post_id", "=", "posts.id").on("reaction.active", "=", true).on("reaction.user_id", "=", sessionUserId)
      ).select([
        "posts.id as id",
        "posts.text as text",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.type as type",
        "posts.status as status",
        "posts.artist_name as artist_name",
        "posts.artist_mbid",
        "posts.release_group_mbid",
        "posts.recording_mbid",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.listen_url as listen_url",
        "posts.embed_id as embed_id",
        "posts.embed_source as embed_source",
        "posts.embed_account as embed_account",
        "posts.item_type as item_type",
        "posts.user_added_metadata_id as user_added_metadata_id",
        "profiles.id as user_id",
        "profiles.username as username",
        "profiles.display_name as display_name",
        "release_groups.img_url as avatar_url",
        "release_groups.last_fm_img_url as avatar_last_fm_img_url",
        "release_groups.release_group_name as avatar_release_group_name",
        "artists.artist_name as avatar_artist_name",
        "reaction.active as reaction_active"
      ]).where("profiles.id", "=", profileUserId).where("posts.parent_post_id", "is", null).where("posts.status", "!=", "deleted").orderBy("posts.created_at desc").execute();
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
      const selectPosts2 = await trx.selectFrom("posts").leftJoin("post_reactions as reaction", "reaction.post_id", "posts.id").leftJoin(
        "post_reactions as all_reactions",
        (join) => join.onRef("all_reactions.post_id", "=", "posts.id").on("all_reactions.active", "=", true)
      ).innerJoin("profiles", "profiles.id", "posts.user_id").leftJoin("release_groups", "release_groups.release_group_mbid", "profiles.avatar_mbid").leftJoin("artists", "artists.artist_mbid", "release_groups.artist_mbid").select([
        "posts.id as now_playing_post_id",
        "posts.text as text",
        "posts.artist_mbid as artist_mbid",
        "posts.release_group_mbid as release_group_mbid",
        "posts.recording_mbid as recording_mbid",
        "posts.artist_name as artist_name",
        "posts.release_group_name as release_group_name",
        "posts.recording_name as recording_name",
        "posts.created_at as created_at",
        "posts.updated_at as updated_at",
        "posts.episode_title as episode_title",
        "posts.show_title as show_title",
        "posts.embed_id as embed_id",
        "posts.embed_source as embed_source",
        "posts.parent_post_id as parent_post_id",
        "posts.item_type as item_type",
        "posts.user_added_metadata_id as user_added_metadata_id",
        "profiles.id as user_id",
        "profiles.username as username",
        "profiles.display_name as display_name",
        "release_groups.img_url as avatar_url",
        "release_groups.last_fm_img_url as avatar_last_fm_img_url",
        "release_groups.release_group_name as avatar_release_group_name",
        "artists.artist_name as avatar_artist_name",
        "reaction.active as reaction_active",
        (eb) => eb.fn.count("all_reactions.id").as("reaction_count")
      ]).where("posts.user_id", "=", profileUserId).where("posts.parent_post_id", "is", null).where("posts.status", "!=", "deleted").groupBy([
        "profiles.id",
        "posts.id",
        "release_groups.release_group_name",
        "release_groups.img_url",
        "release_groups.last_fm_img_url",
        "artists.artist_name",
        "reaction.active"
      ]).orderBy("posts.created_at desc").limit(batchSize).execute();
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
      const { id } = selectReaction;
      const updateReaction = await trx.updateTable("post_reactions").set({
        active: !active,
        updated_at: timestampISO,
        changelog
      }).where("id", "=", id).returning(["id", "reaction", "active", "post_id"]).executeTakeFirst();
      const reaction2 = updateReaction;
      const countReactions = await trx.selectFrom("post_reactions").select((eb) => eb.fn.count("id").as("reaction_count")).where("active", "=", true).where("post_id", "=", reaction2.post_id).execute();
      const reactionCount = countReactions[0]["reaction_count"];
      return { reaction: reaction2, reactionCount };
    } catch (error) {
      const changelog = {};
      changelog[timestampISOString] = {
        active: true
      };
      const insertReaction = await trx.insertInto("post_reactions").values({
        id: sql`default`,
        post_id: postId,
        user_id: sessionUserId,
        reaction: reactionType,
        updated_at: timestampISO,
        active: true,
        changelog
      }).returning(["id", "reaction", "active", "post_id"]).executeTakeFirst();
      const reaction2 = insertReaction;
      const countReactions = await trx.selectFrom("post_reactions").select((eb) => eb.fn.count("id").as("reaction_count")).where("active", "=", true).where("post_id", "=", reaction2.post_id).execute();
      const reactionCount = countReactions[0]["reaction_count"];
      return { reaction: reaction2, reactionCount };
    }
  });
  const reaction = await insertUpdateReaction2;
  return reaction;
};
export {
  insertPost as a,
  selectUserNowPlayingPosts as b,
  selectPostAndReplies as c,
  deletePost as d,
  selectRandomPosts as e,
  insertUpdateReaction as i,
  selectUserPostsSample as s,
  updatePost as u
};

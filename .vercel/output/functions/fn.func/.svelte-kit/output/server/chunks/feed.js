import { d as db } from "./database.js";
const selectFeedData = async function(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options) {
  let offset = batchSize * batchIterator;
  const feedOptions = options.options;
  const select = await db.transaction().execute(async (trx) => {
    const selectFollowingUsers = await trx.selectFrom("social_graph").select("target_user_id").where(({ eb, and, not, exists, selectFrom }) => and([
      eb("user_id", "=", sessionUserId),
      eb("follows_now", "=", true),
      not(
        exists(
          selectFrom("user_moderation_actions").selectAll().whereRef("user_moderation_actions.user_id", "=", "social_graph.target_user_id").whereRef("user_moderation_actions.target_user_id", "=", "social_graph.user_id").where("active", "=", true)
        )
      )
    ])).execute();
    const followingUserIds = [];
    for (const user of selectFollowingUsers) {
      const id = user.target_user_id;
      followingUserIds.push(id);
    }
    console.log(followingUserIds);
    let postsTotal = 0;
    let posts = [];
    if (feedOptions.includes("nowPlayingPosts") && followingUserIds.length > 0) {
      const countFollowingUsersPosts = await trx.selectFrom("posts").select((eb) => eb.fn.count("id").as("posts_count")).where("user_id", "in", followingUserIds).where("parent_post_id", "is", null).where((eb) => eb.between("created_at", timestampStart, timestampEnd)).execute();
      postsTotal = countFollowingUsersPosts[0]["posts_count"];
      const selectFollowingPosts = await trx.selectFrom("posts as post").innerJoin("profiles as profile", "user_id", "profile.id").select([
        "post.id as now_playing_post_id",
        "post.user_id as user_id",
        "profile.display_name as display_name",
        "profile.username as username",
        "profile.avatar_url as avatar_url",
        "post.text as text",
        "post.item_type as item_type",
        "post.artist_name as artist_name",
        "post.release_group_name as release_group_name",
        "post.recording_name as recording_name",
        "post.episode_title as episode_title",
        "post.show_title as show_title",
        "post.listen_url as listen_url",
        "post.created_at as feed_item_timestamp"
      ]).where("user_id", "in", followingUserIds).where("parent_post_id", "is", null).where((eb) => eb.between("post.created_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      posts = selectFollowingPosts;
    }
    let sessionUserPostsCommentsTotal = 0;
    let commentsTotal = 0;
    let sessionUserPostsComments = [];
    let comments = [];
    if (feedOptions.includes("comments") && followingUserIds.length > 0) {
      const countSessionUserPostComments = await trx.selectFrom("posts as comments").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").select((eb) => eb.fn.count("comments.id").as("comments_count")).where("comments.parent_post_id", "is not", null).where("original_post.user_id", "=", sessionUserId).where((eb) => eb.between("comments.created_at", timestampStart, timestampEnd)).execute();
      sessionUserPostsCommentsTotal = countSessionUserPostComments[0]["comments_count"];
      const selectSessionUserPostComments = await trx.selectFrom("posts as comments").innerJoin("profiles as commenter", "commenter.id", "comments.user_id").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").select([
        "comments.id as comment_id",
        "comments.user_id as user_id",
        "commenter.display_name as display_name",
        "commenter.avatar_url as avatar_url",
        "comments.text as comment_text",
        "comments.parent_post_id",
        "comments.created_at as feed_item_timestamp"
      ]).where("comments.parent_post_id", "is not", null).where("original_post.user_id", "=", sessionUserId).where((eb) => eb.between("comments.created_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      sessionUserPostsComments = selectSessionUserPostComments;
      const countFollowingComments = await trx.selectFrom("posts as comments").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").select((eb) => eb.fn.count("comments.id").as("comments_count")).where("comments.user_id", "in", followingUserIds).where("original_post.user_id", "in", followingUserIds).where("comments.parent_post_id", "is not", null).where((eb) => eb.between("comments.created_at", timestampStart, timestampEnd)).execute();
      commentsTotal = countFollowingComments[0]["comments_count"];
      const selectFollowingComments = await trx.selectFrom("posts as comments").innerJoin("profiles as commenter", "commenter.id", "comments.user_id").innerJoin("posts as original_post", "comments.parent_post_id", "original_post.id").innerJoin("profiles as original_poster", "original_post.user_id", "original_poster.id").select([
        "comments.id as comment_id",
        "comments.user_id as user_id",
        "commenter.display_name as display_name",
        "commenter.avatar_url as avatar_url",
        "comments.text as comment_text",
        "comments.parent_post_id",
        "original_post.user_id as original_poster_user_id",
        "original_poster.display_name as original_poster_display_name",
        "original_poster.username as original_poster_username",
        "comments.created_at as feed_item_timestamp"
      ]).where("comments.user_id", "in", followingUserIds).where("original_post.user_id", "in", followingUserIds).where("comments.parent_post_id", "is not", null).where((eb) => eb.between("comments.created_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      comments = selectFollowingComments;
    }
    let sessionUserPostsReactionsTotal = 0;
    let reactionsTotal = 0;
    let sessionUserPostsReactions = [];
    let reactions = [];
    if (feedOptions.includes("reactions") && followingUserIds.length > 0) {
      const countSessionUserPostsReactions = await trx.selectFrom("post_reactions").innerJoin("posts", "posts.id", "post_reactions.post_id").select((eb) => eb.fn.count("post_reactions.id").as("reactions_count")).where("posts.user_id", "=", sessionUserId).where("post_reactions.active", "=", true).where((eb) => eb.between("post_reactions.updated_at", timestampStart, timestampEnd)).execute();
      sessionUserPostsReactionsTotal = countSessionUserPostsReactions[0]["reactions_count"];
      const countFollowingReactions = await trx.selectFrom("post_reactions").select((eb) => eb.fn.count("id").as("reactions_count")).where("user_id", "in", followingUserIds).where("active", "=", true).where((eb) => eb.between("updated_at", timestampStart, timestampEnd)).execute();
      reactionsTotal = countFollowingReactions[0]["reactions_count"];
      const selectSessionUserPostsReactions = await trx.selectFrom("post_reactions as reaction").innerJoin("posts as original_post", "original_post.id", "reaction.post_id").innerJoin("profiles as react_user", "react_user.id", "reaction.user_id").select([
        "reaction.id as reaction_id",
        "reaction.user_id as react_user_id",
        "reaction.post_id as post_id",
        "reaction.reaction as reaction",
        "original_post.user_id as original_poster_user_id",
        "reaction.updated_at as feed_item_timestamp",
        "react_user.display_name as display_name",
        "react_user.avatar_url as avatar_url"
      ]).where("reaction.active", "=", true).where("original_post.parent_post_id", "is", null).where("original_post.user_id", "=", sessionUserId).where((eb) => eb.between("reaction.updated_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      sessionUserPostsReactions = selectSessionUserPostsReactions;
      const selectFollowingReactions = await trx.selectFrom("post_reactions as reaction").innerJoin("posts as original_post", "original_post.id", "reaction.post_id").innerJoin("profiles as react_user", "react_user.id", "reaction.user_id").innerJoin("profiles as original_poster", "original_post.user_id", "original_poster.id").select([
        "reaction.id as reaction_id",
        "reaction.user_id as react_user_id",
        "reaction.post_id as post_id",
        "reaction.reaction as reaction",
        "reaction.updated_at as feed_item_timestamp",
        "react_user.display_name as display_name",
        "react_user.avatar_url as avatar_url",
        "original_post.user_id as original_post_id",
        "original_poster.display_name as original_poster_display_name",
        "original_poster.username as original_poster_username"
      ]).where("reaction.user_id", "in", followingUserIds).where("active", "=", true).where("parent_post_id", "is", null).where((eb) => eb.between("reaction.updated_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      reactions = selectFollowingReactions;
    }
    let sessionUserCollectionsSocialTotal = 0;
    let collectionsSocialTotal = 0;
    let sessionUserCollectionFollows = [];
    let collectionFollows = [];
    if (feedOptions.includes("collectionFollows") && followingUserIds.length > 0) {
      const countSessionUserCollectionsSocialTotal = await trx.selectFrom("collections_social").innerJoin("collections_info as info", "info.collection_id", "collections_social.collection_id").select((eb) => eb.fn.count("id").as("collection_follows_count")).where(({ eb, and }) => and([
        eb("user_role", "=", "follower"),
        eb("follows_now", "=", true),
        eb("info.owner_id", "=", sessionUserId)
      ])).where((eb) => eb.between("collections_social.updated_at", timestampStart, timestampEnd)).execute();
      sessionUserCollectionsSocialTotal = countSessionUserCollectionsSocialTotal[0]["collection_follows_count"];
      const countFollowingCollectionsSocial = await trx.selectFrom("collections_social").select((eb) => eb.fn.count("id").as("collection_follows_count")).where(({ eb, and }) => and([
        eb("user_id", "in", followingUserIds),
        eb("user_role", "=", "follower"),
        eb("follows_now", "=", true)
      ])).where((eb) => eb.between("updated_at", timestampStart, timestampEnd)).execute();
      collectionsSocialTotal = countFollowingCollectionsSocial[0]["collection_follows_count"];
      const selectSessionUserCollectionFollows = await trx.selectFrom("collections_social").innerJoin("collections_info as info", "info.collection_id", "collections_social.collection_id").innerJoin("profiles as profile", "collections_social.user_id", "profile.id").select([
        "collections_social.id as collection_follow_id",
        "collections_social.collection_id as collection_id",
        "collections_social.user_id as user_id",
        "collections_social.updated_at as feed_item_timestamp",
        "profile.display_name as display_name",
        "profile.avatar_url as avatar_url",
        "info.title as title"
      ]).where(({ eb, and }) => and([
        eb("user_role", "=", "follower"),
        eb("follows_now", "=", true),
        eb("info.owner_id", "=", sessionUserId)
      ])).where((eb) => eb.between("collections_social.updated_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      sessionUserCollectionFollows = selectSessionUserCollectionFollows;
      const selectFollowingCollectionsSocial = await trx.selectFrom("collections_social").innerJoin("collections_info as info", "info.collection_id", "collections_social.collection_id").innerJoin("profiles as profile", "collections_social.user_id", "profile.id").select([
        "collections_social.id as collection_follow_id",
        "collections_social.collection_id as collection_id",
        "collections_social.user_id as user_id",
        "collections_social.updated_at as feed_item_timestamp",
        "profile.display_name as display_name",
        "profile.avatar_url as avatar_url",
        "info.title as title"
      ]).where(({ eb, and }) => and([
        eb("user_id", "in", followingUserIds),
        eb("user_role", "=", "follower"),
        eb("follows_now", "=", true)
      ])).where((eb) => eb.between("collections_social.updated_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp", "desc").execute();
      collectionFollows = selectFollowingCollectionsSocial;
    }
    let collectionEditsTotal = 0;
    let collectionEdits = [];
    if (feedOptions.includes("collectionEdits") && followingUserIds.length > 0) {
      const countFollowingCollectionsEdits = await trx.selectFrom("collections_updates").select((eb) => eb.fn.count("collection_id").as("collection_edits_count")).where("updated_by", "in", followingUserIds).where((eb) => eb.between("updated_at", timestampStart, timestampEnd)).execute();
      collectionEditsTotal = countFollowingCollectionsEdits[0]["collection_edits_count"];
      const selectFollowingCollectionsEdits = await trx.selectFrom("collections_updates").innerJoin("collections_info as info", "info.collection_id", "collections_updates.collection_id").innerJoin("profiles as profile", "profile.id", "collections_updates.updated_by").select([
        "collections_updates.id as collection_edit_id",
        "collections_updates.collection_id as collection_id",
        "collections_updates.updated_at as feed_item_timestamp",
        "collections_updates.updated_by as updated_by",
        "info.title as title",
        "profile.display_name as display_name",
        "profile.avatar_url as avatar_url"
      ]).where("collections_updates.updated_by", "in", followingUserIds).where((eb) => eb.between("collections_updates.updated_at", timestampStart, timestampEnd)).limit(batchSize).offset(offset).orderBy("feed_item_timestamp desc").execute();
      collectionEdits = selectFollowingCollectionsEdits;
    }
    const totalRowCount2 = Number(postsTotal) + Number(sessionUserPostsCommentsTotal) + Number(commentsTotal) + Number(sessionUserPostsReactionsTotal) + Number(reactionsTotal) + Number(sessionUserCollectionsSocialTotal) + Number(collectionsSocialTotal) + Number(collectionEditsTotal);
    return { posts, sessionUserPostsComments, comments, sessionUserPostsReactions, reactions, sessionUserCollectionFollows, collectionFollows, collectionEdits, totalRowCount: totalRowCount2 };
  });
  const data = await select;
  let feedData = [];
  feedData = feedData.concat(data.posts, data.comments, data.reactions, data.collectionFollows, data.collectionEdits);
  feedData.sort((a, b) => b.feed_item_timestamp - a.feed_item_timestamp);
  const { totalRowCount } = data;
  batchIterator++;
  offset = batchSize * batchIterator;
  const remainingCount = totalRowCount - offset;
  return { feedData, totalRowCount, remainingCount };
};
export {
  selectFeedData as s
};

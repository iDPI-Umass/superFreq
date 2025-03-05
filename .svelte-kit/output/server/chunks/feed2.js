import "kysely";
import { d as db } from "./database.js";
const selectFeedData = async function(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options) {
  const offset = batchSize * batchIterator;
  options.options;
  const select = await db.transaction().execute(async (trx) => {
    const selectFollowingList = await trx.selectFrom("profile_display").select("users_following").where("user_id", "=", sessionUserId).executeTakeFirst();
    const following = selectFollowingList?.users_following;
    const feedData2 = await trx.selectFrom("feed_items").selectAll().where("user_id", "in", following).where((eb) => eb.between("timestamp", timestampStart, timestampEnd)).limit(batchSize).orderBy("timestamp", "desc").offset(offset).execute();
    const totalFeedItemsRows2 = await trx.selectFrom("feed_items").select((eb) => eb.fn.count("timestamp").as("feed_rows_count")).where("user_id", "in", following).where((eb) => eb.between("timestamp", timestampStart, timestampEnd)).execute();
    return { feedData: feedData2, totalFeedItemsRows: totalFeedItemsRows2 };
  });
  const { feedData, totalFeedItemsRows } = await select;
  const totalRowCount = totalFeedItemsRows[0]["feed_rows_count"];
  return { feedData, totalRowCount };
};
const selectFirehoseFeed = async function(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd) {
  const offset = batchSize * batchIterator;
  const select = await db.transaction().execute(async (trx) => {
    const selectFollowingList = await trx.selectFrom("profiles").select("id").where(({ not, exists, selectFrom }) => not(
      exists(
        selectFrom("user_moderation_actions").selectAll().whereRef("user_moderation_actions.user_id", "=", "profiles.id").where("user_moderation_actions.target_user_id", "=", sessionUserId).where("type", "=", "block").where("active", "=", true)
      )
    )).execute();
    const following = [];
    for (const profile of selectFollowingList) {
      following.push(profile.id);
    }
    const feedData2 = await trx.selectFrom("feed_items").selectAll().where("user_id", "in", following).where((eb) => eb.between("timestamp", timestampStart, timestampEnd)).limit(batchSize).orderBy("timestamp", "desc").offset(offset).execute();
    const totalFeedItemsRows2 = await trx.selectFrom("feed_items").select((eb) => eb.fn.count("timestamp").as("feed_rows_count")).where("user_id", "in", following).where((eb) => eb.between("timestamp", timestampStart, timestampEnd)).execute();
    return { feedData: feedData2, totalFeedItemsRows: totalFeedItemsRows2 };
  });
  const { feedData, totalFeedItemsRows } = await select;
  const totalRowCount = totalFeedItemsRows[0]["feed_rows_count"];
  return { feedData, totalRowCount };
};
export {
  selectFirehoseFeed as a,
  selectFeedData as s
};

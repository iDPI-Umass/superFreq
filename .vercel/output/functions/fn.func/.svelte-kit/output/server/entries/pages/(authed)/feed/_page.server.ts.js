import { s as selectFeedData } from "../../../../chunks/feed.js";
import { add, parseISO } from "date-fns";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const batchSize = 5;
  const batchIterator = 0;
  const timestampEnd = /* @__PURE__ */ new Date();
  const timestampStart = add(timestampEnd, { days: -300 });
  const options = { "options": ["nowPlayingPosts", "comments", "reactions", "collectionFollows", "collectionEdits"] };
  const { feedData, totalRowCount, remainingCount } = await selectFeedData(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options);
  const remaining = remainingCount;
  return { feedData, totalRowCount, remaining, timestampStart, timestampEnd, batchSize, options };
};
const actions = {
  loadMore: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const feedItems = JSON.parse(data.get("feed-items"));
    const batchSize = parseInt(data.get("batch-size"));
    let batchIterator = parseInt(data.get("batch-iterator"));
    batchIterator++;
    const timestampStart = parseISO(data.get("timestamp-start"));
    const timestampEnd = parseISO(data.get("timestamp-end"));
    const options = JSON.parse(data.get("options"));
    const { feedData, remainingCount } = await selectFeedData(sessionUserId, batchSize, batchIterator, timestampStart, timestampEnd, options);
    feedItems.push(...feedData);
    const remaining = remainingCount;
    return { feedItems, remaining, batchIterator };
  }
};
export {
  actions,
  load
};

import { f as selectAllOpenPublicCollections } from "../../../chunks/collections.js";
const load = async () => {
  const batchSize = 5;
  const batchIterator = 0;
  const { batch, remainingCount } = await selectAllOpenPublicCollections(batchSize, batchIterator);
  const totalCollections = batch.collectionsCount[0].count;
  const collections = batch.collections;
  const remaining = remainingCount;
  return { collections, remaining, totalCollections, batchSize, batchIterator };
};
const actions = {
  loadMore: async ({ request }) => {
    const data = await request.formData();
    const collections = JSON.parse(data.get("collections"));
    const batchSize = parseInt(data.get("batch-size"));
    let batchIterator = parseInt(data.get("batch-iterator"));
    batchIterator++;
    const { batch, remainingCount } = await selectAllOpenPublicCollections(batchSize, batchIterator);
    collections.push(...batch.collections);
    const remaining = remainingCount;
    return { collections, remaining, batchIterator };
  }
};
export {
  actions,
  load
};

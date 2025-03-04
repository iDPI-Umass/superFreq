import "../../../../chunks/index.js";
import { d as db } from "../../../../chunks/database.js";
import "../../../../chunks/parseData.js";
let metadata = [];
const load = async () => {
  const selectMetadata = await db.selectFrom("user_added_metadata").selectAll().where("artist_name", "is", null).where("release_group_name", "is", null).where("recording_name", "is", null).where("episode_title", "is", null).execute();
  metadata = selectMetadata;
  return { metadata };
};
const actions = {
  default: async () => {
    const updatedPostIds = [];
    for (const item of metadata) {
      const metadataId = item["id"];
      const postId = item["post_id"];
      const updatePost = await db.updateTable("posts").set({
        user_added_metadata_id: null
      }).where("id", "=", postId).returning("id").executeTakeFirst();
      updatedPostIds.push(updatePost?.id);
      await db.deleteFrom("user_added_metadata").where("id", "=", metadataId).execute();
    }
    const updatedCount = updatedPostIds.length;
    const success = updatedCount > 0 ? true : false;
    return success;
  }
};
export {
  actions,
  load
};

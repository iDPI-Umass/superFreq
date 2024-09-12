import { r as redirect } from "../../../../../chunks/index.js";
import { t as timestampISO } from "../../../../../chunks/parseData.js";
import { d as selectEditableCollectionContents, u as updateCollection } from "../../../../../chunks/collections.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  if (!session.session) {
    throw redirect(303, "/");
  }
  const collectionId = parseInt(params.collectionId).toString();
  const sessionUserId = session.user?.id;
  const collection = await selectEditableCollectionContents(collectionId, "release_groups", sessionUserId);
  if (collection) {
    return { collection, sessionUserId, collectionId };
  } else {
    throw redirect(303, "/collections");
  }
};
const actions = {
  updateCollection: async ({ request }) => {
    const data = await request.formData();
    const collectionTitle = data.get("collection-title");
    const collectionId = data.get("collection-id");
    const collectionStatus = data.get("status");
    const collectionDescription = data.get("description");
    const items = data.get("collection-contents");
    const deletedItems = data.get("deleted-items");
    const updatedBy = data.get("updated-by");
    const collectionItems = JSON.parse(items);
    const deletedCollectionItems = JSON.parse(deletedItems);
    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems);
    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      collection_id: collectionId,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy
    };
    const update = await updateCollection(collectionInfo, activeAndDeletedCollectionItems);
    if (!update) {
      alert("update not successful");
    } else {
      throw redirect(303, `/collection/${collectionId}`);
    }
  }
};
export {
  actions,
  load
};

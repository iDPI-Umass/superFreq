import { r as redirect } from "../../../../../chunks/index.js";
import { t as timestampISO } from "../../../../../chunks/parseData.js";
import { f as selectEditableCollectionContents, g as deleteCollection, u as updateCollection } from "../../../../../chunks/collections.js";
let collectionId;
let updatedBy;
const load = async ({ parent, params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const { profile } = await parent();
  const username = profile?.username ?? null;
  if (!session.session) {
    throw redirect(307, "/");
  } else if (session.session && !username) {
    throw redirect(307, "/account/create-profile");
  }
  collectionId = params.collectionId;
  const sessionUserId = session.user?.id;
  const collection = await selectEditableCollectionContents(collectionId, sessionUserId);
  collection.info?.type;
  updatedBy = sessionUserId;
  if (collection) {
    return { collection, sessionUserId, collectionId };
  } else {
    throw redirect(303, "/collections");
  }
};
const actions = {
  updateCollection: async ({ request, locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    const sessionUserId = session?.user.id;
    const data = await request.formData();
    const collectionTitle = data.get("collection-title");
    const collectionStatus = data.get("status");
    const collectionDescription = data.get("description");
    const sort = data.get("view-sort");
    const items = data.get("collection-contents");
    const deletedItems = data.get("deleted-items");
    const collectionItems = JSON.parse(items);
    const deletedCollectionItems = JSON.parse(deletedItems);
    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems);
    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      default_view_sort: sort,
      collection_id: collectionId,
      description_text: collectionDescription,
      updated_at: timestampISO,
      updated_by: updatedBy
    };
    const update = await updateCollection(sessionUserId, collectionInfo, activeAndDeletedCollectionItems);
    if (!update) {
      alert("update not successful");
    } else {
      throw redirect(303, `/collection/${collectionId}`);
    }
  },
  deleteCollection: async ({ locals: { safeGetSession } }) => {
    const { session } = await safeGetSession();
    const sessionUserId = session?.user.id;
    const { success } = await deleteCollection(sessionUserId, collectionId);
    if (success) {
      redirect(303, "/");
    } else {
      return success;
    }
  }
};
export {
  actions,
  load
};

import { r as redirect } from "../../../../../chunks/index.js";
import { d as selectEditableTopAlbumsCollection, i as insertUpdateTopAlbumsCollection } from "../../../../../chunks/collections.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const { collectionContents, deletedCollectionContents } = await selectEditableTopAlbumsCollection(sessionUserId);
  return { collectionContents, deletedCollectionContents };
};
const actions = {
  submitCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const collectionItems = JSON.parse(data.get("collection-items"));
    const deletedCollectionItems = JSON.parse(data.get("deleted-items"));
    const activeAndDeletedCollectionItems = collectionItems.concat(deletedCollectionItems);
    const insertUpdate = await insertUpdateTopAlbumsCollection(sessionUserId, activeAndDeletedCollectionItems);
    const username = insertUpdate?.username;
    if (insertUpdate) {
      throw redirect(303, `/user/${username}`);
    } else {
      return { success: false };
    }
  }
};
export {
  actions,
  load
};

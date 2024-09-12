import { r as redirect } from "../../../../chunks/index.js";
import { c as selectViewableCollectionContents } from "../../../../chunks/collections.js";
import { f as insertUpdateCollectionFollow } from "../../../../chunks/users.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const collectionId = parseInt(params.collectionId).toString();
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const { collectionInfo, collectionContents, viewPermission, editPermission, followData } = await selectViewableCollectionContents(collectionId, sessionUserId);
  if (!viewPermission) {
    throw redirect(307, "/collections");
  }
  return { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData };
};
const actions = {
  followCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const collectionId = data.get("collection-id");
    const follow = await insertUpdateCollectionFollow(sessionUserId, collectionId);
    return { follow, success: true };
  }
};
export {
  actions,
  load
};

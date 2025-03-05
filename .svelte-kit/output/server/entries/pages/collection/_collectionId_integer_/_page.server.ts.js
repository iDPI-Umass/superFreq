import { r as redirect } from "../../../../chunks/index.js";
import { e as selectViewableCollectionContents } from "../../../../chunks/collections.js";
import { h as insertUpdateCollectionFollow } from "../../../../chunks/users.js";
let loadData = true;
let updateFollow = false;
let collectionId;
let collectionInfo;
let collectionContents;
let viewPermission;
let editPermission;
let followData;
let followsNow;
const load = async ({ params, locals: { safeGetSession } }) => {
  collectionId = parseInt(params.collectionId).toString();
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  if (loadData) {
    const collection = await selectViewableCollectionContents(collectionId, sessionUserId);
    collectionInfo = collection.collectionInfo;
    collectionContents = collection.collectionContents;
    viewPermission = collection.viewPermission;
    editPermission = collection.editPermission;
    followData = collection.followData ?? { "follows_now": false };
    if (!viewPermission) {
      throw redirect(307, "/collections");
    }
  }
  if (updateFollow) {
    updateFollow = false;
    loadData = true;
    followData["follows_now"] = followsNow;
  }
  return { sessionUserId, collectionId, collectionInfo, collectionContents, viewPermission, editPermission, followData };
};
const actions = {
  followCollection: async ({ request, locals: { safeGetSession } }) => {
    updateFollow = true;
    loadData = false;
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const data = await request.formData();
    const collectionId2 = data.get("collection-id");
    const follow = await insertUpdateCollectionFollow(sessionUserId, collectionId2);
    followsNow = follow?.follows_now;
    return { success: true };
  }
};
export {
  actions,
  load
};

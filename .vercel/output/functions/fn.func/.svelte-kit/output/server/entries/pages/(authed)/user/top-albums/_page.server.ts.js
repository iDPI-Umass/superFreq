import { r as redirect } from "../../../../../chunks/index.js";
import { b as selectEditableTopAlbumsCollection, i as insertUpdateTopAlbumsCollection } from "../../../../../chunks/collections.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const collection = await selectEditableTopAlbumsCollection(sessionUserId);
  return { collection };
};
const actions = {
  submitCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const formData = await request.formData();
    const collectionItems = JSON.parse(formData.get("collection-items"));
    const insertUpdate = await insertUpdateTopAlbumsCollection(sessionUserId, collectionItems);
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

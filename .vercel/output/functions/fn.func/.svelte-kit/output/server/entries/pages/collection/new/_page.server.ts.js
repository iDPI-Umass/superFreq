import { r as redirect } from "../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { e as insertCollection } from "../../../../chunks/collections.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  if (!session.session) {
    throw redirect(303, "/");
  }
  const sessionUserId = session.user?.id;
  return { sessionUserId };
};
const actions = {
  insertCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    const timestampISO = parseISO(timestampISOString);
    const data = await request.formData();
    const collectionTitle = data.get("collection-title");
    const collectionType = data.get("collection-type");
    const collectionStatus = data.get("status");
    const collectionDescription = data.get("description");
    const collectionItemsString = data.get("collection-contents");
    const changelog = {};
    const collectionItems = JSON.parse(collectionItemsString);
    changelog[timestampISOString] = {
      "title": collectionTitle,
      "status": collectionStatus,
      "description_text": collectionDescription,
      "updated_by": sessionUserId
    };
    const collectionInfo = {
      title: collectionTitle,
      status: collectionStatus,
      type: collectionType,
      description_text: collectionDescription,
      created_at: timestampISO,
      updated_at: timestampISO,
      owner_id: sessionUserId,
      updated_by: sessionUserId,
      changelog
    };
    const collectionId = await insertCollection(sessionUserId, collectionInfo, collectionItems);
    console.log(collectionId);
    if (!collectionId) {
      alert("update not successful");
    } else {
      redirect(303, `/collection/${collectionId}`);
    }
  }
};
export {
  actions,
  load
};

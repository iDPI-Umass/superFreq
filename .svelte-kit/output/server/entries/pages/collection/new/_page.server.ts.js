import { r as redirect } from "../../../../chunks/index.js";
import { parseISO } from "date-fns";
import { h as insertCollection } from "../../../../chunks/collections.js";
const load = async ({ parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const { profile } = await parent();
  const username = profile?.username ?? null;
  if (!session.session) {
    throw redirect(307, "/");
  } else if (session.session && !username) {
    throw redirect(307, "/account/create-profile");
  }
  const sessionUserId = session.user?.id;
  return { sessionUserId };
};
const actions = {
  insertCollection: async ({ request, locals: { safeGetSession } }) => {
    const session = await safeGetSession();
    const sessionUserId = session.user?.id;
    const timestampISOString = (/* @__PURE__ */ new Date()).toISOString();
    parseISO(timestampISOString);
    const data = await request.formData();
    const collectionTitle = data.get("collection-title");
    const collectionType = data.get("collection-type");
    const sort = data.get("view-sort");
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
      type: collectionType ?? null,
      default_view_sort: sort,
      description_text: collectionDescription,
      changelog
    };
    const collectionId = await insertCollection(sessionUserId, collectionInfo, collectionItems);
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

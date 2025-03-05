import { r as redirect } from "../../../../../../chunks/index.js";
import { b as selectListProfileUserViewableCollections } from "../../../../../../chunks/collections.js";
const load = async ({ params, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const username = params.username;
  const collections = await selectListProfileUserViewableCollections(sessionUserId, username);
  if (collections.length == 0) {
    throw redirect(303, `/user/${username}`);
  }
  return { collections, username };
};
export {
  load
};

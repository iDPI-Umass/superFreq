import { r as redirect } from "../../../../../../chunks/index.js";
import { s as selectListProfileUserViewableCollections } from "../../../../../../chunks/collections.js";
const load = async ({ params }) => {
  const username = params.username;
  const collections = await selectListProfileUserViewableCollections(username);
  if (collections.length == 0) {
    throw redirect(303, `/user/${username}`);
  }
  return { collections, username };
};
export {
  load
};

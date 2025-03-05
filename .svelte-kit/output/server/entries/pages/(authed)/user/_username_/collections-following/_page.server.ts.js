import { r as redirect } from "../../../../../../chunks/index.js";
import { c as selectListProfileUserFollowingCollections } from "../../../../../../chunks/collections.js";
const load = async ({ params }) => {
  const username = params.username;
  const collections = await selectListProfileUserFollowingCollections(username);
  if (collections.length == 0) {
    throw redirect(303, `/user/${username}`);
  }
  return { collections, username };
};
export {
  load
};

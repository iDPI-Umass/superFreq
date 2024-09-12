import { r as redirect } from "../../../../chunks/index.js";
const load = async () => {
  throw redirect(303, "/auth/signout");
};
export {
  load
};

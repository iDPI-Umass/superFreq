import { r as redirect } from "../../chunks/index.js";
const load = async ({ url, locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  if (session.session) {
    throw redirect(303, "/feed");
  } else {
    throw redirect(303, "/welcome");
  }
};
export {
  load
};

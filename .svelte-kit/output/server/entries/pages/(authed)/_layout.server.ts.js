import { r as redirect } from "../../../chunks/index.js";
async function load({ parent, locals: { safeGetSession } }) {
  const { session } = await safeGetSession();
  const { profile } = await parent();
  const username = profile?.username ?? null;
  if (!session) {
    throw redirect(307, "/");
  } else if (session && !username) {
    throw redirect(307, "/create-profile");
  }
}
export {
  load
};

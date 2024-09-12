import { r as redirect } from "../../../chunks/index.js";
async function load({ locals: { safeGetSession } }) {
  const { session } = await safeGetSession();
  if (!session) {
    throw redirect(307, "/");
  }
}
export {
  load
};

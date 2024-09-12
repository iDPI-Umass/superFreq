import { h as selectAllUsers } from "../../../chunks/users.js";
const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  session.user?.id;
  const selectUsers = selectAllUsers();
  const users = await selectUsers;
  return { users };
};
export {
  load
};

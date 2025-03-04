import { j as selectAllUsers } from "../../../chunks/users.js";
const load = async () => {
  const selectUsers = selectAllUsers();
  const users = await selectUsers;
  return { users };
};
export {
  load
};

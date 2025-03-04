import { r as redirect } from "../../chunks/index.js";
import { c as checkLoginPermission } from "../../chunks/users.js";
const load = async ({ parent }) => {
  const { profile, session } = await parent();
  const username = profile?.username;
  if (session && username) {
    throw redirect(303, `/user/${username}`);
  }
  if (session && !username) {
    throw redirect(303, `/create-profile`);
  }
};
const actions = {
  sendMagicLink: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    const email = data.get("email");
    const permission = await checkLoginPermission(email);
    let authResponse;
    if (permission) {
      authResponse = await supabase.auth.signInWithOtp({ email });
    } else {
      return {
        permission: false,
        success: false,
        showModal: true
      };
    }
    if (authResponse.error) {
      return {
        permission: true,
        success: false,
        showModal: true
      };
    } else {
      return {
        permission: true,
        success: true,
        showModal: true
      };
    }
  }
};
export {
  actions,
  load
};

import { r as redirect } from "../../../chunks/index.js";
const load = async ({ locals: { safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (session) {
    throw redirect(303, "/feed");
  }
};
const actions = {
  sendMagicLink: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    const email = data.get("email");
    const { error } = await supabase.auth.signInWithOtp({ email });
    console.log(error);
    if (error) {
      return {
        success: false,
        showModal: true
      };
    } else {
      return {
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

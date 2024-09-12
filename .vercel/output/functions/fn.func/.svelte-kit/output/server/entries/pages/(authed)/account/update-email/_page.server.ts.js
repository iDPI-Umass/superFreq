const load = async ({ locals: { safeGetSession } }) => {
  const session = await safeGetSession();
  const sessionUserId = session.user?.id;
  const sessionUserEmail = session.user?.email;
  return { sessionUserId, sessionUserEmail };
};
const actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const confirmEmail = formData.get("confirm-email");
    const updateEmail = await supabase.auth.updateUser({ email: confirmEmail });
    if (updateEmail) {
      return { success: true };
    } else {
      return { success: false };
    }
  }
};
export {
  actions,
  load
};

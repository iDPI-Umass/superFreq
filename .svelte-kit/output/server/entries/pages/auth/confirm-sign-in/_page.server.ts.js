import { r as redirect } from "../../../../chunks/index.js";
const load = async ({ url }) => {
  const urlString = url.toString();
  return { urlString };
};
const actions = {
  confirm: async ({ request, locals: { supabase } }) => {
    const data = await request.formData();
    const urlString = data.get("url-string");
    const url = new URL(urlString);
    const token_hash = url.searchParams.get("token_hash");
    const type = url.searchParams.get("type");
    const next = "/auth/check";
    const redirectTo = new URL(url);
    redirectTo.pathname = next;
    redirectTo.searchParams.delete("token_hash");
    redirectTo.searchParams.delete("type");
    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({ type, token_hash });
      if (!error) {
        redirect(303, redirectTo);
      }
    }
    redirectTo.pathname = "/auth/error";
    redirect(303, redirectTo);
  }
};
export {
  actions,
  load
};

import { r as redirect } from "../../../../chunks/index.js";
const GET = async ({ url, locals: { supabase } }) => {
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = url.searchParams.get("next") ?? "/auth/check";
  const redirectTo = new URL(url);
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      redirectTo.searchParams.delete("next");
      redirect(303, redirectTo);
    }
  }
  redirectTo.pathname = "/auth/error";
  redirect(303, redirectTo);
};
export {
  GET
};

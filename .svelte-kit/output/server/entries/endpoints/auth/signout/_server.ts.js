import { r as redirect } from "../../../../chunks/index.js";
import { p as profileStoresObject } from "../../../../chunks/stores.js";
const GET = async ({ locals: { supabase, safeGetSession } }) => {
  const { session } = await safeGetSession();
  if (session) {
    await supabase.auth.signOut();
    profileStoresObject.set({
      "username": null,
      "display_name": null
    });
    throw redirect(303, "/welcome");
  }
};
export {
  GET
};

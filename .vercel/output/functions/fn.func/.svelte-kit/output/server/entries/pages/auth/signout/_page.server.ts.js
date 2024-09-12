import { r as redirect } from "../../../../chunks/index.js";
import { p as profileStoresObject } from "../../../../chunks/stores.js";
const load = async ({ locals: { supabase, session } }) => {
  if (session) {
    await supabase.auth.signOut();
    profileStoresObject.set({
      "username": null,
      "display_name": null,
      "avatar_url": null
    });
    throw redirect(303, "/");
  }
};
export {
  load
};

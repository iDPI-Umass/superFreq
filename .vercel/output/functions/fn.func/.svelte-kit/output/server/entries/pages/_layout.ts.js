import { isBrowser, createBrowserClient, parse, createServerClient } from "@supabase/ssr";
import { P as PUBLIC_SUPABASE_URL, a as PUBLIC_SUPABASE_ANON_KEY } from "../../chunks/public.js";
import { p as profileStoresObject } from "../../chunks/stores.js";
const load = async ({ data, depends, fetch }) => {
  depends("supabase:auth");
  const supabase = isBrowser() ? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      get(key) {
        const cookie = parse(document.cookie);
        return cookie[key];
      }
    }
  }) : createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      get() {
        return JSON.stringify(data.session);
      }
    }
  });
  const {
    data: { session }
  } = await supabase.auth.getSession();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  const { profile } = data;
  profileStoresObject.set(profile);
  return { session, user, profile, supabase };
};
export {
  load
};

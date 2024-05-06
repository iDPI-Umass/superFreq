import { createServerClient } from '@supabase/ssr';
import { cookies } from 'svelte';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export function createSupabaseAppServerClient(serverComponent = false) {
    return createServerClient(
        PUBLIC_SUPABASE_URL, 
        PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                get(name) {
                    // set the cookie
                },
                set(name, value, cookie) {
                    if (serverComponent) return;
                    // set the cookie
                },
                remove(name, options) {
                    if (serverComponent) return;
                    // set the cookie
                }
            }
        }
    );
}

export function createSupbaseServerComponentClient() {
    return createSupabaseAppServerClient(true);
}
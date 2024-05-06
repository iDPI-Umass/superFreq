import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

let changelog = {};
let updatedAt = "";
let userProfile;

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
  const session = await safeGetSession()

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`username, display_name, website, avatar_url, changelog, updated_at`)
    .eq('id', session.user.id)
    .single()

    changelog = JSON.stringify(profile["changelog"]);
    const updatedAt = new Date( profile["updated_at"] );
    let responseStatus;

    userProfile = profile;

    return { session, profile }
}

export const actions: Actions = {
  update: async ({ request, locals: { supabase, safeGetSession } }) => {
    const formData = await request.formData()
    let displayName = formData.get('displayName') as string
    let username = formData.get('username') as string
    let website = formData.get('website') as string
    let avatarUrl = formData.get('avatarUrl') as string

    const session = await safeGetSession()

    // let changelogData = {
    //   "display_name": displayName,
    //   "username": username,
    //   "website": website,
    //   "avatar_url": avatarUrl
    // }

    // // let changelogEntry = JSON.stringify(changelogData);
    // let updatedDate = JSON.stringify(updatedAt);

    // let changelogEntry = {
    //   updatedAt: changelogData
    // };

    // changelogEntry = JSON.stringify(changelogEntry);

    // changelog = {
    //   changelogEntry, ...changelog
    // };

    const { data, status, error } = await supabase.from('profiles').update({
      username: username,
      display_name: displayName,
      website: website,
      avatar_url: avatarUrl,
      changelog: {}
    }).eq("id", session?.user.id)
    .select();
  
    if (error) {
      return fail(500, {
        displayName,
        username: "this username is already taken, try a new one",
        website,
        avatarUrl,
      })
    }

    // username = data["username"];
    // displayName = data["display_name"];
    // website = data["website"];
    // avatarUrl = data["avatar_url"];

    return {
      displayName,
      username,
      website,
      avatarUrl,  
      success: true
    }
    

  },
  signout: async ({ locals: { supabase, safeGetSession } }) => {
    const session = await safeGetSession()
    if (session) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
} satisfies Actions;

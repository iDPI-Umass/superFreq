import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

let changelog: any
let updatedAt = "";
let userProfile;

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {
  // const session = await safeGetSession()

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`username, display_name, website, avatar_url, changelog, updated_at`)
    .eq('id', session.user.id)
    .single()

    changelog = (profile["changelog"]);
    const updatedAt = profile["updated_at"];

    changelog[updatedAt] = {
      "user_name": profile["username"],
      "display_name": profile["display_name"],
      "website": profile["webiste"],
      "avatar_url": profile["avatar_url"],
    }

    userProfile = profile;

    return { session, profile }
}

export const actions: Actions = {
  update: async ({ request, locals: { supabase, session } }) => {
    const formData = await request.formData()
    const displayName = formData.get('displayName') as string
    const username = formData.get('username') as string
    const website = formData.get('website') as string
    const avatarUrl = formData.get('avatarUrl') as string

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

    // const { data, status, error } = await supabase.from('profiles').update({
    //   username: username,
    //   display_name: displayName,
    //   website: website,
    //   avatar_url: avatarUrl,
    //   changelog: {}
    // }).eq("id", session?.user.id)
    // .select();
  
    // if (error) {
    //   return fail(500, {
    //     displayName,
    //     username: "this username is already taken, try a new one",
    //     website,
    //     avatarUrl,
    //   })
    // }

    // username = data["username"];
    // displayName = data["display_name"];
    // website = data["website"];
    // avatarUrl = data["avatar_url"];

    const { error, data } = await supabase.from('profiles').update({
      id: session?.user.id,
      display_name: displayName,
      username: username,
      website: website,
      avatar_url: avatarUrl,
      updated_at: new Date(),
      changelog
    })
    .eq('id', session.user.id)
    .select()

    // console.log(error)

    if (error) {
      const { code, message } = error
      return fail(code, message)
    }

    const profileStorageItem = {
      "display_name": displayName,
      "username": username,
      "avatar_url": avatarUrl
    }

    //localStorage.setItem("profile", JSON.stringify(profileStorageItem))
    console.log(data, error)

    return {
      displayName,
      username,
      website,
      avatarUrl,  
      success: true
    }

  },

  signout: async ({ locals: { supabase, session } }) => {
    if ( session ) {
      await supabase.auth.signOut()
      localStorage.removeItem("profile")
      throw redirect(303, '/')
    }
  },
} satisfies Actions;

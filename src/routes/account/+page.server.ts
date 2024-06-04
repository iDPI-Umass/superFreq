import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

let changelog: any
let updatedAt = "";
let userProfile;

export const load: PageServerLoad = async ({ locals: { supabase, session } }) => {

  if (!session) {
    throw redirect(303, '/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`username, display_name, website, avatar_url, avatar_mbid, changelog, about, updated_at`)
    .eq('id', session.user.id)
    .single()

    changelog = (profile["changelog"]);
    const updatedAt = profile["updated_at"];

    changelog[updatedAt] = {
      "user_name": profile["username"],
      "display_name": profile["display_name"],
      "website": profile["website"],
      "avatar_mbid": profile["avatar_mbid"],
      "avatar_url": profile["avatar_url"],
      "about": profile["about"]
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
    const avatarMbid = formData.get('avatarMbid') as string
    const avatarUrl = formData.get('avatarUrl') as string
    const about = formData.get('about') as string

    console.log(formData)

    const { error, data } = await supabase.from('profiles').update({
      id: session?.user.id,
      display_name: displayName,
      username: username,
      website: website,
      avatar_mbid: avatarMbid,
      avatar_url: avatarUrl,
      updated_at: new Date(),
      about: about,
      changelog
    })
    .eq('id', session.user.id)
    .select()

    // console.log(error)

    // if (error) {
    //   const { code, message } = error
    //   return fail(code, message)
    // }

    return {
      displayName,
      username,
      website,
      avatarUrl,
      about,  
      success: true
    }

  },

  signout: async ({ locals: { supabase, session } }) => {
    if ( session ) {
      await supabase.auth.signOut()
      throw redirect(303, '/')
    }
  },
} satisfies Actions;

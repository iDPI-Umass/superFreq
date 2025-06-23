import { redirect } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { checkLoginPermission } from 'src/lib/resources/users'


export const load: PageServerLoad = async ({ parent }) => {

    // if the user is already logged in, redirect to their profile
    const { profile, session } = await parent()
    const username = profile?.username as string | null

    if (session && username) {
    throw redirect(303, `/user/${username}`)
    }
    if (session && !username) {
        throw redirect(303, `/create-profile`)
    }

//  if (session.session && !username) {
//     throw redirect(303, `/create-profile`)
//   }
}

export const actions = { 
  sendMagicLink: async({ request, locals: { supabase }}) => {

      const data = await request.formData()
      const email = data.get('email') as string

      const permission = await checkLoginPermission( email )

      let authResponse

      if ( permission ) {
          authResponse = await supabase.auth.signInWithOtp({ email: email })
      }
      else {
          return {
              permission: false,
              success: false,
              showModal: true
          }
      }
      
      if ( authResponse.error ) {
          return { 
              permission: true,
              success: false,
              showModal: true
          }
      }
      else {
          return { 
              permission: true,
              success: true,
              showModal: true
          }
      }
  }
} satisfies Actions
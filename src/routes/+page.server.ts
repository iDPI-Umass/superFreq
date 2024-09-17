import { redirect, error } from '@sveltejs/kit'
import type { PageServerLoad, Actions } from './$types'
import { db } from 'src/database.ts'

export const load: PageServerLoad = async ({ url, parent, locals: { safeGetSession } }) => {
  const session = await safeGetSession()

  // if the user is already logged in, redirect to feed
  const { profile, urlString } = await parent()
  const username = profile.username as string | null

  if (session.session && username) {
    throw redirect(303, `/user/${username}`)
  }
  else if (session.session && !username) {
    throw redirect(303, `/account/create-profile`)
  }

  return ({urlString})
}

export const actions = { 
  sendMagicLink: async({ request, locals: { supabase }}) => {

      const data = await request.formData()
      const email = data.get('email') as string

      const permission = await db
      .selectFrom('approved_users')
      .selectAll()
      .where('email', '=', email)
      .executeTakeFirst()

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
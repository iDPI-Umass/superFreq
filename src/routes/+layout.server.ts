import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals: { session } }) => {
  if (!session ) {
    localStorage.clear()
  }

  return {
    session,
  }
}
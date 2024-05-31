import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkCollectionEditPermissions } from '$lib/resources/backend-calls/checkSesssionUserPermissions';
import { selectCollectionContents } from '$lib/resources/backend-calls/collectionSelectFunctions';

export const load: PageServerLoad = async ({ params, locals: { safeGetSession, supabase } }) => {
  const session = await safeGetSession()

  if (!session) {
    throw redirect(401, '/')
  }

  //convert param into useable collectionId for supabase
  const collectionId = parseInt(params.collectionId);

  /*
  Get session userId, verify edit access for this collection
  */
  const { user: { id } } = session
  const sessionUserId = id

  const permission = await checkCollectionEditPermissions({collectionId, sessionUserId, locals: { supabase }});

  const { verified, collectionInfo, responseError } = await permission;

  //refuse view access if not verified
  if (verified != true || responseError == true) { 
      console.warn(` Can not edit collection ${collectionId}. `)
      return {
          status: 401,
          redirect: "/collections"
      }
  }

  //select collection contents if view access is verified
  const selectCollectionContentsResponse: any = await selectCollectionContents({collectionId, locals: {supabase}});
  const { collectionContents, collectionReturned }: { collectionContents: any, collectionReturned: boolean } =  
  selectCollectionContentsResponse

  if ( verified == true ) {
      return { collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned };
  }
  else if ( verified == false || responseError == true ) {
      return {
          status: 403,
          redirect: "/collections"
      }
  }
}
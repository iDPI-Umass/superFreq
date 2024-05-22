import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { checkCollectionViewPermissions } from '$lib/resources/backend-calls/collections/select/checkCollectionViewPermissions';
import { selectCollectionContents } from '$lib/resources/backend-calls/collections/select/selectCollectionContents';
import { selectCollectionSocialsFollowsInfo } from '$lib/resources/backend-calls/collections/select/selectCollectionSocialsFollowsInfo';

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
    //convert param into useable collectionId for supabase
    const collectionId = parseInt(params.collectionId);

    /*
    Get visitor's userId, verify view access for this collection
    */
    const session = await safeGetSession()
    let sessionUserId

    if ( session ) {
        const { user: { id } } = session
        sessionUserId = id
    }

    const permission = await checkCollectionViewPermissions({collectionId, sessionUserId, locals: { supabase }});

    const { verified, collectionInfo, responseError } = await permission;

    //refuse view access if not verified
    if (verified != true || responseError == true) { 
        console.warn(` Can not return collection ${collectionId}. `)
        return {
            status: 404,
            redirect: "/collections"
        };
    }

    //select collection contents and get collection social graph if view access is verified
    const { collectionContents, collectionReturned } =  await selectCollectionContents({collectionId, locals: {supabase}});
    let socialData
    let socialResponseStatus
    if ( session ){
        let { socialData, socialResponseStatus } = await selectCollectionSocialsFollowsInfo({collectionId, sessionUserId, locals: {supabase}});
    }

    console.log(collectionReturned)
 
    //Get data for follow button funcitonality on client side
    let isFollowing = false;
    let followButtonStatus = false;
    for ( const socialItem in socialData ) {
        const socialId = socialData[socialItem]["user_id"];
        const followsNow = socialData[socialItem]["follows_now"];
        if ( socialId == sessionUserId && followsNow == true) {
            isFollowing = true;
            followButtonStatus = true;
        }
    }

    if ( verified == true ) {
        return { collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned, socialData, socialResponseStatus, isFollowing, followButtonStatus };
    }
    else if ( verified == false || responseError == true ) {
        return {
            status: 302,
            redirect: "/collections"
        }
    }
  }

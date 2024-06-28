import type { PageServerLoad } from './$types';
import { checkCollectionViewPermissions } from '$lib/resources/backend-calls/checkSesssionUserPermissions';
import { selectCollectionContents, selectCollectionSocialsFollowsInfo } from '$lib/resources/backend-calls/collectionSelectFunctions';

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
    if ( verified != true || responseError ) { 
        console.warn(` Can not return collection ${collectionId}. `)
        return {
            status: 401,
            redirect: "/collections"
        }
    }

    //select collection contents and get collection social graph if view access is verified
    const selectCollectionContentsResponse: any = await selectCollectionContents({collectionId, locals: {supabase}});
    const { collectionContents, collectionReturned }: { collectionContents: any, collectionReturned: boolean } =  
    selectCollectionContentsResponse
    let socialData: any
    let socialResponseStatus: number
    if ( session ){
        const sessionData = await selectCollectionSocialsFollowsInfo({collectionId, sessionUserId, locals: {supabase}});
        ({ socialData, socialResponseStatus } = sessionData)
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
            status: 403,
            redirect: "/collections"
        }
    }
  }

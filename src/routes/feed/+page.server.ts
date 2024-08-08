import type { PageServerLoad } from './$types'
import { db } from 'src/database.ts'
import { selectCollectionFollowsFeed } from '$lib/resources/backend-calls/users/feed/selectCollectionFollowsFeed';
import { selectSocialFollows } from '$lib/resources/backend-calls/users/profile/select/selectSocialFollows';
import { selectSocialFollowsActivity } from '$lib/resources/backend-calls/users/selectSocialFollowsActivity';
import { selectFollowedUsersCollectionsActivity } from '$lib/resources/backend-calls/users/feed/selectFollowedUsersCollectionsActivity';

export const load: PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    // get userId from session
    const session = await safeGetSession()
    const sessionUserId = session.user?.id as string

    // set time frame for fetching updates
    const daysToFetch = 7;
    const to = new Date();
    const sevenDaysAgo = to.getTime() - daysToFetch*24*60*60*1000;
    const from = new Date(sevenDaysAgo)
    

    // const feedData = await db.transaction().execute(async (trx) => {
    //     const userFollows = await trx
    //     .selectFrom('social_graph')
    //     .select('target_user_id')
    //     .where(({eb, and, not, exists}) => and([
    //         eb('user_id', '=', sessionUserId),
    //         eb('follows_now', '=', true),

    //     ]))
    // })
    /*
    Get collections user follows, exclude ones that have become private.
    */
    
    const collectionsFollowing = await selectCollectionFollowsFeed({ sessionId, locals: { supabase }});

    /* 
    Get activity for users that user follows
    */

    // Get graph of users that user follows
    const id = sessionId;
    const { socialGraph } = await selectSocialFollows({ id, locals: { supabase }});

    // Create array of ids for users that user follows
    let targetUserIdArray = [];
    for ( const user in socialGraph ) {
        targetUserIdArray = [...targetUserIdArray, 
            socialGraph[user]["user_id"]
        ];
    }

    // Get social activity of users that user follows
    const socialFollowsActivity = await selectSocialFollowsActivity({ targetUserIdArray, locals: { supabase }});

    /*
    Get collections of users that user follows.
    */
    
    const followedCollectionsActivity = await selectFollowedUsersCollectionsActivity({ targetUserIdArray, sessionId, locals: { supabase }});


    return { collectionsFollowing, socialGraph, socialFollowsActivity, followedCollectionsActivity };
}
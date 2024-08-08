import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { selectUser } from '$lib/resources/backend-calls/users/profile/select/selectUser'
import { selectProfileUsersCollections } from '$lib/resources/backend-calls/collections/select/selectProfileUsersCollections'
import { selectSocialFollows } from '$lib/resources/backend-calls/users/profile/select/selectSocialFollows'
import { selectCollectionFollows } from '$lib/resources/backend-calls/users/feed/selectCollectionFollowsFeed'
import { selectUserCollectionFollows } from '$lib/resources/backend-calls/users/profile/select/selectUserCollectionFollows'
import { selectUserFollow } from '$lib/resources/backend-calls/users/profile/select/selectUserFollow'


export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
  //username for profile being viewed
  let profileUsername = params.username;
  profileUsername = profileUsername.toString()

  //get profile data for that user
  const  profileData = await selectUser({ profileUsername, locals: { supabase } })
  const profileUserId = profileData["id"]

  // set time frame for fetching updates
  const daysToFetch = 36500
  const to = new Date()
  const sevenDaysAgo = to.getTime() - daysToFetch*24*60*60*1000;
  const from = new Date(sevenDaysAgo)

  const timeFrame = {
      "from": from.toISOString(),
      "to": to.toISOString()
  }

  /*
  Get list of collections visiting user has view access for
  */

  // get info for all of the profile user's collections
  const profileCollections = await selectProfileUsersCollections({ profileUserId, locals: { supabase }})

  //get id for vistor from session to check permissions
  const session = await safeGetSession()
  const sessionUserId = session.user?.id

  //create seperate arrays of public/open collections and private collections
  let viewableCollections = [];
  for (const collection in profileCollections) {
    const status = profileCollections[collection]["status"]
    const ownerId = profileCollections[collection]["owner_id"]
    const userRole = profileCollections[collection]["user_role"]
    const socialUserId = profileCollections[collection]["user_id"]
    if ( status == "open" || status == "public") {
      viewableCollections = [...viewableCollections,
        profileCollections[collection]
      ]
    }
    else if ( ownerId == sessionUserId ) {
      viewableCollections = [...viewableCollections,
        profileCollections[collection]
      ]
    }
    else if ( status == "private " && userRole == "collaborator" && socialUserId == sessionUserId) {
      viewableCollections = [...viewableCollections,
        profileCollections[collection]
      ]
    }
  }

  /*
  Get info about what users and collections user followers
  */
  const followsUsers = await selectSocialFollows({ profileUserId, locals: { supabase }})
  const followsCollections = await selectUserCollectionFollows({ profileUserId, locals: { supabase }})

  let followButtonStatus = false

  if ( session ) {
    /*
    Get data for follow button funcitonality on client side
    */
    const { isFollowing, responseStatus } = await selectUserFollow({ profileUserId, sessionUserId, locals: { supabase }})

    const selectUserFollowResponseStatus = responseStatus

    //determines follow button state
    
    if ( isFollowing.length > 0 && isFollowing[0]["follows_now"] == true  ) {
      followButtonStatus = true
    }

    return { profileData, viewableCollections, followsUsers, followsCollections, isFollowing, selectUserFollowResponseStatus, profileUserId, session, sessionUserId, followButtonStatus }
  }
  else {
    return { profileData, viewableCollections, followsUsers, followsCollections, profileUserId }
  }
}
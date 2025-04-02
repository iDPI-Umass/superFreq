export const feedData = $state({
    'profileUsername': '',
    'profileUserId': '',
    'feedItems': []
}) as any

export const userProfile = $state({
    'username': '',
    'display_name': '',
    'user_id': '',
    'avatar_url': '',
    'last_fm_avatar_url': '',
    'avatar_release_group_name': '',
    'avatar_artist_name': '',
    'website': ''
})

export const userProfileReset = {
    'username': '',
    'display_name': '',
    'user_id': '',
    'avatar_url': '',
    'last_fm_avatar_url': '',
    'avatar_release_group_name': '',
    'avatar_artist_name': '',
    'website': ''
}

export const promiseStates: {
    continueClientSideImgPromise: boolean
    newItemAdded: boolean
    imgPromise: any
} = $state({
    'continueClientSideImgPromise': true,
    'newItemAdded': false,
    'imgPromise': null
})
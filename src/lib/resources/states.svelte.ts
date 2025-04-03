export const feedData = $state({
    'profileUsername': '',
    'profileUserId': '',
    'feedItems': []
}) as any

export const sessionUserProfile = $state({
    'user_id': null as string | null,
    'username': null as string | null,
    'display_name': null as string | null,
    'avatar_url': null as string | null,
    'last_fm_avatar_url': null as string | null,
    'avatar_release_group_name': null as string | null,
    'avatar_artist_name': null as string | null,
    'website': null as string | null
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

export const viewProfile = $state({
    'user_id': '',
    'username': '',
    'display_name': '',
    'about': '',
    'avatar_url': '',
    'last_fm_avatar_url': '',
    'avatar_release_group_name': '',
    'avatar_artist_name': '',
    'website': '',
    'metrics': {} as App.RowData,
    'topAlbumsCollection': [] as App.RowData
})

export const promiseStates = $state({
    'continueClientSideImgPromise': true,
    'newItemAdded': false,
    'imgPromise': null as any
})

export const collectionData = $state({
    'title': null as string | null,
    'mode': null as string | null,
    'singleItem': {} as App.RowData,
    'collectionItems': [] as App.RowData[],
    'deletedItems': [] as App.RowData[],
    'defaultSort': null as string | null,
    'status': null as string | null,
    'type': null as string | null,
    'descriptionText': null as string | null,
    'updatedAt': null  as Date | null
}) 
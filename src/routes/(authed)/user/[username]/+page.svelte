<script lang="ts">
    import { goto } from '$app/navigation'
    import { enhance } from '$app/forms'

    import SEO from '$lib/components/layout/SEO.svelte'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte';
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from "$lib/components/GridList.svelte"
	import NewNowPlayingPost from '$lib/components/Posts/NewNowPlayingPost.svelte'
    import Feed from '$lib/components/Feed.svelte'
	import NowPlayingPostsSample from '$lib/components/Posts/NowPlayingPostsSample.svelte'
    import CoverArt from '$lib/components/CoverArt.svelte'
    import InfoBox from '$lib/components/InfoBox.svelte'

    import { collectionData, viewProfile, feedData } from '$lib/resources/states.svelte.js'


    let { data, form } = $props();

    let { sessionUserId, profileData, feedItems, selectedOptions, remaining, sessionUserCollections, updatesPageUpdatedAt }: {
        sessionUserId: string
        profileData: any
        feedItems: any
        totalAvailableItems: number
        remaining: number
        profileUsername: string | null
        sessionUserCollections: App.RowData[]
        updatesPageUpdatedAt: string
    } = $derived(data)

    let { profileUserData, followInfo, permission, profileUserBlockInfo, profileUserFlagInfo } = $derived(profileData)

    let topAlbumsReturned = $derived( viewProfile.topAlbumsCollection.length > 0 ? true : false)
    
    let followingNow = $derived(followInfo?.follows_now ?? false)
    let profileUserBlocked = $derived(profileUserBlockInfo?.active ?? false)
    let profileUserFlagged = $derived(profileUserFlagInfo?.active ?? false)

    let avatarItem = $derived({
        'img_url': viewProfile.avatar_url,
        'last_fm_img_url': viewProfile.last_fm_avatar_url,
        'artist_name': viewProfile.avatar_artist_name,
        'release_group_name': viewProfile.avatar_release_group_name
    })

    let isSessionUserProfile = $derived(( viewProfile.user_id == sessionUserId ) ? true : false )

    let showCollectionsListModal = $derived(form?.showCollectionsModal ?? false)
    let showSaveSucessModal = $derived(form?.updateSuccess ?? false)

    let followLoading = $state(false)

    $effect(() => {
        viewProfile.user_id = profileUserData?.id as string
        viewProfile.username = profileUserData?.username as string
        viewProfile.display_name = profileUserData?.display_name as string
        viewProfile.about = profileUserData?.about as string
        viewProfile.avatar_url = profileUserData?.img_url as string
        viewProfile.last_fm_avatar_url = profileUserData?.last_fm_img_url as string
        viewProfile.avatar_artist_name = profileUserData?.avatar_artist_name as string
        viewProfile.avatar_release_group_name = profileUserData?.avatar_release_group_name as string

        viewProfile.metrics.collectionCount = permission ? profileData?.collectionCount as number : null
        viewProfile.metrics.collectionFollowingCount = permission ? profileData?.collectionFollowingCount as number : null
        viewProfile.metrics.userFollowingCount = permission ? profileData?.userFollowingCount as number : null
        viewProfile.metrics.nowPlayingPostsCount = permission ? profileData?.nowPlayingPostsCount as number : null
        viewProfile.topAlbumsCollection = permission ? profileData?.topAlbumsCollection.slice(0, 8) as App.ProfileObject[] : []

        collectionData.collectionItems = profileData?.topAlbumsCollection

        feedData.selectedOptions = selectedOptions
        feedData.feedItems = feedItems
    })
    

</script>

<SEO title="{viewProfile.display_name}'s Profile"></SEO>

<div class="profile-info">
    <div class="profile-info-box-left">
        <div class="avatar-user-data">
            <div class="cover-art-widget">
                <div class="avatar-image">
                    <CoverArt
                        item={avatarItem}
                        altText={`${viewProfile.display_name}'s avatar: ${viewProfile.avatar_release_group_name} by ${viewProfile.avatar_artist_name}`}
                    ></CoverArt>
                </div>
                {#if isSessionUserProfile}
                    <button 
                        class="mini"
                        onclick={() => goto('/account')}
                    >
                        edit
                    </button>
                {/if}
            </div>
            <div class="profile-info-box-column">
                <div class="profile-user-data-column">
                    <div class="profile-displayname-username-column">
                        <h2>{viewProfile.display_name}</h2>
                        <p class="data-muted">{viewProfile.username}</p>
                    </div>
                    <p class="profile-about">{viewProfile.about ?? ''}</p>
                    <a class="profile-website" href={viewProfile.website ?? ''}>{viewProfile.website ?? ''}</a>
                </div>
            </div>
        </div>
        <div class="profile-buttons-group">
            {#if isSessionUserProfile }
                <button class="double-border-top" onclick={() => goto('/account')}>
                    <div class="inner-border-condensed">
                        edit profile
                    </div>
                </button>
                <!-- <button class="double-border-top">
                    <div class="inner-border-condensed">
                        <div class="buttons-group-icon">
                            <Settings size="16"></Settings>
                        </div>
                    </div>
                </button> -->
            {:else}
                <form
                    method="POST"
                    action="?/followUser"
                    use:enhance={(form) => {
                        followLoading = true
                        return async ({ update }) => {
                            await update();
                            followLoading = false
                        }

                    }}
                >
                    <input 
                        type="hidden"
                        name="profile-user-id" 
                        id="profile-user-id"
                        value={viewProfile.user_id}
                    />
                    <button 
                        class="standard" 
                        type="submit"
                        formaction="?/followUser"
                        disabled={followLoading}
                    >
                    {#if followingNow == true}
                        unfollow
                    {:else}
                        + follow
                    {/if}
                    </button>  
                </form>
                <UserActionsMenu
                    mode='profileMenu'
                    blocked={profileUserBlocked}
                    flagged={profileUserFlagged}
                    profileUserId={viewProfile.user_id}
                    success={form?.userActionSuccess}
                ></UserActionsMenu>
            {/if}
        </div>
    </div>
    <div class="profile-info-box-right">
        <div class="profile-stats-box" aria-label="user metrics">
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{viewProfile.username}/collections">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {viewProfile.metrics.collectionCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        collections 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{viewProfile.username}/now-playing-posts">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {viewProfile.metrics.nowPlayingPostsCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        posts 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{viewProfile.username}/collections-following">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {viewProfile.metrics.collectionFollowingCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        collections followed 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{viewProfile.username}/users-following">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {viewProfile.metrics.userFollowingCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        users followed
                    </p>
                </a>
            </div>
        </div>
        
    </div>
</div>
<div class="border-full-vw"></div>

<div class="content">
    {#if viewProfile.topAlbumsCollection && viewProfile.topAlbumsCollection.length > 0}
    <div class="panel-medium">
        <PanelHeader>
            {#snippet headerText()}
                <span >top albums</span>
            {/snippet}
            {#snippet button()}
                <span >   
                    {#if viewProfile.user_id == sessionUserId}
                        <button class="standard" onclick={() => goto(`/user/top-albums`)}>
                            edit
                        </button>
                    {/if}
                </span>
            {/snippet}
        </PanelHeader>
        <GridList
            collectionReturned={topAlbumsReturned}
            collectionType="release_groups"
            showTags={false}
            layout="condensed-grid"
            mode="view"
        >
        </GridList>
    </div>
    {:else if viewProfile.topAlbumsCollection?.length == 0 && viewProfile.user_id == sessionUserId}
    <div class="panel-medium">
        <PanelHeader>
            {#snippet headerText()}
                <span >top albums</span>
            {/snippet}
        </PanelHeader>
        <div class="panel-button-buffer">
            <button class="standard" onclick={() => goto(`/user/top-albums`)}>
                choose your top albums
            </button>
        </div>
       
    </div>
    {/if}
    {#if viewProfile.user_id == sessionUserId}
        <InfoBox mode="compact">
            New <a href="/about/updates#updates">updates and bug fixes</a> as of {updatesPageUpdatedAt}
        </InfoBox>
        <NewNowPlayingPost></NewNowPlayingPost>
        <Feed
            sessionUserId={sessionUserId}
            mode="feed"
            feedItems = {feedItems}
            postEditState={form?.editState}
            userActionSuccess={form?.userActionSuccess}
            remaining={remaining}
            collections={sessionUserCollections}
            showCollectionsListModal={showCollectionsListModal}
            showSaveSucessModal={showSaveSucessModal}
            showFilters={true}
        ></Feed>
    {:else}
        <NowPlayingPostsSample
            sessionUserId={sessionUserId}
            posts={feedItems}
            displayName={viewProfile.display_name}
            username={viewProfile.username}
            userActionSuccess={form?.userActionSuccess}
            remaining={remaining}
            collections={sessionUserCollections}
            showCollectionsListModal={showCollectionsListModal}
            showSaveSucessModal={showSaveSucessModal}
        ></NowPlayingPostsSample>
    {/if}
</div>

<style>
    .content {
        max-width: var(--freq-desktop-width);
    }
    .cover-art-widget {
        position: relative;
    }
    .avatar-image {
        position: relative;
        z-index: -1;
    }
    button.mini {
        position: absolute;
        z-index: 0;
        top: 0;
    }
</style>
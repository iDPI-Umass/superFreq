<script lang="ts">
    import type { ActionData, PageData } from './$types.js'
    import { goto } from '$app/navigation'
    import { enhance } from '$app/forms'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte';
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from "$lib/components/GridList.svelte"
	import NewNowPlayingPost from '$lib/components/Posts/NewNowPlayingPost.svelte'
    import Feed from '$lib/components/Feed.svelte'
	import NowPlayingPostsSample from '$lib/components/Posts/NowPlayingPostsSample.svelte'
    import CoverArt from 'src/lib/components/CoverArt.svelte'

    interface Props {
        data: any;
        form: ActionData;
    }

    let { data, form }: Props = $props();

    let { sessionUserId, profileData, feedItems, profileUsername, posts }: {
        sessionUserId: string
        profileData: any
        feedItems: any
        profileUsername: string
        posts: App.RowData[]
    } = $derived(data)

    let { profileUserData, followInfo, permission, profileUserBlockInfo, profileUserFlagInfo } = $derived(profileData)

    const profileUserId = $derived(profileUserData?.id as string)

    let collectionCount = $derived(permission ? profileData?.collectionCount as number : null)
    let collectionFollowingCount = $derived(permission ? profileData?.collectionFollowingCount as number : null)
    let userFollowingCount = $derived(permission ? profileData?.userFollowingCount as number : null)
    let nowPlayingPostsCount = $derived(permission ? profileData?.nowPlayingPostsCount as number : null)
    let topAlbumsCollection = $derived(permission ? profileData?.topAlbumsCollection as App.ProfileObject[] : null)

    let topAlbumsReturned = $derived( topAlbumsCollection ? true : false)
    
    let followingNow = $derived(followInfo?.follows_now ?? false)
    let profileUserBlocked = $derived(profileUserBlockInfo?.active ?? false)
    let profileUserFlagged = $derived(profileUserFlagInfo?.active ?? false)

    let displayName = $derived(profileUserData?.display_name as string)

    let imgUrl = $derived(profileUserData?.avatar_url as string)
    let lastFmImgUrl = $derived(profileUserData?.last_fm_img_url as string)
    let avatarArtistName = $derived(profileUserData?.avatar_artist_name as string)
    let avatarReleaseGroupName = $derived(profileUserData?.avatar_release_group_name as string)

    let avatarItem = $derived({
        'img_url': imgUrl,
        'last_fm_img_url': lastFmImgUrl,
        'artist_name': avatarArtistName,
        'release_group_name': avatarReleaseGroupName
    })

    let isSessionUserProfile = $derived(( profileUserData?.id == sessionUserId ) ? true : false )

</script>

<svelte:options runes={true} />
<svelte:head>
	<title>
		{displayName}'s Profile
	</title>
</svelte:head>


<div class="profile-info">
    <div class="profile-info-box-left">
        <div class="avatar-user-data">
            <div class="cover-art-widget">
                <div class="avatar-image">
                    <CoverArt
                        item={avatarItem}
                        altText={`${displayName}'s avatar: ${avatarReleaseGroupName} by ${avatarArtistName}`}
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
                        <h2>{profileUserData?.display_name}</h2>
                        <p class="data-muted">{profileUserData?.username}</p>
                    </div>
                    <p>{profileUserData?.about ?? ''}</p>
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
                    use:enhance
                >
                    <input 
                        type="hidden"
                        name="profile-user-id" 
                        id="profile-user-id"
                        value={profileUserId}
                    />
                    <button 
                        class="standard" 
                        type="submit"
                        formaction="?/followUser"
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
                    profileUserId={profileUserId}
                    success={form?.userActionSuccess}
                ></UserActionsMenu>
            {/if}
        </div>
    </div>
    <div class="profile-info-box-right">
        <div class="profile-stats-box" aria-label="user metrics">
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{profileUsername}/collections">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {collectionCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        collections 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{profileUsername}/now-playing-posts">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {nowPlayingPostsCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        posts 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{profileUsername}/collections-following">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {collectionFollowingCount}
                        </p>
                    </div>
                    <p class="data-muted-uppercase">
                        collections followed 
                    </p>
                </a>
            </div>
            <div class="metric" aria-label="metric">
                <a class="metrics" href="/user/{profileUsername}/users-following">
                    <div class="numeral">
                        <p class="metric-numerals">
                            {userFollowingCount}
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
    {#if topAlbumsCollection && topAlbumsCollection.length > 0}
    <div class="panel-medium">
        <PanelHeader>
            {#snippet headerText()}
                <span >top albums</span>
            {/snippet}
            {#snippet button()}
                <span >   
                    {#if profileUserData?.id == sessionUserId}
                        <button class="standard" onclick={() => goto(`/user/top-albums`)}>
                            edit
                        </button>
                    {/if}
                </span>
            {/snippet}
        </PanelHeader>
        <GridList
            collectionContents={topAlbumsCollection}
            collectionReturned={topAlbumsReturned}
            collectionType="release_groups"
            layout="condensed-grid"
            mode="view"
        >
        </GridList>
    </div>
    {:else if topAlbumsCollection?.length == 0 && profileUserData?.id == sessionUserId}
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
    {#if profileUserData?.id == sessionUserId}
        <NewNowPlayingPost></NewNowPlayingPost>
        <Feed
            sessionUserId={sessionUserId}
            feedItems={feedItems}
            mode="mini"
            userActionSuccess={form?.userActionSuccess}
        ></Feed>
    {:else}
        <NowPlayingPostsSample
            posts={feedItems}
            displayName={displayName}
            username={profileUsername}
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
        z-index: 0;
    }
    button.mini {
        position: absolute;
        z-index: 1;
        top: 0;
    }
</style>
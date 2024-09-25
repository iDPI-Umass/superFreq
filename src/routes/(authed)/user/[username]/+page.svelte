<script lang="ts">
    import type { ActionData, PageData } from './$types.js'
    import { goto } from '$app/navigation'
    import { enhance } from '$app/forms'
    import { username } from '$lib/resources/localStorage'
    import Settings from 'lucide-svelte/icons/settings'
    import UserActionsMenu from '$lib/components/menus/UserActionsMenu.svelte';
    import PanelHeader from '$lib/components/PanelHeader.svelte'
    import GridList from "$lib/components/GridList.svelte"
	import { Info } from 'lucide-svelte';
	import NewNowPlayingPost from '$lib/components/Posts/NewNowPlayingPost.svelte';
    import MiniFeed from '$lib/components/MiniFeed.svelte'
	import NowPlayingPostsSample from 'src/lib/components/Posts/NowPlayingPostsSample.svelte';

    export let data: PageData
    export let form: ActionData

    let { sessionUserId, profileData, feedItems, profileUsername, posts } = data
    $: ({ sessionUserId, profileData, feedItems, profileUsername, posts } = data) 

    let { profileUserData, followInfo, permission, profileUserBlockInfo, profileUserFlagInfo } = profileData

    $: ({ profileUserData, followInfo, permission, profileUserBlockInfo, profileUserFlagInfo } = profileData)

    const profileUserId = profileUserData?.id as string

    $: collectionCount = permission ? profileData.collectionCount as number : null
    $: collectionFollowingCount = permission ? profileData.collectionFollowingCount as number : null
    $: userFollowingCount = permission ? profileData.userFollowingCount as number : null
    $: nowPlayingPostsCount = permission ? profileData.nowPlayingPostsCount as number : null
    $: topAlbumsCollection = permission ? profileData.topAlbumsCollection as App.ProfileObject[] : null

    $: topAlbumsReturned = false
    if ( topAlbumsCollection ) {
        topAlbumsReturned = true
    }
    
    $: followingNow = form?.followStatus ?? followInfo?.follows_now ?? false
    $: profileUserBlocked = form?.blockStatus ?? profileUserBlockInfo?.active ?? false
    $: profileUserFlagged = form?.flagStatus ?? profileUserFlagInfo?.active ?? false

    $: displayName = profileUserData?.display_name as string
</script>

<svelte:head>
	<title>
		{displayName}'s Profile
	</title>
</svelte:head>


<div class="profile-info">
    <div class="profile-info-box-left">
        <img src={profileUserData?.avatar_url} alt="${profileUserData?.display_name}'s avatar" />
        <div class="profile-info-box-column">
            <div class="profile-username-buttons-row">
                <div class="profile-displayname-username-column">
                    <h1>{profileUserData?.display_name}</h1>
                    <p class="data-muted">{profileUserData?.username}</p>
                </div>
                <div class="profile-buttons-group">
                {#if profileUserData?.id == sessionUserId }
                    <button class="double-border-top" on:click={() => goto('/account')}>
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
                        success={form?.success}
                    ></UserActionsMenu>
                {/if}
                </div>
            </div>
            <p>{profileUserData?.about ?? ''}</p>
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
            top albums
            {#if profileUserData?.id == sessionUserId}
            <button class="standard" on:click={() => goto(`./${username}/top-albums`)}>edit</button>
            {/if}
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
            top albums
        </PanelHeader>
        <div class="panel-button-buffer">
            <button class="standard" on:click={() => goto(`/user/top-albums`)}>
                choose your top albums
            </button>
        </div>
       
    </div>
    {/if}
    {#if profileUserData?.id == sessionUserId}
        <NewNowPlayingPost></NewNowPlayingPost>
        <MiniFeed
            feedItems={feedItems?.feedData}
        ></MiniFeed>
    {:else}
        <NowPlayingPostsSample
            posts={posts}
            displayName={displayName}
            username={profileUsername}
        ></NowPlayingPostsSample>
    {/if}
</div>

<style>
    .content {
        max-width: var(--freq-desktop-width);
    }
</style>
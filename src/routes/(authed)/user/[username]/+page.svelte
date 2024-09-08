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

    export let data: PageData
    export let form: ActionData
    $: data

    let { sessionUserId, profileData } = data
    $: ({ sessionUserId, profileData } = data) 

    const { profileUserData, followInfo, permission, profileUserBlockInfo, profileUserFlagInfo } = profileData

    const profileUserId = profileUserData?.id as string

    let collectionCount: number | null = null
    let collectionFollowingCount: number | null = null
    let userFollowingCount: number | null = null
    let nowPlayingPostsCount: number | null = null
    let topAlbumsCollection: App.RowData | null = null

    if ( permission ) {
        collectionCount = profileData['collectionCount'][0].count as number
        collectionFollowingCount = profileData['collectionFollowingCount'][0].count as number
        userFollowingCount = profileData['userFollowingCount'][0].count as number
        nowPlayingPostsCount = profileData['nowPlayingPostsCount'][0].count as number
        topAlbumsCollection = profileData.topAlbumsCollection as App.RowData
    }

    let topAlbumsReturned: boolean
    if ( topAlbumsCollection ) {
        topAlbumsReturned = true
    }
    
    const sessionUserBlocked = permission ? false : true
    $: followingNow = form?.followStatus ?? followInfo?.follows_now ?? false
    $: profileUserBlocked = form?.blockStatus ?? profileUserBlockInfo?.active ?? false
    $: profileUserFlagged = form?.flagStatus ?? profileUserFlagInfo?.active ?? false
</script>

<svelte:head>
	<title>
		{username}'s Profile
	</title>
</svelte:head>


<div class="profile-info">
    <div class="info-box-left">
        <img src={profileUserData?.avatar_url} alt="${profileUserData?.display_name}'s avatar" />
        <div class="info-box-column">
            <div class="username-buttons-row">
                <div class="displayname-username-column">
                    <h1>{profileUserData?.display_name}</h1>
                    <p class="data-muted">{profileUserData?.username}</p>
                </div>
                {#if profileUserData?.id == sessionUserId }
                    <div class="buttons-group">
                        <button class="double-border-top">
                            <div class="inner-border-condensed">
                                edit profile
                            </div>
                        </button>
                        <button class="double-border-top">
                            <div class="inner-border-condensed">
                                <div class="icon">
                                    <Settings size="16"></Settings>
                                </div>
                            </div>
                        </button>
                    </div>
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
            <p>{profileUserData?.about ?? ''}</p>
        </div>
    </div>
    <div class="info-box-right">
        <div class="stats-box" aria-label="user metrics">
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        {collectionCount}
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    collections 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        {nowPlayingPostsCount}
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    now playing posts 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        {collectionFollowingCount}
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    collections followed 
                </p>
            </div>
            <div class="metric" aria-label="metric">
                <div class="numeral">
                    <p class="metric-numerals">
                        {userFollowingCount}
                    </p>
                </div>
                <p class="data-muted-uppercase">
                    users followed
                </p>
            </div>
        </div>
    </div>
</div>
<div class="border-full-vw"></div>

<div class="panel-medium">
    {#if topAlbumsCollection?.length > 0}
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

    {:else if topAlbumsCollection?.length == 0 && profileUserData?.id == sessionUserId}
    <PanelHeader>
        top albums
    </PanelHeader>
    <div class="placeholder">
        <button class="standard" on:click={() => goto(`./${username}/top-albums`)}>
            choose your top albums
        </button>
    </div>
    {/if}

</div>

<style>
    .profile-info {
        display: flex;
        flex-direction: row;
        width: 100%;
    }
    .profile-info img {
        width: var(--freq-image-thumbnail-medium);
        height: var(--freq-image-thumbnail-medium);
    }
    .profile-info h1{
        font-size: var(--freq-font-size-medium);
    }
    .info-box-left {
        display: flex;
        flex-direction: row;
        min-width: 40%;
        max-width: 50%;
        margin: var(--freq-height-spacer) var(--freq-width-spacer-half) var(--freq-height-spacer) var(--freq-width-spacer);
        gap: var(--freq-spacer-gap);
        align-items: start;
    }
    .info-box-column {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: var(--freq-inline-gap);
    }
    .username-buttons-row {
        display: flex;
        flex-direction: row;
        width: auto;
        align-items: start;
        justify-content: space-between;
    }
    .displayname-username-column {
        display: flex;
        flex-direction: column;
    }
    .displayname-username-column * {
        padding: 0;
        margin: 0;
    }
    .buttons-group {
        display: flex;
        flex-direction: row;
        margin-left: auto;
        margin-right: 4px;
        gap: var(--freq-spacer-gap-half);
    }
    .icon {
        display: flex;
        height: 11px;
        align-items: center;
    }
    .info-box-right {
        display: flex;
        flex-direction: row;
        max-width: 50%;
        border-left: var(--freq-border-panel);
        margin-top: -5px;
        align-items: flex-start;
    }
    .stats-box {
        display: flex;
        flex-direction: row;
        margin: var(--freq-spacing-x-large) var(--freq-spacing-large);
        padding: var(--freq-spacing-medium);
        background: var(--freq-grid-light-background);
        gap: var(--freq-spacer-gap);
        align-items: center;
    }
    .metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--freq-spacer-gap-quarter);
    }
    .metric * {
        margin: 0px;
        padding: 0px;
    }
    .metric .numeral {
        display: flex;
        flex-direction: column;
        background: var(--freq-color-panel-background); 
        padding: 0px 10px;
    }
    .placeholder {
        display: flex;
        background-color: var(--freq-background-grid-fallback);
        align-items: center;
        justify-content: center;
        height: 100px;
    }
    .placeholder p {
        background-color: var(--freq-color-panel-background);
        padding: var(--freq-height-spacer-half) var(--freq-width-spacer-half);
    }
</style>
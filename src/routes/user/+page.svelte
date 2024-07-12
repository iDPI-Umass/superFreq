<script lang="ts">
    import type { PageData } from './$types';
    import { categoryParser, displayDate, profileName } from '$lib/resources/parseData.ts';
    import { insertUserFollow } from '$lib/resources/backend-calls/users/profile/insert/insertUserFollow';
    import { updateUserFollow } from '$lib/resources/backend-calls/users/profile/update/updateUserFollow';
	
	export let data: PageData;
    let { supabase, profileData, viewableCollections, followsUsers, followsCollections, isFollowing,selectUserFollowResponseStatus, profileUserId, session, sessionUserId, followButtonStatus } = data;
    $: ({ supabase, profileData, viewableCollections, followsUsers, followsCollections, isFollowing, selectUserFollowResponseStatus, profileUserId, session, sessionUserId, followButtonStatus } = data);

    const { username, avatar_url, display_name } = profileData;
    console.log(isFollowing)

    /*
    Follow button functionality
    */

    //insert row in social graph if no row exists for visitor following user
    async function followButton() {
        if ( selectUserFollowResponseStatus != 200 ) {
            const insert =  await insertUserFollow({ profileUserId, sessionUserId, locals: { supabase }});
            let { insertedFollow, responseStatus } = insert;
            followButtonStatus = true;
            isFollowing = insertedFollow;
        }
        else {
            let { id, user_id, target_user_id, follows_now, updated_at, changelog } = isFollowing[0];

            //create entry in changelog archiving data selected
            const changelogLength = Object.keys(changelog["changelog"]).length
            const changelogEntryId = JSON.stringify(changelogLength + 1)

            changelog["changelog"][changelogEntryId]
             = {
                "user_id": new String(user_id),
                "target_user_id": new String(target_user_id),
                "follows_now": new Boolean(follows_now),
                "updated_at": new Date(updated_at)
            };

            //flip follows_now boolean
            if ( follows_now == true ) {
                followButtonStatus = false;
            }
            else {
                followButtonStatus = true;
            }

            //log new follow data and update row
            const followData = {
                "user_id": user_id,
                "target_user_id": target_user_id,
                "follows_now": followButtonStatus,
                "changelog": changelog
            };
            const update = await updateUserFollow({ id, followData, locals: { supabase }});
        }
    }
</script>

<div class="profile-header">
    <div class="left-header">
        <div class="header-block">
            <img src={avatar_url} alt="{profileName(username, display_name)}'s avatar"/>
            <div class="user-info-stack">
                <div class="user-info-top">
                    <div class="displayname-username-stack">
                        <h1>{
                            profileName(username, display_name)}
                        </h1>
                        <p class="username">
                            Username
                        </p>
                    </div>
                    {#if session && profileUserId != sessionUserId}
                        <button class="purple-border-button" on:click|preventDefault={followButton}>
                            {#if ( followButtonStatus == true )}
                                unfollow
                            {:else if ( followButtonStatus == false )}
                                + follow
                            {/if}
                        </button>
                    {/if}
                    </div>
                    <div class="user-info-bottom">
                        <p>
                            text text text text text text text
                        </p>
                    </div>
            </div>
        </div>
    </div>
    <div class="right-header">
        <div class="header-block">
            <div class="metrics-block">
                <div class="metrics-stack">
                    <h3><span>1234</span></h3>
                    <p>following</p>
                </div>
                <div class="metrics-stack">
                    <h3>56</h3>
                    <p>following</p>
                </div>
                <div class="metrics-stack">
                    <h3>789</h3>
                    <p>following</p>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="profile-body">
    <div class="body-columns">
        <h2>all collections</h2>
        {#each viewableCollections as collection}
            <div class="collection-listing">
                <h3>
                    <a href="/collection/{collection["collection_id"]}">
                        {collection["title"]}
                    </a>
                </h3>
                <p>
                    collection of {categoryParser(collection["type"])}, last updated {displayDate(collection["updated_at"])}
                </p>
            </div>
        {/each}
    </div>
    <div class="body-columns">
        <h2>following</h2>
        <h3>users</h3>
        {#each followsUsers as user}
            <p>
                <a href="/user/{user["username"]}">
                    {profileName(user["username"], user["display_name"])}
                </a>
            </p>
        {/each}
        <h3>collections</h3>
        {#each followsCollections as collection}
            <p>
                <a href="/collection/{collection["collection_id"]}">
                    {collection["title"]}
                </a>
            </p>
        {/each}
    </div>
</div>


<style>
    .profile-header{
        display: flex;
        flex-direction: row;
        max-height: 200px;
        max-width: 100%;
        padding: 0 4vw;
        border-bottom: 1px solid var(--dark-mode-secondary-color);
        align-items: center;
    }
    .profile-header img {
        max-width: 100px;
        max-height: 100px;
    }
    .profile-header h1 {
        margin: 0;
        font-size: 3vw;
    }
    .left-header {
        width: 50%;
        border-right: 1px solid var(--dark-mode-secondary-color);

    }
    .right-header {
        width: 50%;
    }
    .header-block {
        display: flex;
        flex-direction: row;
        margin: 2vh auto;
        gap: 2rem;
    }
    .user-info-stack {
        display: flex;
        flex-direction: column;
    }
    .user-info-top {
        display: flex;
        flex-direction: row;
        max-width: 100%;
        justify-content: space-between;
    }
    .user-info-bottom {
        max-width: 100%;
    }
    .displayname-username-stack {
        display: flex;
        flex-direction: column;
    }
    .username {
        font-family: 'Roboto', sans-serif;
        color: var(--dark-mode-secondary-color);
        font-size: 14px;
    }
    .metrics-block {
        display: flex;
        flex-direction: row;
        margin: 0 auto;
        padding: 2vh 2vw;
        background-color: var(--dark-mode-secondary-color);
        gap: 1.5rem;
    }
    .metrics-stack {
        display: flex;
        flex-direction: column;
        text-align: center;
    }
    .metrics-stack h3 {
        color: var(--freq-purple);
        margin: 0 auto;
    }
    span {
        background-color: var(--dark-mode-primary-color);
        line-height: 2;
    }
    .metrics-stack p {
        margin: 0 auto;
        font-size: 11px;
        text-transform: uppercase;
    }
    .profile-body{
        display: flex;
        flex-direction: column flex;
    }
    .collection-listing{
        border-bottom: 1px solid white;
    }
    .body-columns{
        max-width: 50%;
        margin: 0 1vw;
    }
    @media screen and (max-width: 600px) {
        .profile-header{
            display: flex;
            flex-flow: row wrap;
        }
        .left-header {
            width: 100%;
            border-bottom: 1px solid var(--dark-mode-secondary-color);
        }
        .right-header {
            width: 100%;
        }
    }
</style>
<script lang="ts">
	import type { PageData } from './$types';
    import { insertCollectionFollow } from '$lib/resources/database/collections/insertCollectionFollow';
    import { updateCollectionFollow } from '$lib/resources/database/collections/updateCollectionFollow';
	
	export let data: PageData;
    let { supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned, socialData, socialResponseStatus, isFollowing, followButtonStatus } = data;
    $: ({ supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned, socialData, socialResponseStatus, isFollowing, followButtonStatus } = data);

    const { title, updated_at, type, username, display_name } = collectionInfo[0];

    const categories = {
        "artists": "artists",
        "release_groups": "albums",
        "recording": "tracks"
    }

    const updatedAt = new Date(updated_at).toLocaleDateString();

     /*
    Follow button functionality
    */

    //insert row in social graph if no row exists for visitor following user
    async function followButton() {
        if ( socialData.length === 0 ) {
            const insert =  await insertCollectionFollow({ collectionId, sessionUserId, locals: { supabase }});
            let { insertedFollow, responseStatus } = insert;
            if ( responseStatus == 200) {
                followButtonStatus = true;
                isFollowing = insertedFollow;  
            }
            else {
                console.log(responseStatus);
            }
        }
        else {
            let { id, user_id, collection_id, user_role, follows_now, updated_at, changelog } = socialData[0];

            //create entry in changelog archiving data selected
            const changelogLength = Object.keys(changelog["changelog"]).length
            const changelogEntryId = JSON.stringify(changelogLength + 1)

            changelog["changelog"][changelogEntryId]
             = {
                "user_id": new String(user_id),
                "collection_id": new String(collection_id),
                "user_role": new String(user_role),
                "follows_now": new Boolean(follows_now),
                "updated_at": new Date(updated_at)
            }

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
                "collection_id": collection_id,
                "follows_now": followButtonStatus,
                "user_role": user_role,
                "updated_at": null,
                "changelog": changelog
            };
            const update = await updateCollectionFollow({ id, followData, locals: { supabase }});
        }
    }
</script>

<body>
    <div class="collection-container">
        <div class="collection-info">
            <div class="collection-title-follow-box">
                <h1>{title}</h1>
                {#if session && (sessionUserId != collectionInfo["owner_id"])}
                <button class="purple-border-button" on:click|preventDefault={followButton} disabled={!socialResponseStatus}>
                    {#if ( followButtonStatus == true )}
                        unfollow
                    {:else if ( followButtonStatus == false )}
                        + follow
                    {/if}
                </button>
            {/if}
            </div>
            <h2>
                Collection of {categories[type]} by 
                <a href="/user/{username}">
                    {display_name}
                </a>
            </h2>
            <h3>Last updated on {updatedAt}</h3>
            <p>{collectionInfo["description_text"]}</p>
        </div>
        <div class="sort">
            <p> sorting options </p>
        </div>
        {#if collectionReturned}
            {#if type == "artists"}
                <div class="collection-grid">
                    {#each collectionContents as contentItem}
                        <div class="grid-item">
                            <p>{contentItem["artists"]["artist_name"]}</p>
                        </div>
                    {/each}
                </div>
            {:else if type == "release_groups"}
                <div class="collection-grid">
                    {#each collectionContents as contentItem}
                        <div class="grid-item">
                            <img src={contentItem["release_groups"]["img_url"]} alt={contentItem["release_groups"]["release_group_name"]} />
                            <h2>{contentItem["release_groups"]["release_group_name"]}</h2>
                            <p>{contentItem["artists"]["artist_name"]}</p>
                        </div>
                    {/each}
                </div>
            {:else if type == "recordings"}
                <div class="collection-grid">
                    {#each collectionContents as contentItem}
                        <div class="grid-item">
                            <img src={contentItem["release_groups"]["img_url"]}  alt={contentItem["recordings"]["recording_name"]} />
                            <p>{contentItem["recordings"]["recording_name"]}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        {/if}
    </div>
</body>
<style>
    .collection-container {
        max-width: 900px;
        margin: 3vh 3vw;
        border: 1px solid var(--dark-mode-secondary-color);
        border-top: 3px double var(--dark-mode-secondary-color);
    }
    .collection-info {
        display: flex;
        flex-direction: column;
        width: inherit;
    }
    .collection-title-follow-box {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 2vw;
    }
    .collection-info h1 {
        font-size: xx-large;
    }
    .collection-info h2 {
        font-family: "Roboto" sans-serif;
        font-size: large;
        color: var(--dark-mode-secondary-color);
    }
    .collection-info h3 {
        font-family: "Roboto" sans-serif;
        font-size: medium;
        color: var(--dark-mode-secondary-color);
    }
    .sort {
        width: inherit;
        border-bottom: 1px solid var(--dark-mode-secondary-color);
        padding: 0 1vw;
        border-top: 1px double var(--dark-mode-secondary-color);
        border-bottom: 1px solid var(--dark-mode-secondary-color);
    }
    .collection-grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: minmax(min-content, max-content);
        width: 100%;
        background-color: var(--dark-mode-secondary-color);
        gap: 1px;
    }
    .grid-item {
        display: flex;
        flex-direction: column;
        width: 1fr;
        height: 100%;
        margin: auto;
        padding: 0 5%;
        background-color: black;
        justify-content: center;
        align-items: left;
    }
    .grid-item img {
        vertical-align: middle;
        width: 80%;
        margin: 10% auto;
    }
    .grid-item h2 {
        margin: 5% 10%;
        font-family: sans-serif;
        font-size: 16px;
    }
    .grid-item p {
        margin: 0 5% 10% 10%;
        color: var(--dark-mode-secondary-color);
        font-family: sans-serif;
    }
</style>
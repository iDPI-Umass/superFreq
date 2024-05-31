<script lang="ts">
    import { Toolbar } from "bits-ui"
    import LayoutGrid from 'lucide-svelte/icons/layout-grid'
    import AlignJustify from 'lucide-svelte/icons/align-justify'

    import "$lib/styles/media-grid-list.css"
    import "$lib/styles/metadata-formatting.css"
    import GridList from "$lib/components/GridList.svelte";

	import type { PageData } from './$types';
    import { insertCollectionFollow, updateCollectionFollow } from '$lib/resources/backend-calls/collectionInsertUpsertUpdateFunctions';
	
	export let data: PageData;
    let { supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned, socialData, socialResponseStatus, isFollowing, followButtonStatus } = data;
    $: ({ supabase, collectionId, verified, collectionInfo, session, sessionUserId, collectionContents, collectionReturned, socialData, socialResponseStatus, isFollowing, followButtonStatus } = data);

    let gridListSelect = "grid"
    collectionReturned = ( collectionReturned === undefined) ? false : true

    console.log(collectionContents )

    const { title, updated_at, type, username, display_name } = collectionInfo[0];

    const categories: App.Lookup = {
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
    console.log(collectionContents)
</script>

<body>
    <div class="collection-container">
        <div class="collection-info">
            <div class="collection-metadata">
                <div class="collection-title-follow-top-row">
                    <h1>{title}</h1>
                    {#if session && (sessionUserId != collectionInfo["owner_id"])}
                        <button class="standard" on:click|preventDefault={followButton} disabled={!socialResponseStatus}>
                            {#if ( followButtonStatus == true )}
                                unfollow
                            {:else if ( followButtonStatus == false )}
                                + follow
                            {/if}
                        </button>
                    {/if}
                </div>
            </div>
            <div class="frontmatter blurb-formatting">
                <p class="frontmatter-info-text">
                    Collection of {categories[type]} by 
                    <a href="/user/{username}">
                        {display_name}
                    </a>
                </p>
                <p class="frontmatter-date-text">Last updated on {updatedAt}</p>
                {#if collectionInfo["description_text"]}
                    <p>{collectionInfo["description_text"]}</p>
                {/if}
            </div>
        </div>

        <div class="sort">
            <p> sorting options </p>
            <Toolbar.Root>
                <Toolbar.Group
                    bind:value={gridListSelect}
                    type="single"
                >
                    <Toolbar.GroupItem
                        aria-label="grid"
                        value="grid"
                        class="toolbar-item"
                    >
                        <LayoutGrid class="grid-list-icon"></LayoutGrid>
                    </Toolbar.GroupItem>
                    <Toolbar.GroupItem
                    aria-label="list"
                    value="list"
                    class="toolbar-item"
                    >
                        <AlignJustify class="grid-list-icon"></AlignJustify>
                    </Toolbar.GroupItem>
                </Toolbar.Group>
            </Toolbar.Root>
            <p>{gridListSelect}</p>
        </div>
        <GridList
            collectionContents={collectionContents}
            collectionReturned={collectionReturned}
            collectionType={type}
            layout={gridListSelect}
            mode="view"
        >
        </GridList>

    </div>
</body>

<style>
    .collection-container {
        max-width: var(--freq-max-width-primary);
        margin: 3vh 3vw;
        border: var(--freq-border-panel);
    }
    .collection-info {
        display: flex;
        flex-direction: column;
        padding: var(--freq-width-spacer-half);
    }
    .collection-metadata * {
        margin: var(--freq-spacing-x-small) 0;
    }
    .collection-title-follow-top-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-right: 2vw;
    }
    .sort {
        display: flex;
        flex-direction: row;
        width: inherit;
        padding: 0 var(--freq-width-spacer-half);
        border-top: 1px solid var(--freq-color-background-badge);
        border-bottom: 1px solid var(--freq-color-background-badge);
        align-items: center;
    }
    .sort * {
        padding: var(--freq-spacing-2x-small) var(--freq-spacing-small);
    }
</style>
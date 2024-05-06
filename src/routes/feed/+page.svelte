<!--
    TO DO:
        - display collections and social activity of users that user is following
-->

<script lang="ts">
    import { formatDate } from '$lib/resources/parse-data/formatDate';
    import { profileName } from '$lib/resources/parse-data/profileName';
    
    export let data;
    let { supabase, session, collectionsFollowing, socialGraph, socialFollowsActivity, followedCollectionsActivity } = data;
    $: ({ supabase, session, collectionsFollowing, socialGraph, socialFollowsActivity, followedCollectionsActivity } = data);

</script>

<title>feed</title>
<h1>feed</h1>

<!--
    User follows block tk
{#each socialFollowsActivity as socialItem}
    {#if socialItem["follows_now"] == true }
    <p>
        {user_a} followed {user_b}
    </p>
    {/if}
{/each}
-->

{#each collectionsFollowing as collection}
    <p>
       <a href="/collection/{collection["collection_id"]}">{collection["collections_info"]["title"]}</a> updated
       <!--by {collection["collections_updates"]["updated_by"]}-->
       on {formatDate(collection["collections_info"]["updated_at"])}
    </p>
{/each}
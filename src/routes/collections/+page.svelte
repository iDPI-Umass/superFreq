<script lang="ts">
    import { profileName } from '$lib/resources/parse-data/profileName';
    import { formatDate } from '$lib/resources/parse-data/formatDate';

    export let data;
    let { allCollections } =  data;
    $: ({ allCollections } =  data);
    
</script>

<ul>
    {#each allCollections as collection}
    <li>
       <a href="/collection/{collection["collection_id"]}">{collection["title"]}</a> 
       by <a href="/user/{collection["profiles"]["username"]}"> {profileName(collection["profiles"]["username"], collection["profiles"]["display_name"])}</a>,
       last updated {formatDate(collection["updated_at"])}
    </li>
{/each}
</ul>

<style>
    ul {
        margin: 3vh 3vw;
    }
    li {
        font-family: sans-serif;
        font-size: large;
        margin: 1vh auto;
    }
</style>
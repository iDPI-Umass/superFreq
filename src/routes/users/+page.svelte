<script lang="ts">
    import type { PageData } from "./$types"
    import wave from "$lib/assets/images/logo/freq-wave.svg"

    export let data: PageData
    let { users } = data
    $: ({ users } = data)
</script>

<svelte:head>
	<title>
		Explore Users
	</title>
</svelte:head>


<h1>users</h1>
{#each users as user}
<ul>
    {#if user.username}
    <li>
        <a href="/user/{user.username}">
            <img src={user.avatar_url ?? wave} alt="{user.display_name}'s avatar" class="avatar" />
            <span class="display-name">{user.display_name}</span>
        </a>
    </li>
    {/if}
</ul>
{/each}

<style>
    h1 {
        margin: 3vh 3vw;
    }
    li {
        list-style: none;
    }
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 1rem;
    }
</style>
<script lang="ts">
    import type { PageData } from "./$types"

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
    <li>
        <a href="/user/{user.username}">
            <img src={user.avatar_url} alt="{user.display_name}'s avatar" class="avatar" />
            <span class="display-name">{user.display_name}</span>
        </a>
    </li>
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
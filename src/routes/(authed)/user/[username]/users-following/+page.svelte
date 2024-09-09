<script lang="ts">
    export let data

    let { profiles, profileDisplayName, username } = data
    $: ({ profiles, profileDisplayName, username } = data)
</script>

<svelte:head>
	<title>
		Users ${username} follows
	</title>
</svelte:head>

<h1>users {profileDisplayName} follows</h1>
{#each profiles as user}
<ul>
    <li>
        <a href="/user/${user.username}">
            <img src={user.avatar_url} alt="${user.display_name}'s avatar" class="avatar" />
            <span class="display-name">{user.display_name}</span>
        </a>
    </li>
</ul>
{/each}
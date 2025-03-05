<script lang="ts">
    import wave from "$lib/assets/images/logo/freq-wave.svg"
    interface Props {
        data: any;
    }

    let { data }: Props = $props();

    let { profiles, profileDisplayName, username } = $derived(data)
</script>

<!-- <svelte:options runes={true} /> -->
<svelte:head>
	<title>
		Users {username} follows
	</title>
</svelte:head>

<h1>users {profileDisplayName} follows</h1>
{#each profiles as user}
<ul>
    <li>
        <a href="/user/{user.username}">
            <img src={user.avatar_url ?? wave} alt="{user.display_name}'s avatar" class="avatar" />
            {user.display_name}
        </a>
    </li>
</ul>
{/each}

<style>
    a {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--freq-inline-gap-double);
        color: var(--freq-color-text);
        
    }
    li {
        list-style: none;
        font-size: var(--freq-font-size-x-large);
    }
</style>
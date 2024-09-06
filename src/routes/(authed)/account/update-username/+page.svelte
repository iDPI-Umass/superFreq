<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { PageData, ActionData } from './$types';
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import { profileStoresObject } from 'src/lib/stores.ts';

    export let data: PageData
	export let form: ActionData

	let { session, supabase, profile } = data
	$: ({ session, supabase, profile } = data)

    let profileForm: HTMLFormElement
    let loading = false
    let username: string = profile?.username ?? form?.currentUsername

    // sets new username to local storage
	const handleSubmit: SubmitFunction = () => {
        loading = true
		const profileStorageItem = {
			"displayName": profile?.display_name,
			"username": username,
			"avatarUrl": profile?.avatar_url
		}

        console.log(profileStorageItem)
		localStorage.setItem("profile", JSON.stringify(profileStorageItem))

		profileStoresObject.set(profileStorageItem)

		return async ({ result }) => {
			loading = false
		}
	}
</script>

<svelte:head>
	<title>
		Update Username
	</title>
</svelte:head>


<div class="panel" id="profile-info">
    <PanelHeader>
		update username
	</PanelHeader>
	<form
		class="horizontal"
		id="account-data"
		method="POST"
	>
    <div class="form-column">
        <label 
            class="text-label"  
            for="current-username"
            form="account-data"
        >
            Current Username
        </label>
        <input
            class="text"
            type="text"
            name="current-username"
            id="current-username"
            form="account-data"
            value={profile?.username} 
            disabled
        />
        <label 
            class="text-label"  
            for="new-username"
            form="account-data"
        >
            New Username
        </label>
        <input
            class="text"
            type="text"
            name="new-username"
            id="new-username"
            form="account-data"
            value={profile?.username} 
        />
        <button
            type="submit"
            class="double-border-top"
        >
            <div class="inner-border">
                submit
            </div>
        </button>
    </div>


    </form>
    {#if form?.failed }
    <dialog open>
        <form method="dialog">
            <button class="standard">x</button>
            <p>That username is not available. Please try another.</p>
        </form>
    </dialog>
    {/if}
</div>

<style>
    .panel {
        max-width: 500px;
    }
    input {
        max-width: 300px;
    }
</style>
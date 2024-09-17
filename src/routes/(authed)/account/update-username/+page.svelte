<script lang="ts">
    import { enhance } from '$app/forms';
    import type { SubmitFunction } from '@sveltejs/kit';
    import type { PageData, ActionData } from './$types';
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import { profileStoresObject } from 'src/lib/stores.ts';
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte';
	import RedirectModal from '$lib/components/modals/RedirectModal.svelte';

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
    <NotificationModal
        showModal={(form?.success ? !form?.success : false)}
    >
        <span slot="header-text">Username taken</span>
        <span slot="message">Please try another username.</span>
    </NotificationModal>
</div>

<RedirectModal
    showModal={form?.success ?? false}
    redirectPath='/account'
>
Username updated successfully. Redirecting to your account page in 5 seconds.
</RedirectModal>

<style>
    .panel {
        max-width: 500px;
    }
    input {
        max-width: 300px;
    }
</style>
<script lang="ts">
    import type { PageData, ActionData } from './$types'
    import PanelHeader from "$lib/components/PanelHeader.svelte"
    import Tooltip from '$lib/components/Tooltip.svelte'
    import NotificationModal from '$lib/components/modals/NotificationModal.svelte'
	import RedirectModal from '$lib/components/modals/RedirectModal.svelte'

    export let data: PageData
	export let form: ActionData

	let { profile } = data
	$: ({ profile } = data)

    let loading = false
    let username = profile?.username as string

</script>

<svelte:head>
	<title>
		Update Username
	</title>
</svelte:head>


<div class="panel" id="profile-info">
    <PanelHeader>
        <span slot="text">
            update username
        </span>
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